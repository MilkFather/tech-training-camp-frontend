import * as util from './util.js'
import * as def from './def.js'

const cancontain = function(parent_type, child_type){
    return ( parent_type === def.BLID_DOC ||
             parent_type === def.BLID_QUOTE ||
             parent_type === def.BLID_LISTITEM ||
             (parent_type === def.BLID_LIST && child_type === def.BLID_LISTITEM) );
}

const findcontainerblockfor = function(blocktype, ast) {
    let result = ast;
    while (!cancontain(result.nodetype, blocktype)) {
        result = result.parent;
    }
    return result; // at least we can end up at document
}

const acceptslines = function(block_type) {
    return ( block_type === def.BLID_PARA ||
             block_type === def.BLID_CODE );
};

const closeUnmatched = function(parserstatus) {
    while (parserstatus.oldtip !== parserstatus.lastMatched) {
        close_block(parserstatus.oldtip);
        parserstatus.oldtip = parserstatus.oldtip.parent;
    }
}

const makeNode = function(blid, parserstatus) {
    while (!cancontain(parserstatus.tip.nodetype, bild)) {
        closeUnmatched(parserstatus);
    }
    let newnode = new util.astnode(bild, parserstatus.tip);
    parserstatus.tip.childs.push(newnode);
    parserstatus.tip = newnode;
    return newnode;
}

export const consumeLine = function(line, ast, parserstatus) {
    line = util.tab2space(line);
    parserstatus.oldtip = parserstatus.tip;
    let linepos = 0;

    // parse line start markers
    let container = ast;
    let lastChild;
    let all_match = true;
    while ((lastChild = container.last_child()) && !lastChild.closed) {
        container = lastChild;
        // find line indent. Indented code blocks possible...
        let first_nonspace_index;
        let blank_line;
        let nonspace_match = util.matchsinceindex(RE_NOSPACE, line, linepos);
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
                    if (indent <= 3 && line[first_nonspace_index] === container.fencechar && closing_code_fence[0].length >= container.fencelen) {
                        // fence closed. RE_CLOSECODEFENCE matches line end. Early return.
                        all_match = false;
                        close_block(container);
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

            case 'paragraph':
                if (blank_line) {
                    all_match = false;
                }
                break;

            default: break;
        }
        if (!all_match) {
            // search end early...
            container = container.parent;
            parserstatus.lastMatched = container;
            break;
        }
    }

    // now, we have consumed all continuation markers, we try to create new blocks
    while (true) {
        let t = container.nodetype;
        let first_nonspace_index;
        let blank_line;
        let nonspace_match = util.matchsinceindex(RE_NOSPACE, line, linepos);
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
                linepos += CODE_INDENT;
                closeUnmatched(parserstatus);
                container = makeNode(def.BLID_CODE, parserstatus);
            }
        }

        linepos = first_nonspace_index;
        let mark = line[linepos];
        let match;

        if (mark === '>') {
            // block quote
            let lastcontainerblock = findcontainerblockfor('quote', container);
            linepos += 1; // consume the '>' symbol
            if (line[linepos] == ' ') linepos += 1; // consume an optional space after '>' too
            let newnode = new util.astnode('quote', lastcontainerblock);
            lastcontainerblock.childs.push(newnode);
            container = newnode;
        } else if ((match = line.slice(linepos).match(RE_HEADER))) {
            // header
            let lastcontainerblock = findcontainerblockfor('header', container);
            linepos = line.length;
            let newnode = new util.astnode('header', lastcontainerblock);
            newnode.level = match[0].trim().length;
            newnode.strings.push(line.slice(linepos).replace(/^ *#+ *$/, '').replace(/ +#+ *$/, ''));
            lastcontainerblock.childs.push(newnode);
            container = newnode;
        } else if ((match = line.slice(linepos).match(RE_CODEFENCE))) {
            // start of fenced code block
            let lastcontainerblock = findcontainerblockfor('codeblock', container);
            let fencelen = match[0].length;
            let newnode = new util.astnode('codeblock', lastcontainerblock);
            newnode.codeblocktype = 'fence';
            newnode.fencelen = fencelen;
            newnode.fencechar = match[0][0];
            newnode.fenceindent = indent;
            lastcontainerblock.childs.push(newnode);
            container = newnode;
            linepos += fencelen;
        } else if (util.matchsinceindex(RE_HRULE, line, linepos) >= 0) {
            // <hr>
            linepos = line.length - 1;
            let lastcontainerblock = findcontainerblockfor('hr', container);
            let newnode = new util.astnode('hr', lastcontainerblock);
            lastcontainerblock.childs.push(newnode);
            container = newnode;
        } else {
            break;
        }
    }

    if (!line[linepos]) return ast;

    // now we have consumed all markers, what remains are text.
    let lastcontainerblock = findcontainerblockfor('text', container);
    if (lastcontainerblock.nodetype == 'paragraph' && !lastlineisblank) {
        // just a lazy break
        lastcontainerblock.strings.push(line.slice(linepos));
    } else if (lastcontainerblock.nodetype == 'codeblock') {
        lastcontainerblock.strings.push(line.slice(linepos));
    } else {
        // new paragraph block
        lastcontainerblock = findcontainerblockfor('paragraph', container);
        let newnode = new util.astnode('paragraph', lastcontainerblock);
        newnode.strings.push(line.slice(linepos));
        lastcontainerblock.childs.push(newnode);
        container = newnode;
    }

    return ast;
}

const close_block = function(block, parserstatus) {
    if (block.closed) {
        return;
    }
    block.closed = true;

    switch (block.blocktype) {
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
    parserstatus.tip = block.parent || parserstatus.root;
}