import * as util from './util.js'

const CODE_INDENT = 4;

const RE_HEADER = /^#{1,6}(?: +|$)/;
const RE_NOSPACE = /[^ \t\n]/;
const RE_CLOSECODEFENCE = /^(?:`{3,}|~{3,})(?= *$)/;

export const consumeLine = function(line, ast) {
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

            case ''

        }
    }
    return ast;
}