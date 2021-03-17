import { MarkdownEditor } from './editor/editor.js'
import { markdown } from './junk/markdown.js'

const urlParams = new URLSearchParams(window.location.search);
let editor;
if (urlParams.get('markdownit')) {
    console.log('Backend renderer: Markdown-it')
    editor = new MarkdownEditor('editor-0', (src) => {
        let md = window.markdownit();
        return md.render(src);
    });
} else {
    console.log('Backend renderer: JUNK')
    editor = new MarkdownEditor('editor-0', markdown);
}

document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('container').appendChild(editor.el);
})