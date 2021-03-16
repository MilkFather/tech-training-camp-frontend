import * as util from './util.js'
import { consumeLine } from './blocks.js'

export function markdown(src) {
    let lines = util.breaklines(src);
    lines = util.notrailingblankline(lines);
    let ast = new util.astnode('document', '');
    for (let l of [... lines]) {
        // main loop
        consumeLine(l, ast);
    }
    // close any unclosed block
    closeast(ast);
    // parse inline marks
    parseinline(ast);
    // render the tree
    let htm = compileast(ast);
    return htm;
}

function closeast(ast) {
    if (ast.closed) {
        return;
    }
    for (let i = 0; i < ast.childs.length; ++i) {
        closeast(ast.childs[i]);
    }
    ast.closed = true;
}

function parseinline(ast) {
    // dummy
}

function compileast(ast) {

}