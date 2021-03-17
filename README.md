# tech-training-camp-frontend

本项目同时在GitHub Pages中托管。[访问此处](https://milkfather.github.io/tech-training-camp-frontend/)实际体验。

请务必阅读[开放源代码许可证](./LICENSE.md).

## MarkDown
本项目提供了一个JUNK（**J**ust **U**seable **N**otation **K**iller，刚好能用的标记杀手）Markdown解析器，改写自CommonMark参考实现。功能不齐全，表格拓展写不来，但是至少删除线的拓展写了。

本项目还内嵌了markdown-it项目。该第三方解析器拥有完整的功能，但是默认禁用。如要使用该解析器来替代默认的JUNK解析器，请在浏览器的地址栏末尾加上`?markdownit=1`，或[直接访问这里](https://milkfather.github.io/tech-training-camp-frontend/dist/index.html?markdownit=1)。