---
layout: post
title: "[Tch] OpenViBE 基础"
subtitle: "OpenViBE Fundamental"
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

## 1. 前言

最近在进行一些脑机接口的项目，继承前辈们使用 OpenViBE 这个工具，但是发现在中文互联网上这个工具的相关资料几乎为零，想要进行学习也比较难搞。所以这里记录一下我最近的学习过程，以及 OpenViBE 的一些基本理念与使用方法。希望可以帮到其他在学习这些内容的人。

OpenViBE 的官网在[**这里**](http://openvibe.inria.fr/)。

下载安装非常简单，这里就不赘述了。

## 2. 基本概念

OpenViBE 为进行脑电与脑机接口相关应用的一款开源软件，主要使用一些流程框图似的可视化编程模块来进行使用。并拆解 数据采集 与 数据处理 为```Acquisition Server```和```Designer```两个软件，中间通过TCP协议传输数据。

> **PS：**目前 OpenViBE的 最新版本为3.5.0，需要注意的是，如果你想找到官方的 SSVEP 示例场景文件，则只能下载 2.2.0 版本及以前的软件。由于图形库依赖老旧停止更新的问题，OpenViBE 在3.0版本以后删除了 SSVEP 相关的两个示例场景。

首先介绍一些关键名词：

1. **```Scenario```：**场景，OpenViBE 的工程文件，可以保存成如XML等多种格式，用来保存设计好的各种流程。
2. **```Box```：**算法模块，为 OpenViBE 中的流程最小单位，可以通过拖拽与连线来设计一些处理流程。
3. **```Signal```：**数据类型，保存了脑电原始数据，连续浮点数型。可以是通过放大器实时采集到的数据，也可以是从现有的数据文件中读取的数据流。
4. **```Stimulation```：**一种标签、标记、代码变量，OpenViBE 使用 Stimulation 型的变量来指示于控制程序流程。Stimulation一般为一串字符串或十六进制数。例如：```OVTK_StimulationId_EndOfFile```代表了一个文件读取到了结尾。```OVTK_StimulationId_Label_00```代表分类第0类标签。更多代码于对应关系在[**这里可以找到**](http://openvibe.inria.fr/stimulation-codes/)

## 3. 界面功能

![Interface](../../../../img/Tch/OpenViBE_Interface.png)

OpenViBE 的界面如上图所示，大致可以分为三个区域。

场景区Scenario与模块库Boxes都很直观好理解，就不多讲了。

唯一需要注意的地方是在Button功能区这里，如下位置：

![Interface](../../../../img/Tch/OpenViBE_Interface_Button.png)

正常的运行Run按钮按下后，会让整个场景按照实际时间流速来运行，在进行实时数据采集时这是非常必要的。

但是有时候我们会在场景中进行模型训练 (如CSP、SVM或者LDA、MLP等)，这个时候数据是来自已经采集好的文件。如果这时仍使用普通的运行Run按钮的话，训练过程将变得非常非常非常缓慢。

这时应该选择右侧的尽可能快按钮 (Run as fast as possible)，这时的运行速度将是正常速度的Max FF Factor倍 (算力允许的范围内，最大100倍)。场景运行后可以在界面的右下角看到系统计算负荷。

## 4. 常用模块组件

所有的模块 Box 的使用说明可以在[**这里**](http://openvibe.inria.fr/documentation/3.5.0/Doc_BoxAlgorithms.html)找到。这里我介绍一些最常用的模块的使用方法。

### 4.1. 实时采集脑电信号

```Acquisition client```这个Box的作用为客户端来接收采集软件```Acquisition Server```获取到的数据。

![Acquisition client](../../../../img/Tch/OpenViBE_Data.png)

在OpenViBE中，每种数据类型使用了一个固定的颜色来表示。如上图所示，粉色输出便代表输出的数据格式为```Signal```类型。

![Acquisition client](../../../../img/Tch/OpenViBE_Acqserver.png)

**参数：**

**Acquisition server hostname** : ```Acquisition client```接收数据地址，默认为本机```localhost```

**Acquisition server port** : ```Acquisition client```接收数据的端口，默认为```1024```端口

### 4.2. 读取文件数据

OpenViBE 提供了多个读取文件的Box，可以支持多种格式数据读取。

主要使用的两种Reader如下图所示：

![File Reader](../../../../img/Tch/OpenViBE_FileReader.png)

```Generic stream reader```负责读取OpenViBE的专有脑电数据格式```.ov```格式的文件，并输出Signal流和Simulation流。

```CSV File Reader```负责读取CSV表格中的数据，并输出Signal流和Simulation流。

**PS：**这两个Reader读取数据的速度也会受上文所说的普通Run按钮和尽可能快按钮的影响。

**参数：**

两个Reader都只有一个文件路径参数，选择需要读取的文件即可。

### 4.3. 写入文件数据

OpenViBE 同样也提供了多个写入数据到文件的Box。

常用的也是```Generic stream writer```与```CSV File Writer```

![File Reader](../../../../img/Tch/OpenViBE_FileWriter.png)

**参数：**

除了写入文件的路径外，```Generic stream writer```还包含一个```use compression```参数，用来控制启用数据压缩功能。默认关闭。

### 4.4. 数据发送

由于OpenViBE的局限性，仅能使用内置了的算法功能。若要对信号进行实时的复杂自定义处理的话，可以将数据通过TCP协议发送到其他软件如Python中进行处理。

这里主要就只有一个```TCP Writer```这个box，功能非常简单，将接收到的数据发送到对应的TCP端口上。具体的通信协议和数据格式可以见[**这里**](http://openvibe.inria.fr/documentation/3.3.0/Doc_BoxAlgorithm_TCPWriter.html)

![File Reader](../../../../img/Tch/OpenViBE_TCPBox.png)

参数：

**Port** : 发送数据的端口号，可以在```0 - 65535```的整数中选择。

可以通过如下操作来设置需要发送的数据类型。注意：一个```TCP Writer```和一个端口号只能发送一个类型的一个数据。需要同时发送多组数据需要使用多个```TCP Writer```，切设定为不同的端口号。在接收端同时接收多个端口发送过来的数据。

![File Reader](../../../../img/Tch/OpenViBE_TCPWriter.png)

经过测定，这个box会对```0.0.0.0```IP发送数据，意味着所有IP的**Port**端口都可以接收到这个数据

一个示例的场景如下：

![File Reader](../../../../img/Tch/OpenViBE_TCP_Demo.png)

经过```Acquisition client```获取到的实时脑电数据，经过```Reference Channel```选取参考通道和```Channel Selector```选择想到的通道这两个Box后，使用```TCP Writer```发送出去，并同时使用```Signal display```这个box来实时绘制出信号波形。

### 拼接、合并数据

这里其实也只有

### 滤波器

