import { MarkdownEditor } from './editor/editor.js'
import * as ext from './editor/editor-tool.js'
import { markdown } from './junk/markdown.js'

const urlParams = new URLSearchParams(window.location.search);
let editor;
let extensions = [
    ext.MarkdownEditToolbarItemSave,
    ext.MarkdownEditToolbarItemH1,
    ext.MarkdownEditToolbarItemH2,
    ext.MarkdownEditToolbarItemH3,
    ext.MarkdownEditToolbarItemH4,
    ext.MarkdownEditToolbarItemH5,
    ext.MarkdownEditToolbarItemH6,
    ext.MarkdownEditToolbarItemBold,
    ext.MarkdownEditToolbarItemItalic,
    ext.MarkdownEditToolbarItemDel,
    ext.MarkdownEditToolbarItemUList,
    ext.MarkdownEditToolbarItemOList,
    ext.MarkdownEditToolbarItemQuote,
    ext.MarkdownEditToolbarItemCode,
    ext.MarkdownEditToolbarItemLink,
    ext.MarkdownEditToolbarItemImage
]
if (urlParams.get('markdownit')) {
    console.log('Backend renderer: Markdown-it')
    editor = new MarkdownEditor('editor-0', (src) => {
        let md = window.markdownit();
        return md.render(src);
    }, extensions);
} else {
    console.log('Backend renderer: JUNK')
    editor = new MarkdownEditor('editor-0', markdown, extensions);
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('container').appendChild(editor.el);
})

window.addEventListener('beforeunload', function(e) {
    if (!editor.isDirty()) return undefined;
    var confirmationMessage = '您有尚未保存的更改。您是否要离开页面？';

    (e || window.event).returnValue = confirmationMessage; //Gecko + IE
    return confirmationMessage; //Gecko + Webkit, Safari, Chrome etc.
})