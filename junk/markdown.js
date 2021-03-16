import * as util from './util.js'
import { consumeLine } from './blocks.js'

export function markdown(src) {
    let lines = util.breaklines(src);
    lines = util.notrailingblankline(lines);
    let ast = new util.astnode('document', null);
    let lastlineisblankline = false;
    for (let l of [... lines]) {
        // main loop
        consumeLine(l, ast, lastlineisblankline);
        lastlineisblankline = util.isblankline(l);
    }
    console.log(ast);
    //closeast(ast);
    // parse inline marks
    //parseinline(ast);
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

function compileast(c) {
    if (c.childs.length <= 0) {
        return c.text();
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