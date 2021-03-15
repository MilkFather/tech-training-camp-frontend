import * as util from './util.js'

const RE_HEADER = /^#{1,6}(?: +|$)/;

export const consumeLine = function(line, ast) {
    line = util.tab2space(line);
    return ast;
}