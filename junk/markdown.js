class astnode {
    constructor(ntype, text) {
        this.nodetype = ntype;
        this.childs = [];
        this.text = text;
        this.closed = false;
    }

    isleaf = () => {
        return this.childs.length <= 0;
    }
}

export function markdown(src) {
    let lines = breaklines(src);
    ast = new astnode('document', '');
    for (l of [... lines]) {
        // main loop
        dispatchline(l, ast);
    }
    // close any unclosed block
    closeast(ast);
    // parse inline marks
    parseinline(ast);
    // render the tree
    let htm = compileast(ast);
    return htm;
}

function dispatchline(line, ast) {
    // h1-h6
    if (line.match(H_REGEX)) {
        console.log("h");
    }
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