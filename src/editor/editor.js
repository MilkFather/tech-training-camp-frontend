export class MarkdownEditor {
    constructor(id, parserfunc, ext) {
        this.editbox = null;
        this.toolbar = null;
        this.preview = null;
        this.el = document.createElement('div');
        this.el.id = id;
        this.el.className = 'editor';
        this.parserfunc = parserfunc;
        this.setChild(ext);
    }

    setChild(ext) {
        this.preview = new MarkdownPreview();
        this.editbox = new MarkdownEditBox(this.preview);
        this.toolbar = new MarkdownEditToolbar(this.editbox, ext);

        this.el.appendChild(this.toolbar.el);
        this.el.appendChild(this.editbox.el);
        this.el.appendChild(this.preview.el);

        this.preview.setMarkdownFunc = this.parserfunc;
        this.editbox.setListener();
    }

    isDirty() {
        return this.editbox.dirty;
    }
}

class MarkdownPreview {
    constructor() {
        this.el = document.createElement('div');
        this.el.className = 'editor-preview';
    }

    setMarkdown(md) {
        let rendered = this.setMarkdownFunc(md);
        this.el.innerHTML = rendered;
    }
}

class MarkdownEditToolbar {
    constructor(editbox=null, extension=[]) {
        this.items = [];
        this.el = document.createElement('div');
        this.editbox = editbox;
        this.el.className = 'editor-edit-toolbar';

        for (let itm of extension) {
            let item = new itm(this.editbox);
            this.items.push(item);
            this.el.appendChild(item.el);
        }
    }
}

class MarkdownEditBox {
    constructor(preview=null) {
        this.el = document.createElement('textarea');
        this.preview = preview;
        this.el.className = 'editor-edit-box';
        this.dirty = false;
    }

    setListener() {
        this.el.addEventListener('input', (event) => {
            this.dirty = true;
            this.preview.setMarkdown(event.target.value);
        });
    }

    getText() {
        return this.el.value;
    }

    insertText(text) {
        let selS = this.el.selectionEnd;
        let tmpstring = this.el.value;
        let tmpstringleft = tmpstring.slice(0, selS);
        let tmpstringright = tmpstring.slice(selS, tmpstring.length);
        this.el.value = tmpstringleft + text + tmpstringright;
        this.el.dispatchEvent(new Event('input'));
        this.el.selectionStart = selS;
        this.el.selectionEnd = selS + text.length;
        this.el.focus();
    }
}