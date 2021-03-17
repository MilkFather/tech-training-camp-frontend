class MarkdownEditToolbarItem {
    constructor(editor, desc='', hastext=false) {
        this.editor = null;
        this.icon = null;
        this.text = null;

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
        this.icon.style.backgroundImage = 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 enable-background=%22new 0 0 24 24%22 viewBox=%220 0 24 24%22 fill=%22black%22 width=%2218px%22 height=%2218px%22%3E%3Cg%3E%3Crect fill=%22none%22 height=%2224%22 width=%2224%22/%3E%3C/g%3E%3Cg%3E%3Cpath d=%22M5,20h14v-2H5V20z M19,9h-4V3H9v6H5l7,7L19,9z%22/%3E%3C/g%3E%3C/svg%3E")';
    }

    saveFile() {
        let element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(this.editor.getText()));
        element.setAttribute('download', 'Markdown file.md');
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }
}

export class MarkdownEditToolbarItemH1 extends MarkdownEditToolbarItem {
    constructor(editor) {
        super(editor, '插入一级标题', false);
        this.el.addEventListener('click', this.addH1);
        this.icon.style.backgroundImage = 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 10.94 11.64%22%3E%3Cpath d=%22M13.11,11.45H8.63v5.09H6.93V4.89h1.7v5h4.48v-5h1.71V16.54H13.11Z%22 transform=%22translate(-6.93 -4.89)%22/%3E%3Cpath d=%22M17.86,16.54h-.57V13.26H17v-.44a.48.48,0,0,0,.45-.28h.38Z%22 transform=%22translate(-6.93 -4.89)%22/%3E%3C/svg%3E")'
    }

    addH1() {
        this.editor.insertText('\n# 一级标题\n');
    }
}

export class MarkdownEditToolbarItemH2 extends MarkdownEditToolbarItem {
    constructor(editor) {
        super(editor, '插入二级标题', false);
        this.el.addEventListener('click', this.addH2);
        this.icon.style.backgroundImage = 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 12.21 11.64%22%3E%3Cpath d=%22M12.54,11.45H8.07v5.09H6.36V4.89H8.07v5h4.47v-5h1.71V16.54H12.54Z%22 transform=%22translate(-6.36 -4.89)%22/%3E%3Cpath d=%22M18.57,16.54H16.35a3.75,3.75,0,0,1,.19-1.1,2.75,2.75,0,0,1,.65-1c.11-.1.28-.22.5-.38a1.15,1.15,0,0,0,.27-.24.36.36,0,0,0,.07-.24.55.55,0,0,0-.16-.4.58.58,0,0,0-.8,0,.55.55,0,0,0-.16.4h-.56a1.11,1.11,0,0,1,1.12-1.12,1,1,0,0,1,.78.33,1.06,1.06,0,0,1,.32.79,1,1,0,0,1-.33.79l-.13.09-.14.1-.14.1-.16.12a1.9,1.9,0,0,0-.62.88A1.33,1.33,0,0,0,17,16h1.61Z%22 transform=%22translate(-6.36 -4.89)%22/%3E%3C/svg%3E")'
    }

    addH2() {
        this.editor.insertText('\n## 二级标题\n');
    }
}

export class MarkdownEditToolbarItemH3 extends MarkdownEditToolbarItem {
    constructor(editor) {
        super(editor, '插入三级标题', false);
        this.el.addEventListener('click', this.addH3);
        this.icon.style.backgroundImage = 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 12.21 11.71%22%3E%3Cpath d=%22M12.54,11.45H8.07v5.09H6.36V4.89H8.07v5h4.47v-5h1.71V16.54H12.54Z%22 transform=%22translate(-6.36 -4.89)%22/%3E%3Cpath d=%22M18.57,15.46a1.15,1.15,0,0,1-.31.82,1,1,0,0,1-.79.33,1.07,1.07,0,0,1-.79-.32,1.15,1.15,0,0,1-.33-.81h.56a.64.64,0,0,0,.17.41.57.57,0,0,0,.39.16.54.54,0,0,0,.4-.17.57.57,0,0,0,.16-.42.91.91,0,0,0-.15-.54.47.47,0,0,0-.37-.23h-.28v-.55h.24a.41.41,0,0,0,.3-.16.63.63,0,0,0,.16-.44.53.53,0,0,0-.12-.37.46.46,0,0,0-.34-.14.41.41,0,0,0-.44.42l-.56-.07a1,1,0,0,1,.32-.66,1,1,0,0,1,.68-.25,1,1,0,0,1,.72.3,1,1,0,0,1,.29.73,1.35,1.35,0,0,1-.37.91A1.32,1.32,0,0,1,18.57,15.46Z%22 transform=%22translate(-6.36 -4.89)%22/%3E%3C/svg%3E")'
    }

    addH3() {
        this.editor.insertText('\n### 三级标题\n');
    }
}

export class MarkdownEditToolbarItemH4 extends MarkdownEditToolbarItem {
    constructor(editor) {
        super(editor, '插入四级标题', false);
        this.el.addEventListener('click', this.addH4);
        this.icon.style.backgroundImage = 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 12.34 11.64%22%3E%3Cpath d=%22M12.54,11.45H8.07v5.09H6.36V4.89H8.07v5h4.47v-5h1.71V16.54H12.54Z%22 transform=%22translate(-6.36 -4.89)%22/%3E%3Cpath d=%22M18.7,15.57h-.24v1h-.58v-1H16.23v-.41l1.65-2.62h.58V15h.24ZM17.88,15v-1.5L16.93,15Z%22 transform=%22translate(-6.36 -4.89)%22/%3E%3C/svg%3E")'
    }

    addH4() {
        this.editor.insertText('\n#### 四级标题\n');
    }
}

export class MarkdownEditToolbarItemH5 extends MarkdownEditToolbarItem {
    constructor(editor) {
        super(editor, '插入五级标题', false);
        this.el.addEventListener('click', this.addH5);
        this.icon.style.backgroundImage = 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 12.21 11.71%22%3E%3Cpath d=%22M12.54,11.45H8.07v5.09H6.36V4.89H8.07v5h4.47v-5h1.71V16.54H12.54Z%22 transform=%22translate(-6.36 -4.89)%22/%3E%3Cpath d=%22M18.57,15.13a1.56,1.56,0,0,1-.35,1.06,1.13,1.13,0,0,1-.89.42,1.57,1.57,0,0,1-1-.35l.37-.4a1,1,0,0,0,.55.19.65.65,0,0,0,.54-.27,1,1,0,0,0,.21-.67.82.82,0,0,0-.15-.52.49.49,0,0,0-.4-.18.68.68,0,0,0-.48.19l-.55-.07.1-2h1.88v.56H17.07l0,.84a1.53,1.53,0,0,1,.45-.08,1,1,0,0,1,.79.35A1.39,1.39,0,0,1,18.57,15.13Z%22 transform=%22translate(-6.36 -4.89)%22/%3E%3C/svg%3E")'
    }

    addH5() {
        this.editor.insertText('\n##### 五级标题\n');
    }
}

export class MarkdownEditToolbarItemH6 extends MarkdownEditToolbarItem {
    constructor(editor) {
        super(editor, '插入六级标题', false);
        this.el.addEventListener('click', this.addH6);
        this.icon.style.backgroundImage = 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 12.34 11.71%22%3E%3Cpath d=%22M12.54,11.45H8.07v5.09H6.36V4.89H8.07v5h4.47v-5h1.71V16.54H12.54Z%22 transform=%22translate(-6.36 -4.89)%22/%3E%3Cpath d=%22M18.39,14.41a1.31,1.31,0,0,1,.31.92,1.34,1.34,0,0,1-.31.93,1,1,0,0,1-.82.35,1,1,0,0,1-.82-.38,1.75,1.75,0,0,1-.28-1.07,3.13,3.13,0,0,1,.36-1.44,3.68,3.68,0,0,1,1-1.21l.33.45a2.7,2.7,0,0,0-.5.51,2.38,2.38,0,0,0-.35.6h.25A1,1,0,0,1,18.39,14.41ZM18,15.85a.92.92,0,0,0,0-1,.48.48,0,0,0-.4-.21.5.5,0,0,0-.41.19.82.82,0,0,0-.16.49.92.92,0,0,0,.16.55.47.47,0,0,0,.41.22A.48.48,0,0,0,18,15.85Z%22 transform=%22translate(-6.36 -4.89)%22/%3E%3C/svg%3E")'
    }

    addH6() {
        this.editor.insertText('\n###### 六级标题\n');
    }
}

export class MarkdownEditToolbarItemBold extends MarkdownEditToolbarItem {
    constructor(editor) {
        super(editor, '插入粗体记号', false);
        this.el.addEventListener('click', this.addBold);
        this.icon.style.backgroundImage = 'linear-gradient(transparent,transparent),url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2220%22 height=%2220%22 viewBox=%220 0 20 20%22%3E%3Ctitle%3Ebold%3C/title%3E%3Cpath d=%22M8.326 11.274l1.722-4.908s1.305 3.843 1.626 4.907zM13.7 17H17L11.5 3h-3L3 17h3.3l1.24-3.496h4.92z%22/%3E%3C/svg%3E")'
    }

    addBold() {
        this.editor.insertText('**粗体文字**');
    }
}

export class MarkdownEditToolbarItemItalic extends MarkdownEditToolbarItem {
    constructor(editor) {
        super(editor, '插入斜体记号', false);
        this.el.addEventListener('click', this.addItalic);
        this.icon.style.backgroundImage = 'linear-gradient(transparent,transparent),url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2220%22 height=%2220%22 viewBox=%220 0 20 20%22%3E%3Ctitle%3Eitalic%3C/title%3E%3Cpath d=%22M8.605 11.274l3.326-6.543 1.266 6.543zM14.322 17H17L13.703 3h-3L3 17h2.678l2.047-3.995h5.808z%22/%3E%3C/svg%3E")'
    }

    addItalic() {
        this.editor.insertText('*斜体文字*');
    }
}

export class MarkdownEditToolbarItemUList extends MarkdownEditToolbarItem {
    constructor(editor) {
        super(editor, '插入无序列表项', false);
        this.el.addEventListener('click', this.addUList);
        this.icon.style.backgroundImage = 'linear-gradient(transparent,transparent),url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2220%22 height=%2220%22 viewBox=%220 0 20 20%22%3E%3Ctitle%3Ebullet list%3C/title%3E%3Cpath d=%22M7 15h12v2H7zm0-6h12v2H7zm0-6h12v2H7z%22/%3E%3Ccircle cx=%223%22 cy=%224%22 r=%222%22/%3E%3Ccircle cx=%223%22 cy=%2210%22 r=%222%22/%3E%3Ccircle cx=%223%22 cy=%2216%22 r=%222%22/%3E%3C/svg%3E")'
    }

    addUList() {
        this.editor.insertText('\n* 列表项');
    }
}

export class MarkdownEditToolbarItemOList extends MarkdownEditToolbarItem {
    constructor(editor) {
        super(editor, '插入有序列表项', false);
        this.el.addEventListener('click', this.addOList);
        this.icon.style.backgroundImage = 'linear-gradient(transparent,transparent),url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2220%22 height=%2220%22 viewBox=%220 0 20 20%22%3E%3Ctitle%3Enumbered list%3C/title%3E%3Cpath d=%22M7 15h12v2H7zm0-6h12v2H7zm0-6h12v2H7zM2 6h1V1H1v1h1zm1 9v1H2v1h1v1H1v1h3v-5H1v1zM1 8v1h2v1H1.5a.5.5 0 00-.5.5V13h3v-1H2v-1h1.5a.5.5 0 00.5-.5v-2a.5.5 0 00-.5-.5z%22/%3E%3C/svg%3E")'
    }

    addOList() {
        this.editor.insertText('\n1. 列表项');
    }
}

export class MarkdownEditToolbarItemQuote extends MarkdownEditToolbarItem {
    constructor(editor) {
        super(editor, '插入引用项', false);
        this.el.addEventListener('click', this.addQuote);
        this.icon.style.backgroundImage = 'linear-gradient(transparent,transparent),url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2220%22 height=%2220%22 viewBox=%220 0 20 20%22%3E%3Ctitle%3Equotes%3C/title%3E%3Cpath d=%22M7 6l1-2H6C3.79 4 2 6.79 2 9v7h7V9H5c0-3 2-3 2-3zm7 3c0-3 2-3 2-3l1-2h-2c-2.21 0-4 2.79-4 5v7h7V9z%22/%3E%3C/svg%3E")'
    }

    addQuote() {
        this.editor.insertText('\n> 引用行');
    }
}

export class MarkdownEditToolbarItemCode extends MarkdownEditToolbarItem {
    constructor(editor) {
        super(editor, '插入代码块', false);
        this.el.addEventListener('click', this.addCode);
        this.icon.style.backgroundImage = 'linear-gradient(transparent,transparent),url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2220%22 height=%2220%22 viewBox=%220 0 20 20%22%3E%3Ctitle%3Emarkup%3C/title%3E%3Cpath d=%22M6.5 3.5L0 10l1.5 1.5 5 5L8 15l-5-5 5-5zm7 0L12 5l5 5-5 5 1.5 1.5L20 10z%22/%3E%3C/svg%3E")'
    }

    addCode() {
        this.editor.insertText('```\nconsole.log(\'hello, world!\')\n```\n');
    }
}

export class MarkdownEditToolbarItemLink extends MarkdownEditToolbarItem {
    constructor(editor) {
        super(editor, '插入外部链接', false);
        this.el.addEventListener('click', this.addLink);
        this.icon.style.backgroundImage = 'linear-gradient(transparent,transparent),url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2220%22 height=%2220%22 viewBox=%220 0 20 20%22%3E%3Ctitle%3Elink%3C/title%3E%3Cpath d=%22M4.83 15h2.91a4.88 4.88 0 01-1.55-2H5a3 3 0 110-6h3a3 3 0 012.82 4h2.1a4.82 4.82 0 00.08-.83v-.34A4.83 4.83 0 008.17 5H4.83A4.83 4.83 0 000 9.83v.34A4.83 4.83 0 004.83 15z%22/%3E%3Cpath d=%22M15.17 5h-2.91a4.88 4.88 0 011.55 2H15a3 3 0 110 6h-3a3 3 0 01-2.82-4h-2.1a4.82 4.82 0 00-.08.83v.34A4.83 4.83 0 0011.83 15h3.34A4.83 4.83 0 0020 10.17v-.34A4.83 4.83 0 0015.17 5z%22/%3E%3C/svg%3E")'
    }

    addLink() {
        this.editor.insertText('[文字](链接)');
    }
}

export class MarkdownEditToolbarItemImage extends MarkdownEditToolbarItem {
    constructor(editor) {
        super(editor, '插入图片', false);
        this.el.addEventListener('click', this.addImage);
        this.icon.style.backgroundImage = 'linear-gradient(transparent,transparent),url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2220%22 height=%2220%22 viewBox=%220 0 20 20%22%3E%3Ctitle%3Eimage%3C/title%3E%3Cpath d=%22M2 2a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V4a2 2 0 00-2-2zm-.17 13l4.09-5.25 2.92 3.51L12.92 8l5.25 7z%22/%3E%3C/svg%3E")'
    }

    addImage() {
        this.editor.insertText('![图片配字](图片链接)');
    }
}