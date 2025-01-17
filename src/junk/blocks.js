import * as util from './util.js'
import * as def from './def.js'

const cancontain = function(parent_type, child_type){
    return ( parent_type === def.BLID_DOC ||
             parent_type === def.BLID_QUOTE ||
             parent_type === def.BLID_LISTITEM ||
             (parent_type === def.BLID_LIST && child_type === def.BLID_LISTITEM) );
}

const acceptslines = function(block_type) {
    return ( block_type === def.BLID_PARA ||
             block_type === def.BLID_CODE );
};

const closeUnmatched = function(parserstatus) {
    while (parserstatus.oldtip !== parserstatus.lastMatched) {
        close_block(parserstatus.oldtip, parserstatus);
        parserstatus.oldtip = parserstatus.oldtip.parent;
    }
}

const makeNode = function(blid, parserstatus) {
    while (!cancontain(parserstatus.tip.nodetype, blid)) {
        close_block(parserstatus.tip, parserstatus);
    }
    let newnode = new util.astnode(blid, parserstatus.tip);
    parserstatus.tip.childs.push(newnode);
    parserstatus.tip = newnode;
    return newnode;
}

/* copied from reference implementation: too hard to understand */
var parseListMarker = function(ln, offset, indent) {
    var rest = ln.slice(offset);
    var match;
    var spaces_after_marker;
    var data = { type: null,
                 tight: true,  // lists are tight by default
                 bulletChar: null,
                 start: null,
                 delimiter: null,
                 padding: null,
                 markerOffset: indent };
    if (rest.match(def.RE_HRULE)) {
        return null;
    }
    if ((match = rest.match(def.RE_ULMARKER))) {
        spaces_after_marker = match[1].length;
        data.type = 'bullet';
        data.bulletChar = match[0][0];

    } else if ((match = rest.match(def.RE_OLMARKER))) {
        spaces_after_marker = match[3].length;
        data.type = 'ordered';
        data.start = parseInt(match[1]);
        data.delimiter = match[2];
    } else {
        return null;
    }
    var blank_item = match[0].length === rest.length;
    if (spaces_after_marker >= 5 ||
        spaces_after_marker < 1 ||
        blank_item) {
        data.padding = match[0].length - spaces_after_marker + 1;
    } else {
        data.padding = match[0].length;
    }
    return data;
};

export const consumeLine = function(line, ast, parserstatus) {
    line = util.tab2space(line);
    parserstatus.oldtip = parserstatus.tip;
    let linepos = 0;
    let first_nonspace_index;
    let blank_line;

    // parse line start markers
    let container = ast;
    let lastChild;
    let all_match = true;
    while ((lastChild = container.lastChild()) && !lastChild.closed) {
        container = lastChild;
        // find line indent. Indented code blocks possible...
        let nonspace_match = util.matchSinceIndex(def.RE_NOSPACE, line, linepos);
        if (nonspace_match >= 0) {
            first_nonspace_index = nonspace_match; blank_line = false;
        } else {
            first_nonspace_index = line.length; blank_line = true;
        }
        let indent = first_nonspace_index - linepos;

        // try to consume block markers if we want to continue this block...
        switch (container.nodetype) {
            case def.BLID_QUOTE:   // quote block
                if (indent <= 3 && line[first_nonspace_index] === '>') {    // criteria to continue a quote block: no more than 3 spaces before a '>'
                    linepos = first_nonspace_index + 1; // consume the indent and '>' symbol
                    if (line[linepos] == ' ') linepos += 1; // consume an optional space after '>' too
                } else {    // criteria not met, quote ended
                    all_match = false;
                }
                break;

            case def.BLID_HEADER:  // h1-h6
            case def.BLID_HRULE:      // <hr>
                all_match = false;  // criteria never met
                break;

            case def.BLID_CODE:   // code block
                if (container.codeblockfenced) {
                    let closing_code_fence = line.slice(first_nonspace_index).match(def.RE_CLOSECODEFENCE);
                    if (indent <= 3 && line[first_nonspace_index] === container.fencechar && closing_code_fence && closing_code_fence[0].length >= container.fencelen) {
                        // fence closed. RE_CLOSECODEFENCE matches line end. Early return.
                        all_match = false;
                        close_block(container, parserstatus);
                        return;
                    } else {
                        // fence shall not close
                        // remove indention per "Fences can be indented. If the opening fence is indented, content lines will have equivalent opening indentation removed, if present"
                        let i;
                        for (i = 0; i < container.fenceindent; ++i) {
                            if (line[linepos] === ' ') linepos += 1;
                            else break;
                        }
                    }
                } else {
                    if (indent >= def.CODE_INDENT) {
                        linepos += def.CODE_INDENT;
                    } else if (blank_line) {
                        linepos = first_nonspace_index; // end of line whatsoever
                    } else {
                        all_match = false;
                    }
                }
                break;

            case def.BLID_PARA:
                if (blank_line) {
                    all_match = false;
                }
                break;

            case def.BLID_LISTITEM:
                if (blank_line) {
                    linepos = first_nonspace_index;
                } else if (indent >= container.listspec.marketOffset + container.listspec.padding) {
                    linepos += container.listspec.marketOffset + container.listspec.padding;
                } else {
                    all_match = false;
                }
                break;

            default: break;
        }
        if (!all_match) {
            // search end early...
            container = container.parent;
            break;
        }
    }

    let all_close = (container === parserstatus.oldtip);
    parserstatus.lastMatched = container;

    // now, we have consumed all continuation markers, we try to create new blocks
    while (true) {
        let t = container.nodetype;
        let nonspace_match = util.matchSinceIndex(def.RE_NOSPACE, line, linepos);
        if (nonspace_match >= 0) {
            first_nonspace_index = nonspace_match; blank_line = false;
        } else {
            first_nonspace_index = line.length; blank_line = true;
        }
        let indent = first_nonspace_index - linepos;

        if (t === def.BLID_CODE) break; // no we don't try to parse codeblocks

        if (indent > def.CODE_INDENT) { // another indented code...
            //let lastcontainerblock = findcontainerblockfor('codeblock', container);
            if (parserstatus.tip.nodetype !== def.BLID_PARA && !blank_line) {
                linepos += def.CODE_INDENT;
                all_close = all_close || closeUnmatched(parserstatus);
                container = makeNode(def.BLID_CODE, parserstatus);
            }
        }

        linepos = first_nonspace_index;
        let match;
        let data;

        if (line[linepos] === '>') {
            // block quote
            linepos += 1; // consume the '>' symbol
            if (line[linepos] == ' ') linepos += 1; // consume an optional space after '>' too
            all_close = all_close || closeUnmatched(parserstatus);
            container = makeNode(def.BLID_QUOTE, parserstatus);
        } else if ((match = line.slice(linepos).match(def.RE_HEADER))) {
            // header
            linepos += match[0].length;
            all_close = all_close || closeUnmatched(parserstatus);
            container = makeNode(def.BLID_HEADER, parserstatus);
            container.level = match[0].trim().length;
            container.strings.push(line.slice(linepos).replace(/^ *#+ *$/, '').replace(/ +#+ *$/, ''));
            break;
        } else if ((match = line.slice(linepos).match(def.RE_CODEFENCE))) {
            // start of fenced code block
            let fencelen = match[0].length;
            all_close = all_close || closeUnmatched(parserstatus);
            container = makeNode(def.BLID_CODE, parserstatus);
            container.codeblockfenced = true;
            container.fencelen = fencelen;
            container.fencechar = match[0][0];
            container.fenceindent = indent;
            linepos += fencelen;
        } else if (util.matchSinceIndex(def.RE_HRULE, line, linepos) >= 0) {
            // <hr>
            all_close = all_close || closeUnmatched(parserstatus);
            container = makeNode(def.BLID_HRULE, parserstatus);
            linepos = line.length - 1;
            break;
        } else if ((data = parseListMarker(line, linepos, indent))) {
            all_close = all_close || closeUnmatched(parserstatus);
            linepos += data.padding;

            if (t !== def.BLID_LIST || 
                !(container.listspec.type === data.type &&
                  container.listspec.delimiter === data.delimiter &&
                  container.listspec.bulletChar === data.bulletChar)) {
                container = makeNode(def.BLID_LIST, parserstatus);
                container.listspec = data;
            }

            container = makeNode(def.BLID_LISTITEM, parserstatus);
            container.listspec = data;
        } else {
            break;
        }
    }

    // now we have consumed all markers, what remains are text.
    if (!all_close && !blank_line && parserstatus.tip.nodetype === def.BLID_PARA && parserstatus.tip.strings.length > 0) {
        // just a lazy break
        parserstatus.lastlineisblank = false;
        parserstatus.tip.strings.push(line.slice(linepos));
    } else {
        all_close = all_close || closeUnmatched(parserstatus);
        if (blank_line && container.lastChild()) {
            container.lastChild().lastlineisblank = true;
        }
        let nodetype = container.nodetype;
        if (blank_line && !(nodetype === def.BLID_QUOTE || nodetype === def.BLID_HEADER || (nodetype === def.BLID_CODE && container.codeblockfenced))) {
            container.lastlineisblank = true;
        } else {
            container.lastlineisblank = false;
        }

        let walk = container;
        while (walk.parent) {
            walk.parent.lastlineisblank = false;
            walk = walk.parent;
        }

        switch (nodetype) {
            case def.BLID_CODE:
                parserstatus.tip.strings.push(line.slice(linepos));
                break;
            
            case def.BLID_HEADER:
            case def.BLID_HRULE:
                break;

            default:
                linepos = first_nonspace_index;
                if (acceptslines(nodetype)) {
                    parserstatus.tip.strings.push(line.slice(linepos));
                } else if (blank_line) break;
                else {
                    container = makeNode(def.BLID_PARA, parserstatus);
                    parserstatus.tip.strings.push(line.slice(linepos));
                }
                break;
        }
    }
    return ast;
}

export const close_block = function(block, parserstatus) {
    if (block.closed) {
        return;
    }
    block.closed = true;

    switch (block.nodetype) {
        case def.BLID_PARA:
        case def.BLID_HEADER:
            block.text = block.strings.join('\n');
            break;

        case def.BLID_CODE:
            if (block.codeblockfenced) {
                block.codeblockinfo = block.strings[0].trim();
                block.text = block.strings.slice(1).join('\n');
                if (block.strings.length > 1) block.text += '\n';
            } else {
                util.stripFinalBlanklines(block.strings);
                block.text = block.strings.join('\n') + '\n';
            }
            break;

        case def.BLID_LIST:
            break;

        default:
            break;
    }
    parserstatus.tip = block.parent;// || parserstatus.root;
}