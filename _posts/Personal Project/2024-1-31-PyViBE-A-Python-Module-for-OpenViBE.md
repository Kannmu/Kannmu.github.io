---
layout: post
title: "[Project] PyViBE: A Python Module for OpenViBE"
subtitle: "PyViBE: A Python Module for OpenViBE"
author: "Kannmu"
# header-style: text
header-img: "../../../../img/Photography/Art/DSC3948.jpg"
header-mask: 0.3
tags:
    - Python
    - OpenViBE
    - Project
    - EEG
---

## Introduction

OpenViBE是一款常用的开源的脑电采集、分析、交互软件，在该领域内还是比较常用。但是该软件的教程与相关内容在中文互联网上尤其稀缺。因此，我将做实验时用到的使用Python接收OpenViBE数据的代码打包成了PyViBE这个包。通过OpenViBE中的TCPWriter Box发送数据，并在Python段建立TCP链接接受数据并解码。

## Usage

本项目暂时并未打包提交至pypi，不能通过pip进行安装。不过因为功能简单，源码我全部写在一个py文件中。因此克隆或者下载这个文件到目录下便可以import调用使用。

具体使用方法如下：





## License

项目使用MIT License，任何人可以随意修改代码，或者进行商用而不用进行任何通知与说明。
