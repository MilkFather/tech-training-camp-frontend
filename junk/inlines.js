import * as def from './def.js'

export let processinline = function(ast) {
    let i;
    if (ast.childs.length <= 0) {
        let t = ast.text;
        let match;
        // step 1: match image
        while ((match = t.match(def.RE_IMAGE))) {
            let alt = match[1] || '';
            let url = match[2] || '';
            t = t.replace(match[0], `<img src="${url}" alt="${alt}" />`);
        }
        // step 2: match link
        while ((match = t.match(def.RE_LINK))) {
            let txt = match[1] || '';
            let url = match[2] || '';
            t = t.replace(match[0], `<a href="${url}">${txt}</a>`);
        }
        // step 3: match strong emphasis
        while ((match = t.match(def.RE_STRONG))) {
            let word = match[2] || match[5] || '';
            let giveback = match[3] || match[6] || '';
            t = t.replace(match[0], `<strong>${word}</strong>${giveback}`);
        }
        // step 4: match emphasis
        while ((match = t.match(def.RE_EMPH))) {
            let word = match[2] || match[5] || '';
            let giveback = match[3] || match[6] || '';
            t = t.replace(match[0], `<em>${word}</em>${giveback}`);
        }
        // step 5: match del
        t = t.replace(def.RE_DEL, '<del>$1</del>');
        // write back
        ast.text = t;
    } else {
        for (i = 0; i < ast.childs.length; ++i) {
            if (ast.childs[i].nodetype === def.BLID_CODE) continue;
            processinline(ast.childs[i]);
        }
    }
}