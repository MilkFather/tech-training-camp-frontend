import * as def from './def.js'

export let processinline = function(ast) {
    let i;
    if (ast.childs.length <= 0) {
        let t = ast.text;
        console.log(t);
        console.log(t.match(def.RE_STRONG));
    } else {
        for (i = 0; i < ast.childs.length; ++i) {
            if (ast.childs[i].nodetype === def.BLID_CODE) continue;
            processinline(ast.childs[i]);
        }
    }
}