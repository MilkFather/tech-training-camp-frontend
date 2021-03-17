import * as util from './util.js'
import { consumeLine, close_block } from './blocks.js'
import { processinline } from './inlines.js'
import * as def from './def.js'

export function markdown(src) {
    let lines = src.split(/\r\n|\n|\r/);    // split into lines
    let ast = new util.astnode('document', null);
    
    let status = {
        tip: ast,
        oldtip: null,
        root: ast,
    };
    for (let l of [... lines]) {
        consumeLine(l, ast, status);
    }
    while (status.tip) {
        close_block(status.tip, status);
    }
    processinline(ast);
    let htm = compileast(ast);
    return htm;
}

function compileast(ast) {
    if (ast.childs.length <= 0) {
        return ast.text || '';
    }
    let result = '';
    for (let c of ast.childs) {
        switch (c.nodetype) {
            case def.BLID_HEADER:
                result += `<h${c.level}>` + compileast(c) + `</h${c.level}>`;
                break;
            case def.BLID_PARA:
                result += `<p>` + compileast(c) + `</p>`;
                break;
            case def.BLID_QUOTE:
                result += `<blockquote>` + compileast(c) + '</blockquote>';
                break;
            case def.BLID_CODE:
                result += `<pre><code>` + compileast(c) + `</code></pre>`;
                break;
            case def.BLID_LIST:
                if (c.listspec.type === 'ordered')
                    result += `<ol>` + compileast(c) + '</ol>';
                else if (c.listspec.type === 'bullet')
                    result += `<ul>` + compileast(c) + `</ul>`;
                break;
            case def.BLID_LISTITEM:
                result += `<li>` + compileast(c) + `</li>`;
                break;
            case def.BLID_HRULE:
                result += `<hr/>`;
                break;
            default:
                break;
        }
    }
    return result;
}