const CHAR_NEWLINE = String.fromCodePoint(0x000A);
const CHAR_CARRIAGE_RETURN = String.fromCodePoint(0x000D);
const CHAR_SPACE = String.fromCodePoint(0x0020);
const CHAR_TABS = String.fromCodePoint(0x0009);

const H_REGEX = /^( ){0,3}(#){1,6}((( )+(.)*)|$)/gu


breaklines = (text) => {
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

isblankline = (line) => {
    for (chr of [... line]) {
        if (!([CHAR_SPACE, CHAR_TABS].includes(chr))) {
            return false;
        }
    }
    return true;
}