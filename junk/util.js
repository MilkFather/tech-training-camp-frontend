import * as def from './def.js'

export class astnode {
    constructor(ntype, parent) {
        this.nodetype = ntype;
        this.childs = [];
        this.strings = [];
        this.closed = false;
        this.parent = parent;

        this.text = null;
    }

    isLeaf = () => {
        return this.childs.length <= 0;
    }

    lastChild = () => {
        if (this.childs.length <= 0) return null;
        return this.childs[this.childs.length - 1];
    }
}

export const matchSinceIndex = (re, str, start) => {
    let result = str.slice(start).match(re);
    if (result === null) {
        return -1;
    } else {
        return start + result.index;
    }
}

export const tab2space = function(text) {
    let pos;
    const spaces = ['    ', '   ', '  ', ' '];
    while ((pos = text.indexOf('\t')) !== -1) {
        text = text.slice(0, pos) + spaces[pos % 4] + text.slice(pos + 1);
    }
    return text;
}

export const stripFinalBlanklines = function(lines) {
    while (lines.length > 0 && !def.RE_NOSPACE.test(lines[lines.length - 1])) {
        lines.pop();
    }
    return lines;
}