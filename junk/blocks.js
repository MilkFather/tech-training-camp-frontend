import * as util from './util.js'

const CODE_INDENT = 4;

const RE_HRULE = /^(?:(?:\* *){3,}|(?:_ *){3,}|(?:- *){3,}) *$/;
const RE_HEADER = /^#{1,6}(?: +|$)/;
const RE_NOSPACE = /[^ \t\n]/;
const RE_CODEFENCE = /^`{3,}(?!.*`)|^~{3,}(?!.*~)/;
const RE_CLOSECODEFENCE = /^(?:`{3,}|~{3,})(?= *$)/;

const cancontain = function(parent_type, child_type){
    if (child_type === 'header' || child_type === 'hr') {
        return (parent_type === 'document');
    } else 
    return ( parent_type === 'document' ||
             parent_type === 'quote' ||
             parent_type === 'item' ||
             (parent_type === 'list' && child_type === 'item') ||
             (parent_type === 'paragraph' && child_type === 'text') );
}

const findcontainerblockfor = function(blocktype, ast) {
    let result = ast;
    while (!cancontain(result.nodetype, blocktype)) {
        result = result.parent;
    }
    return result; // at least we can end up at document
}

const acceptslines = function(block_type) {
    return ( block_type === 'paragraph' ||
             block_type === 'codeblock' );
};

export const consumeLine = function(line, ast, lastlineisblank=false) {
    line = util.tab2space(line);
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
            case 'quote':   // quote block
                if (indent <= 3 && line[first_nonspace_index] === '>') {    // criteria to continue a quote block: no more than 3 spaces before a '>'
                    linepos = first_nonspace_index + 1; // consume the indent and '>' symbol
                    if (line[linepos] == ' ') linepos += 1; // consume an optional space after '>' too
                } else {    // criteria not met, quote ended
                    all_match = false;
                }
                break;

            case 'header':  // h1-h6
            case 'hr':      // <hr>
                all_match = false;  // criteria never met
                break;

            case 'codeblock':   // code block
                if (container.codeblocktype === 'fence') {
                    let closing_code_fence = line.slice(first_nonspace_index).match(RE_CLOSECODEFENCE);
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
                    if (indent >= CODE_INDENT) {
                        linepos += CODE_INDENT;
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
            break;
        }
    }

    // now, we have consumed all continuation markers, we try to create new blocks
    while (true) {
        let t = container.nodetype;
        let first_nonspace_index;
        let nonspace_match = util.matchsinceindex(RE_NOSPACE, line, linepos);
        if (nonspace_match >= 0) {
            first_nonspace_index = nonspace_match; blank_line = false;
        } else {
            first_nonspace_index = line.length; blank_line = true;
        }
        let indent = first_nonspace_index - linepos;

        if (t == 'codeblock') break; // no we don't try to parse codeblocks

        if (indent > CODE_INDENT) { // another indented code...
            let lastcontainerblock = findcontainerblockfor('codeblock', container);
            linepos += CODE_INDENT;
            let newnode = new util.astnode('codeblock', lastcontainerblock);
            lastcontainerblock.childs.append(newnode);
            container = newnode;
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
            lastcontainerblock.childs.append(newnode);
            container = newnode;
        } else if ((match = line.slice(linepos).match(RE_HEADER))) {
            // header
            let lastcontainerblock = findcontainerblockfor('header', container);
            linepos += match[0].length;
            let newnode = new util.astnode('header', lastcontainerblock);
            newnode.level = match[0].trim().length;
            newnode.strings.append(ln.slice(linepos).replace(/^ *#+ *$/, '').replace(/ +#+ *$/, ''));
            lastcontainerblock.childs.append(newnode);
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
            lastcontainerblock.childs.append(newnode);
            container = newnode;
            linepos += fencelen;
        } else if (util.matchsinceindex(RE_HRULE, line, linepos) >= 0) {
            // <hr>
            linepos = line.length - 1;
            let lastcontainerblock = findcontainerblockfor('hr', container);
            let newnode = new util.astnode('hr', lastcontainerblock);
            lastcontainerblock.childs.append(newnode);
            container = newnode;
        } else {
            break;
        }
    }

    // now we have consumed all markers, what remains are text.
    let lastcontainerblock = findcontainerblockfor('text', container);
    if (lastcontainerblock.nodetype == 'paragraph' && !lastlineisblank) {
        // just a lazy break
        lastcontainerblock.strings.append(line.slice(linepos));
    } else if (lastcontainerblock.nodetype == 'codeblock') {
        lastcontainerblock.strings.append(line.slice(linepos));
    } else {
        // new paragraph block
        lastcontainerblock = findcontainerblockfor('paragraph', container);
        let newnode = new util.astnode('paragraph', lastcontainerblock);
        newnode.strings.append(line.slice(linepos));
        lastcontainerblock.childs.append(newnode);
        container = newnode;
    }

    return ast;
}