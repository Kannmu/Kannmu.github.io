---
layout: post
title: "[Tch] OpenViBE 基础与进行 SSVEP"
subtitle: "OpenViBE Fundamental And SSVEP Test"
author: "Kannmu"
# header-style: text
header-img: "../../../../img/Backgrounds/Bg(18).jpg"
header-mask: 0.4
tags:
  - BCI
  - 脑机接口
  - SSVEP
  - EEG
  - 技术博客
---

## 前言 Intro

最近在进行一些脑机接口的项目，继承前辈们使用 OpenViBE 这个工具，但是发现在互联网上这个工具的相关资料几乎为零，想要进行学习也比较难搞。所以这里记录一下我最近的学习过程，以及 OpenViBE 的一些基本理念与使用方法。希望可以帮到其他在学习这些内容的人。

OpenViBE 的官网在[这里](http://openvibe.inria.fr/)。

下载安装非常简单，这里就不赘述了。

## 基本概念

OpenViBE 为进行脑电与脑机接口相关应用的一款开源软件，主要使用一些流程框图似的可视化编程模块来进行使用。并拆解 数据采集 与 数据处理 为```Acquisition Server```和```Designer```两个软件，中间通过TCP协议传输数据。

目前 OpenViBE的 最新版本为3.5.0，需要注意的是，如果你想找到官方的 SSVEP 实例场景文件，则只能下载 2.2.0 版本及以前的软件。由于图形库依赖老旧停止更新的问题，OpenViBE 在3.0版本以后删除了 SSVEP 相关的两个实例场景。

首先介绍一些关键名词：

1. **Scenario**：场景，OpenViBE 的工程文件，可以保存成如XML等多种格式，用来保存设计好的各种流程。
2. **Box**：算法模块，为 OpenViBE 中的流程最小单位，可以通过拖拽与连线来设计一些处理流程。
3. **Signal**：数据类型，保存了从放大器传输过来的脑电真实数据，连续浮点数型。
4. **Stimulation**：一种标签、标记、代码变量，OpenViBE 使用 Stimulation 型的变量来指示于控制程序流程。Stimulation一般为一串字符串或十六进制数。例如：```OVTK_StimulationId_EndOfFile```代表了一个文件读取到了结尾。```OVTK_StimulationId_Label_00```代表分类第0类标签。更多代码于对应关系在[这里可以找到](http://openvibe.inria.fr/stimulation-codes/)

## 常用模块组件 Commonly Used Boxes

所有的模块 Box 的使用说明可以在[这里](http://openvibe.inria.fr/documentation/3.5.0/Doc_BoxAlgorithms.html)找到。这里我介绍一些最常用的模块的使用方法。

### 1. 获取数据 ```Acquisition client```

```Acquisition client```这个Box的作用为客户端来接收采集软件```Acquisition Server```获取到的数据。

参数：

1. Acquisition server hostname

```Acquisition client```发送数据到的目标IP，默认为本机```localhost```

2. Acquisition server port

```Acquisition client```发送数据到的目标IP，默认为```1024```端口

### 实时采集脑电信号


### 读取文件数据


### 写入文件数据


### 拼接、合并数据


### 滤波器