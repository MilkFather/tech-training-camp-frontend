import { MarkdownEditor } from './editor/editor.js'
import { markdown } from './junk/markdown.js'

let editor = new MarkdownEditor('editor-0', markdown);

document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('container').appendChild(editor.el);
})