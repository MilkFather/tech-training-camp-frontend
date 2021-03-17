import * as def from './def.js'

export let processinline = function(ast) {
    let i;
    if (ast.childs.length <= 0) {
        let t = ast.text;
        let match;
        // step 1: match image
        t = t.replace(def.RE_IMAGE, '<img src="$2" alt="$1" />');
        // step 2: match link
        t = t.replace(def.RE_LINK, '<a href="$2">$1</a>');
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