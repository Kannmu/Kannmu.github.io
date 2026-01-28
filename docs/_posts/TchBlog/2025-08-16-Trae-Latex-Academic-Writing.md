---
layout: post
title: "[Tch] 进入AI辅助写作：使用Trae+Latex+Zotero来加速学术写作"
subtitle: "Entering the AI Era: Accelerate Academic Writing with Trae+Latex+Zotero" 
author: "Kannmu"
header-img: "/img/Photography/Humanistic/DSC3869.jpg"
header-mask: 0.4
tags:
  - AI
  - Latex
  - 学术写作
  - LLM
  - Trae
  - Zotero
---

## 引言

在当今信息爆炸的时代，学术写作面临着越来越多的挑战。如何在有限的时间内完成一篇高质量的学术论文，成为了每一个学术工作者的共同目标。而AI技术的快速发展，为学术写作提供了新的可能性。通常的在网页或者客户端窗口中使用AI工具进行写作辅助已经非常常见，但是这些工具通常只能提供简单翻译、润色等基础写作支持，而无法满足复杂的学术需求下的上下文、自动化书写修改等功能。

而Trae+Latex的组合，为学术写作提供了新的解决方案。Trae是一个AI-powered integrated development environment (IDE)，它可以帮助用户快速创建、管理和协作项目。而Latex则是一个专业的文档排版系统，它可以帮助用户快速排版、生成专业的学术论文。而Zotero则是一个专业的参考文献管理工具，它可以帮助用户快速管理、引用参考文献。

## The Tools

### Trae

[Trae](https://www.trae.ai/) 是一个功能强大的AI编程助手，但它的能力远不止于编码。Trae可以作为一个多功能的文本编辑器，特别适合于需要大量文本处理和生成的任务，比如撰写学术论文。其“Builder”模式能够根据你的指令，自动生成和修改文本内容，极大地提高了写作效率。

Trae作为一个自适应的AI IDE，旨在通过与您的协作来改变您的工作方式，从而[更快地运行](https://www.producthunt.com/products/trae)。 它提供了[自动任务分解、代码分析和生成以及通过“构建器”和“聊天”模式提供的实时帮助等功能](https://www.futuretools.io/tools/trae-ai)。 各种水平的开发人员都可以使用Trae AI来[提高生产力、自动化任务并在其工作流程中利用先进的AI功能](https://www.futuretools.io/tools/trae-ai)。

以下是Trae的一些主要功能：

* **自动任务分解**: Trae可以自动将复杂的任务分解成[更小、更易于管理的步骤](https://www.futuretools.io/tools/trae-ai)。
* **代码分析和生成**: Trae可以分析您现有的代码并生成新的代码，从而[帮助您更快地编写代码](https://www.futuretools.io/tools/trae-ai)。
* **实时协助**: Trae通过其“构建器”和“聊天”模式提供实时协助，因此您可以在需要时[获得帮助](https://www.futuretools.io/tools/trae-ai)。
* **免费使用**: Trae提供[免费试用](https://www.futuretools.io/tools/trae-ai)，因此您可以在购买前试用。

### LaTeX

[LaTeX](https://www.latex-project.org/) 是学术界公认的专业排版系统。与所见即所得的编辑器不同，LaTeX通过代码来控制文档的格式，能够生成精美、专业的PDF文档。对于包含复杂公式、图表和交叉引用的学术论文来说，LaTeX是无可替代的选择。

使用LaTeX进行学术写作有很多好处：

* **专业排版**: LaTeX可以生成高质量的排版，尤其是在处理复杂的数学公式、表格和图表时。
* **自动化**: LaTeX可以自动处理章节编号、参考文献、图表编号等，从而节省您的时间。
* **模板**: 有许多可用的[LaTeX模板](https://www.overleaf.com/latex/templates)，可以帮助您快速开始撰写论文、简历、演示文稿等。
* **协作**: [Overleaf等在线LaTeX编辑器](https://scholarly.so/blog/how-to-use-latex-for-academic-writing)使与他人协作变得容易。

如果您是LaTeX的新手，[Overleaf](https://www.overleaf.com/)是一个很好的起点。它是一个在线LaTeX编辑器，[易于使用，无需安装](https://www.overleaf.com/)。

### Zotero

[Zotero](https://www.zotero.org/) 是一款免费、开源的参考文献管理工具。它可以帮助你轻松地收集、组织、引用和分享文献资源。通过浏览器插件，你可以方便地将网页、文章等信息保存到Zotero中，并自动抓取元数据。

Zotero的一些主要功能包括：

* **自动收集**: Zotero可以[自动从网页、数据库和图书馆目录中抓取引文信息](https://www.zotero.org/)。
* **多种格式**: Zotero[支持多种引文格式，并可以轻松地在Word、LibreOffice和Google Docs中创建参考文献和书目](https://www.zotero.org/)。
* **同步与协作**: Zotero可以[在多台设备之间同步您的文献库，并允许您与他人协作](https://en.wikipedia.org/wiki/Zotero)。
* **免费和开源**: Zotero是[免费和开源的](https://en.wikipedia.org/wiki/Zotero)，这意味着您可以自由地使用、修改和分发它。

## The Workflow

现在，让我们来看看如何将这三者结合起来，打造一个高效的学术写作工作流。

### Step 1: 使用Zotero和Deepseek-Chat自动生成论文摘要

这个工作流的核心之一是利用AI自动生成论文总结。通过一个自定义的JavaScript脚本，我们可以让Zotero调用[Deepseek-Chat](https://chat.deepseek.com/)模型，为选中的、带有PDF附件的文献条目自动生成全文总结。

这个脚本([Script](/Data/Zotero_Script_For_Paper_Summary_Using_Deepseek_API.js))会自动将生成的总结作为一个note（笔记）附加到对应的文献条目下。这样，你就可以在Zotero中快速浏览每篇论文的核心内容，而无需打开PDF文件。

复制这个脚本到Zotero的`Run Script`窗口中，然后在Zotero中选择想要总结的条目，之后点击`Run Script`按钮，等待程序执行结束后，你就可以在Zotero中看到每个条目下看到AI总结好的Paper Summary啦。

### Step 2: 使用BetterBiblatex管理参考文献

为了让Trae的AI能够理解我们的文献库，我们需要使用[BetterBiblatex](https://retorque.re/zotero-better-bibtex/)插件。这个插件可以让我们更灵活地导出`.bib`文件。

我们需要配置两次不同名称的导出：

1. **包含笔记的`.bib`文件`Full.bib`:** 在导出选项中勾选“Export Notes”。这个版本的`Full.bib`文件将包含所有论文的摘要信息。我们可以将这个文件上传给Trae的AI，让它拥有一个包含丰富上下文的文献数据库。
2. **不包含笔记的`.bib`文件`Base.bib`:** 这个版本是用于LaTeX编译的。因为LaTeX会将`Base.bib`文件中的所有内容都添加到参考文献部分，我们不希望将论文摘要也包含进去。

### Step 3: 在Trae中使用Builder模式进行写作

现在，我们可以在Trae中开始写作了。在Trae的“Builder”模式下，我们可以向AI发出指令，并上传`Full.bib`文件，让它自动撰写和修改`.tex`文件中的内容。

由于我们已经为Trae的AI提供了包含论文总结的`Full.bib`文件，AI在写作时就能够更好地理解参考文献的上下文，从而生成更准确、更相关的引用。

此外，我们还可以在Trae的“Project Rule”中添加一些规则，比如论文的总体创新点、写作注意事项、以及LaTeX的书写格式要求等。这样，AI在每次修改时都会遵守这些规则，保证了论文的一致性和规范性。

## 结论

通过将Trae、LaTeX和Zotero三者结合，我们可以打造一个高效、智能的学术写作工作流。这个工作流不仅能够极大地提高写作效率，还能够帮助我们更好地管理文献、保证论文质量。

## 资源

* [Trae](https://www.trae.ai/)
* [The LaTeX Project](https://www.latex-project.org/)
* [Zotero](https://www.zotero.org/)
* [Better BibTeX for Zotero](https://retorque.re/zotero-better-bibtex/)
* [Deepseek-Chat](https://chat.deepseek.com/)





