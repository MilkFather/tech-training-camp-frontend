let editor = new MarkdownEditor('editor-0');

document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('container').appendChild(editor.el);
})