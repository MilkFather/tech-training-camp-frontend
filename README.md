# tech-training-camp-frontend

本项目同时在GitHub Pages中托管。[访问此处](https://milkfather.github.io/tech-training-camp-frontend/)实际体验。

请务必阅读[开放源代码许可证](./OSL.md)。

## Markdown
本项目提供了一个JUNK（**J**ust **U**seable **N**otation **K**iller，刚好能用的标记杀手）Markdown解析器，改写自CommonMark参考实现。功能不齐全，表格拓展写不来，但是至少删除线的拓展写了。

本项目还内嵌了markdown-it项目。该第三方解析器拥有完整的功能，但是默认禁用。如要使用该解析器来替代默认的JUNK解析器，请在浏览器的地址栏末尾加上`?markdownit=1`，或[直接访问这里](https://milkfather.github.io/tech-training-camp-frontend/dist/index.html?markdownit=1)。

## 使用说明
屏幕的左侧是编辑区，右侧是预览区。

左侧编辑区的上方有工具条，从左至右分别提供如下工具：
* 保存
* 插入一级标题
* 插入二级标题
* 插入三级标题
* 插入四级标题
* 插入五级标题
* 插入六级标题
* 插入粗体记号
* 插入斜体记号
* 插入删除记号
* 插入无序列表项
* 插入有序列表项
* 插入引用块
* 插入代码块
* 插入链接
* 插入图片

点击「保存」按钮将会为用户下载当前在编辑区的内容至本地；点击其他按钮将会在编辑区插入分别对应的记号。

用户也可以在编辑区直接输入内容，右侧会实时显示预览。

编辑工具条若一行长度不足以放下所有内容，则工具条会自动换行，相应的编辑区域的高度会进行调整。

## 设计说明
本项目将解析引擎和编辑模块分割开，因而可以分别进行复用。解析引擎和编辑模块均使用ES6 module进行编写。

### 复用解析引擎
在代码当中加入如下内容
```javascript
import { markdown } from 'path/to/markdown.js'
```

导入的`markdown`函数输入Markdown源代码，输出对应的HTML代码
```javascript
html = markdown(source);
```

### 复用编辑模块
#### 引入对应脚本
在HTML当中引入如下CSS文件
```html
<link rel="stylesheet" href="path/to/editor.css">
```
同时引入如下JavaScript代码
```javascript
import { MarkdownEditor } from 'path/to/editor.js'
```
工具栏的工具为插件设计，如需要使用这些插件，请额外加入如下代码
```javascript
import * as ext from 'path/to/editor-tool.js'
```
预览界面的样式定义在如下文件中，您可以自己编写样式来替代默认样式
```html
<link rel="stylesheet" href="path/to/preview-style.css">
```
#### 插入编辑元素
请为编辑区域分配一个容器元素，然后在Javascript中加入如下代码
```javascript
editor = new MarkdownEditor('id', parse_function, extensions);
containerElement.appendChild(editor.el);
```

`MarkdownEditor`接受三个参数。第一个是您为该编辑模块指定的ID。第二个是该编辑模块使用的解析引擎。第三个是您需要加载的工具栏插件。

* 解析引擎需要输入Markdown源代码，输出HTML代码，否则模块不能正常执行。
* 工具栏插件为对象的class数组。数组内元素的顺序与元素在工具栏当中的顺序直接相关。

#### 使用插件
`editor-tool.js`中提供了如下插件（假定您将这些类以`ext`之scope引入）
* `ext.MarkdownEditToolbarItemSave`
* `ext.MarkdownEditToolbarItemH1`
* `ext.MarkdownEditToolbarItemH2`
* `ext.MarkdownEditToolbarItemH3`
* `ext.MarkdownEditToolbarItemH4`
* `ext.MarkdownEditToolbarItemH5`
* `ext.MarkdownEditToolbarItemH6`
* `ext.MarkdownEditToolbarItemBold`
* `ext.MarkdownEditToolbarItemItalic`
* `ext.MarkdownEditToolbarItemDel`
* `ext.MarkdownEditToolbarItemUList`
* `ext.MarkdownEditToolbarItemOList`
* `ext.MarkdownEditToolbarItemQuote`
* `ext.MarkdownEditToolbarItemCode`
* `ext.MarkdownEditToolbarItemLink`
* `ext.MarkdownEditToolbarItemImage`

您可以选择其中的部分插件构建数组，并在创建新的`MarkdownEditor`实例之际将其作为第三个参数赋值，即完成插件导入。

#### 设计新插件
上述预定义插件均为类`MarkdownEditToolbarItem`的子类，该类也定义在`editor-tool.js`当中，并默认导出。

创建新的插件的默认模版为
```javascript
class MarkdownEditToolbarItemNew extends MarkdownEditToolbarItem {
    constructor(editor) {
        super(editor, 'hint text', true);
        this.text.innerText = 'Label';
        this.el.addEventListener('click', this.handler);
        this.icon.style.backgroundImage = 'some image';
    }

    handler = () => {
        this.editor.insertText('some text');
    }
}
```

构造器的`editor`是该编辑模块的输入区域，该部分由`MarkdownEditor`在构建时创造，无需担心。

调用父类的构造器时接受三个参数。第一个参数是该编辑模块的输入区域，第二个是鼠标悬停在该按钮上时显示的提示文字，第三个是是否为该按钮提供一个附加的标签区域。

如果您选择使用标签区域，则您需要为其提供内容。使用
```javascript
this.text.innerText = 'Label';
```
来设置标签文字内容。

您还需要设置按钮事件，请为该类的`el`属性添加事件侦听器。`el`即element，是实际添加在DOM中的元素。

您需要为该按钮提供一副图片。图片需要按照CSS语法引入。只需设置`this.icon.style.backgroundImage`。

最后您需要实现您的按钮事件。请注意您必须使用
```javascript
() => {}
```
的语法编写事件处理函数，否则在函数体内调用`this.editor`将无法得到编辑模块的输入区域对象。

使用
```javascript
this.editor.insertText('some text');
```
来在当前光标处插入文字。