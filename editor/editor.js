import {
    MarkdownEditToolbarItemSave, 
    MarkdownEditToolbarItemBold, 
    MarkdownEditToolbarItemItalic, 
    MarkdownEditToolbarItemUList,
    MarkdownEditToolbarItemOList,
    MarkdownEditToolbarItemQuote,
    MarkdownEditToolbarItemLink,
    MarkdownEditToolbarItemImage
} from './editor-tool.js';

export class MarkdownEditor {
    el = null;
    editbox = null;
    toolbar = null;
    preview = null;

    extensions = [
        MarkdownEditToolbarItemSave,
        MarkdownEditToolbarItemBold,
        MarkdownEditToolbarItemItalic,
        MarkdownEditToolbarItemUList,
        MarkdownEditToolbarItemOList,
        MarkdownEditToolbarItemQuote,
        MarkdownEditToolbarItemLink,
        MarkdownEditToolbarItemImage
    ]

    constructor(id) {
        this.el = document.createElement('div');
        this.el.id = id;
        this.el.className = 'editor';
        this.setChild();
    }

    setChild() {
        this.preview = new MarkdownPreview();
        this.editbox = new MarkdownEditBox(this.preview);
        this.toolbar = new MarkdownEditToolbar(this.editbox, this.extensions);

        this.el.appendChild(this.toolbar.el);
        this.el.appendChild(this.editbox.el);
        this.el.appendChild(this.preview.el);

        this.editbox.setListener();
    }
}

class MarkdownPreview {
    el = null;
    constructor() {
        this.el = document.createElement('div');
        this.el.className = 'editor-preview';
    }

    setMarkdown(md) {
        let rendered = markdown(md);
        this.el.innerHTML = rendered;
    }
}

class MarkdownEditToolbar {
    el = null;
    editbox = null;
    items = [];
    constructor(editbox=null, extension=[]) {
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
    el = null;
    preview = null;
    constructor(preview=null) {
        this.el = document.createElement('textarea');
        this.preview = preview;
        this.el.className = 'editor-edit-box';
    }

    setListener() {
        this.el.addEventListener('input', (event) => {
            this.preview.setMarkdown(event.target.value);
        });
    }

    getText = () => {
        return this.el.value;
    }

    insertText = (text) => {
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