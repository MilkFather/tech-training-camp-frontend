import * as util from './util.js'
import { consumeLine, close_block } from './blocks.js'

export function markdown(src) {
    let lines = src.split(/\r\n|\n|\r/);    // split into lines
    //lines = util.notrailingblankline(lines);
    let ast = new util.astnode('document', null);
    
    let status = {
        tip: ast,
        oldtip: null,
        root: ast,
    };
    for (let l of [... lines]) {
        // main loop
        consumeLine(l, ast, status);
        //console.log(ast);
    }
    while (status.tip) {
        close_block(status.tip, status);
    }
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
            case 'header':
                result += `<h${c.level}>` + compileast(c) + `</h${c.level}>`;
                break;
            case 'paragraph':
                result += `<p>` + compileast(c) + `</p>`;
                break;
            case 'quote':
                result += `<quotation>` + compileast(c) + '</quotation>';
                break;
            case 'codeblock':
                result += `<pre><code>` + compileast(c) + `</code></pre>`;
                break;
            case 'list':
                if (c.ordered)
                    result += `<ol>` + compileast(c) + '</ol>';
                else
                    result += `<ul>` + compileast(c) + `</ul>`;
                break;
            case 'item':
                result += `<li>` + compileast(c) + `</li>`;
                break;
            case 'hr':
                result += `<hr/>`;
                break;
            default:
                console.log(`unrecongized: ${c.nodetype}`);
                break;
        }
    }
    return result;
}