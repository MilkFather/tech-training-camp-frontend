class MarkdownEditToolbarItem {
    editor = null;

    icon = null;
    text = null;
    constructor(editor, desc='', hastext=false) {
        this.el = document.createElement('span');
        this.el.className = 'editor-edit-toolbar-item';

        let inner = document.createElement('a');
        inner.className = 'editor-edit-toolbar-item-inner';
        inner.title = desc;
        this.el.appendChild(inner);

        this.icon = document.createElement('span');
        this.icon.className = 'editor-edit-toolbar-item-icon';
        if (hastext) {
            this.text = document.createElement('span');
            this.text.className = 'editor-edit-toolbar-item-text';
        }
        inner.appendChild(this.icon);
        if (this.text) inner.appendChild(this.text);
        this.editor = editor;
    }
}

export class MarkdownEditToolbarItemSave extends MarkdownEditToolbarItem {
    constructor(editor) {
        super(editor, '保存当前文件', true);
        this.el.addEventListener('click', this.saveFile);
        this.text.innerText = '保存';
        this.icon.style.backgroundImage = 'linear-gradient(transparent,transparent),url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2220%22 height=%2220%22 viewBox=%220 0 20 20%22%3E%3Ctitle%3Ebookmark%3C/title%3E%3Cpath d=%22M5 1a2 2 0 00-2 2v16l7-5 7 5V3a2 2 0 00-2-2z%22/%3E%3C/svg%3E")'
    }

    saveFile = () => {
        let element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(this.editor.getText()));
        element.setAttribute('download', 'Markdown file.md');
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }
}

export class MarkdownEditToolbarItemBold extends MarkdownEditToolbarItem {
    constructor(editor) {
        super(editor, '插入粗体记号', false);
        this.el.addEventListener('click', this.addBold);
        this.icon.style.backgroundImage = 'linear-gradient(transparent,transparent),url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2220%22 height=%2220%22 viewBox=%220 0 20 20%22%3E%3Ctitle%3Ebold%3C/title%3E%3Cpath d=%22M8.326 11.274l1.722-4.908s1.305 3.843 1.626 4.907zM13.7 17H17L11.5 3h-3L3 17h3.3l1.24-3.496h4.92z%22/%3E%3C/svg%3E")'
    }

    addBold = () => {
        this.editor.insertText('**粗体文字**');
    }
}

export class MarkdownEditToolbarItemItalic extends MarkdownEditToolbarItem {
    constructor(editor) {
        super(editor, '插入斜体记号', false);
        this.el.addEventListener('click', this.addItalic);
        this.icon.style.backgroundImage = 'linear-gradient(transparent,transparent),url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2220%22 height=%2220%22 viewBox=%220 0 20 20%22%3E%3Ctitle%3Eitalic%3C/title%3E%3Cpath d=%22M8.605 11.274l3.326-6.543 1.266 6.543zM14.322 17H17L13.703 3h-3L3 17h2.678l2.047-3.995h5.808z%22/%3E%3C/svg%3E")'
    }

    addItalic = () => {
        this.editor.insertText('*斜体文字*');
    }
}

export class MarkdownEditToolbarItemUList extends MarkdownEditToolbarItem {
    constructor(editor) {
        super(editor, '插入无序列表项', false);
        this.el.addEventListener('click', this.addUList);
        this.icon.style.backgroundImage = 'linear-gradient(transparent,transparent),url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2220%22 height=%2220%22 viewBox=%220 0 20 20%22%3E%3Ctitle%3Ebullet list%3C/title%3E%3Cpath d=%22M7 15h12v2H7zm0-6h12v2H7zm0-6h12v2H7z%22/%3E%3Ccircle cx=%223%22 cy=%224%22 r=%222%22/%3E%3Ccircle cx=%223%22 cy=%2210%22 r=%222%22/%3E%3Ccircle cx=%223%22 cy=%2216%22 r=%222%22/%3E%3C/svg%3E")'
    }

    addUList = () => {
        this.editor.insertText('\n* 列表项');
    }
}

export class MarkdownEditToolbarItemOList extends MarkdownEditToolbarItem {
    constructor(editor) {
        super(editor, '插入有序列表项', false);
        this.el.addEventListener('click', this.addOList);
        this.icon.style.backgroundImage = 'linear-gradient(transparent,transparent),url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2220%22 height=%2220%22 viewBox=%220 0 20 20%22%3E%3Ctitle%3Enumbered list%3C/title%3E%3Cpath d=%22M7 15h12v2H7zm0-6h12v2H7zm0-6h12v2H7zM2 6h1V1H1v1h1zm1 9v1H2v1h1v1H1v1h3v-5H1v1zM1 8v1h2v1H1.5a.5.5 0 00-.5.5V13h3v-1H2v-1h1.5a.5.5 0 00.5-.5v-2a.5.5 0 00-.5-.5z%22/%3E%3C/svg%3E")'
    }

    addOList = () => {
        this.editor.insertText('\n1. 列表项');
    }
}

export class MarkdownEditToolbarItemQuote extends MarkdownEditToolbarItem {
    constructor(editor) {
        super(editor, '插入引用项', false);
        this.el.addEventListener('click', this.addQuote);
        this.icon.style.backgroundImage = 'linear-gradient(transparent,transparent),url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2220%22 height=%2220%22 viewBox=%220 0 20 20%22%3E%3Ctitle%3Equotes%3C/title%3E%3Cpath d=%22M7 6l1-2H6C3.79 4 2 6.79 2 9v7h7V9H5c0-3 2-3 2-3zm7 3c0-3 2-3 2-3l1-2h-2c-2.21 0-4 2.79-4 5v7h7V9z%22/%3E%3C/svg%3E")'
    }

    addQuote = () => {
        this.editor.insertText('\n> 引用行');
    }
}

export class MarkdownEditToolbarItemLink extends MarkdownEditToolbarItem {
    constructor(editor) {
        super(editor, '插入外部链接', false);
        this.el.addEventListener('click', this.addLink);
        this.icon.style.backgroundImage = 'linear-gradient(transparent,transparent),url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2220%22 height=%2220%22 viewBox=%220 0 20 20%22%3E%3Ctitle%3Elink%3C/title%3E%3Cpath d=%22M4.83 15h2.91a4.88 4.88 0 01-1.55-2H5a3 3 0 110-6h3a3 3 0 012.82 4h2.1a4.82 4.82 0 00.08-.83v-.34A4.83 4.83 0 008.17 5H4.83A4.83 4.83 0 000 9.83v.34A4.83 4.83 0 004.83 15z%22/%3E%3Cpath d=%22M15.17 5h-2.91a4.88 4.88 0 011.55 2H15a3 3 0 110 6h-3a3 3 0 01-2.82-4h-2.1a4.82 4.82 0 00-.08.83v.34A4.83 4.83 0 0011.83 15h3.34A4.83 4.83 0 0020 10.17v-.34A4.83 4.83 0 0015.17 5z%22/%3E%3C/svg%3E")'
    }

    addLink = () => {
        this.editor.insertText('[文字](链接)');
    }
}

export class MarkdownEditToolbarItemImage extends MarkdownEditToolbarItem {
    constructor(editor) {
        super(editor, '插入图片', false);
        this.el.addEventListener('click', this.addImage);
        this.icon.style.backgroundImage = 'linear-gradient(transparent,transparent),url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2220%22 height=%2220%22 viewBox=%220 0 20 20%22%3E%3Ctitle%3Eimage%3C/title%3E%3Cpath d=%22M2 2a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V4a2 2 0 00-2-2zm-.17 13l4.09-5.25 2.92 3.51L12.92 8l5.25 7z%22/%3E%3C/svg%3E")'
    }

    addImage = () => {
        this.editor.insertText('![图片配字](图片链接)');
    }
}