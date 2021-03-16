export const CHAR_NEWLINE = String.fromCodePoint(0x000A);
export const CHAR_CARRIAGE_RETURN = String.fromCodePoint(0x000D);
export const CHAR_SPACE = String.fromCodePoint(0x0020);
export const CHAR_TABS = String.fromCodePoint(0x0009);

export class astnode {
    constructor(ntype, text) {
        this.nodetype = ntype;
        this.childs = [];
        this.text = text;
        this.closed = false;
    }

    isleaf = () => {
        return this.childs.length <= 0;
    }

    last_child = () => {
        if (this.childs.length <= 0) return null;
        return this.childs[this.childs.length - 1];
    }
}

export const breaklines = function(text) {
    let lines = [];
    let cached = '';
    let ptr = 0;
    while (ptr <= text.length) {
        if (text[ptr] === CHAR_CARRIAGE_RETURN) {
            if (text[ptr + 1] === CHAR_NEWLINE) {
                ptr += 1;
            }
            lines.push(cached);
            cached = '';
        } else if (!text[ptr] || text[ptr] === CHAR_NEWLINE) {
            if (!(!text[ptr] && cached === '')) {
                lines.push(cached);
            }
            cached = '';
        } else {
            cached += text[ptr];
        }
        ptr += 1;
    }
    return lines;
}

export const matchsinceindex = (re, str, start) => {
    let result = str.slice(start).match(re);
    if (result === null) {
        return -1;
    } else {
        return start + result.index;
    }
}

export const isblankline = function(line) {
    for (let chr of [... line]) {
        if (!([CHAR_SPACE, CHAR_TABS].includes(chr))) {
            return false;
        }
    }
    return true;
}

export const notrailingblankline = function(lines) {
    while (lines.length > 0 && isblankline(lines[lines.length - 1])) {
        lines.pop();
    }
    return lines;
}

export const tab2space = function(text) {
    let pos;
    const spaces = ['    ', '   ', '  ', ' '];
    while ((pos = text.indexOf('\t')) !== -1) {
        text = text.slice(0, pos) + spaces[pos % 4] + text.slice(pos + 1);
    }
    return text;
}