---
layout: post
title: "[Paper Reading] Eye tracking and eye expression decoding"
subtitle: "Paper reading"
author: "Kannmu"
# header-style: text
header-img: "../../../../img/Photography/Art/DSC3948.jpg"
header-mask: 0.4
tags:
  - Paper
  - Eye tracking
  - 眼动追踪
  - 论文研读
---

> 论文地址：https://www.nature.com/articles/s41467-023-39068-2
>
> 本文是中国科学院北京纳米能源与纳米系统研究所， 中国科学院纳米科学卓越中心，微纳能量与传感器北京市重点实验室以及清华大学新型陶瓷与精细加工国家重点实验室进行的研究。**主要研究内容在实现的电极纳米材料的性质、设计上。**眼动追踪为应用场景。

## 概述

本文主要目的是实现非接触式**主动眼动追踪 Active Eye Tracking(AET)**，主要使用的原理为静电感应。

传感器部分使用三层的三明治电极结构（一层纳米银线层(Ag NWs)，一个基于PDMS的绝缘层，以及一个S-PDMS的介电层），柔性可弯折，贴附在眼镜上。悬浮于眼周皮肤上一段距离。

![Interface_Array.png](https://p.sda1.dev/19/d425bfdc876221a77d450eb2ed831fe0/Interface_Array.png)

<center><font size=2>传感器电极实物图</font></center>

透明柔性电极靠近悬浮在眼周皮肤表面，电极最靠近眼睛的一层(S-PDMS)被充上负电荷，这样眼睑睫毛便会感应出正电荷。当眼睑和睫毛产生运动时，内层导体电极层(Ag NWs)便可以感应获得到眼动电信号。之后进行信号处理与分类识别。

信号处理以及控制部分

最终实现了**5°**的眼球转动检测精度。以及眨眼等动作的检测。并可以进行闭眼的眼动检测，这对研究REM快速眼动周期睡眠有用。

## 电极

### 电极结构与柔性可靠性

电极使用三层三明治结构，包含PDMS的两层均为透明材料。

(PDMS-PCTFE) / (Ag NWs) / (PDMS)。示意如下:

![Triple_Layer_electrode.png](https://p.sda1.dev/19/25737d2fe9ed78a2a1dd2c8d85b54819/Triple_Layer_electrode.png)

<center><font size=2>三层电极形式示意图</font></center>

最外层结构层使用聚二甲基硅氧烷（PDMS）作为基体层，其余两层贴附在基体层上。如图所示：

![Installation_Diagram.png](https://p.sda1.dev/19/e89081f0c862359ab6f2a28f4fd4e6ee/Installation_Diagram.png)

<center><font size=2>层叠安装方式（两个PDMS层为透明的，可能看的不是很清楚）</font></center>

最内侧的S-PCTFE层使用PCTFE在PDMS上形成了一层薄膜。在使用前通过电晕放大来充上负电荷，从而使眼睑感应出正电荷。

这种双层结构具有界面捕获能力，即PCTFE能够在其表面捕获电荷，并将其储存在界面上。这种界面捕获能力可以增强电荷储存效应，使AET系统能够实现更持久的电荷密度，并在多次非接触操作循环中保持电荷稳定不耗散。

两个PDMS层均经过等离子体处理(PT-PDMS)来获得更好的透明度以及粘性力

中间层Ag NWs为纳米银线层，这里作为静电感应的导体电极使用。银线还被经过预刻蚀处理，来获得锯齿状的边缘，从而可以控制改变自身电容。

![AgNWs_and_S-PCTFE.png](https://p.sda1.dev/19/8ce734b014e6014b2704b74e8c51a637/AgNWs_and_S-PCTFE.png)

<center><font size=2>Ag NWs的刻蚀处理以及S-PCTFE结构</font></center>

为了证明柔性电极在弯折拉伸情况下仍能使用，对复合层叠结构的电阻以及透明度特性进行实验测试如下：

![Res_Transmit.png](https://p.sda1.dev/19/e40acfe43b40115d732e70b9a7ae7b91/Res_Transmit.png)

<center><font size=2>实验测试得到材料的电阻以及透明度特性</font></center>

### 介电材料选择及优化

接下来本文叙述证明了选择使用PCTFE作为电荷收集层材料的理由。

实验测试并对比了PVC、PTFE和PCTFE三种材料的电荷储存能力（电晕极化后转移电荷量）、介电性能（表面电荷密度、电荷保持能力）

使用密度泛函理论density functional theory (DFT)计算了三种材料的静电势表面形状。

最终从理论和实验两个方面解释了为什么选择PCTFE作为最终的电极材料。

![Material_Test.png](https://p.sda1.dev/19/f711f83910d90eb65ba1f5595e49d31c/Material_Test.png)

<center><font size=2>三种材料的电荷性能测试</font></center>

同时也对该材料在不同的温湿度和气流大小的情况下进行了稳定性研究，结果证明在温度40℃、湿度90%以及任何气流大小的条件以均下可以保证电压信号的稳定，并在超过这些条件的情况下仅有有限的影响。

![Env_Test.png](https://p.sda1.dev/19/b8d8b0a5bd4a7ba947605be15a1d0bab/Env_Test.png)

<center><font size=2>环境稳定性实验</font></center>

## 眼周电极阵列

### 电极设置

下一步通过3D扫描向四个方向看时眼睑以及肌肉的形状特征，确定将电极放置在尽可能靠近眼动幅度最明显的区域，从而实现最大的信号敏感度。

设计使用四个电极通道，两个垂直通道VC1、VC2和两个水平通道HC1、HC2。

其中，**VC1**被放置在当眼睛向前平视时靠近上眼睑中部的位置，**VC2**对应的放置在下眼睑的中部。

而**HC1与HC2**则被安放在**VC2**的两侧，在这里可以检测到最大的下眼睑信号。如图所示：

![Array_Setup.png](https://p.sda1.dev/19/1d6defec6ecd2eef28a5918fb87458be/Array_Setup.png)

<center><font size=2>电极阵列位置</font></center>

基体层和电极层、介电层都是柔性的，可以粘贴在任意曲度的镜片上。从而增加实用性。

### 眨眼检测举例

以眨眼动作过程举例电极工作流程，如图所示：

![Blink_Test.png](https://p.sda1.dev/19/1538d276201df8a0914b101e17824701/Blink_Test.png)

<center><font size=2>眨眼检测举例</font></center>

眨眼过程导致上眼睑运动，带动眼睑和睫毛上的感应正电荷运动。同时会使Ag NWs银线层的感应电压发生变化。从而获得到眨眼信号。

设置当眼球平视前方睁开时四个通道的电位都为0V，整个眨眼动作中四个通道电压信号如下图所示：

![Blink_Signal_Data.png](https://p.sda1.dev/19/bfbd421b915801ca9527fce88e41ddcd/Blink_Signal_Data.png)

<center><font size=2>眨眼过程四通道电压信号</font></center>

### 眼球转动检测

文中表示，这样的电极阵列对眼球的转动非常的灵敏。

对眼球转动的检测实验设置和数据如下图所示：

![Rotate_Exp.png](https://p.sda1.dev/19/1b281f3fa17856e8f7096ce66f0665ad/Rotate_Exp.png)
![Chanel_Label.png](https://p.sda1.dev/19/b0685316daff221da22270d502489c2e/Chanel_Label.png)

<center><font size=2>眼动追踪测试实验</font></center>

## 眼动追踪

本文设计了两处应用来检验改电极装置的眼动追踪能力。

如下图所示，第一个实验目标为识别检验出眼球朝向周围八个方向的运动动作。使用VGG神经网络来拟合数据构建模型。可以实现97%的识别准确率。不过仅能得到眼球转动的朝向。不能精确的追踪视线焦点。

![Eye_Move.png](https://p.sda1.dev/19/8c93934b175e4cb3f7bb3f880d71b136/Eye_Move.png)

第二个应用是对ALS肌肉萎缩病人的交互方式。编码了8个眼动动作，具体动作与指令对应关系如下：

|  动作  |   指令   |
| :-----: | :------: |
| 2次眨眼 | 左键单击 |
| 3次眨眼 | 右键单击 |
| 4次眨眼 | 左键双击 |
| 2秒凝视 | 休眠静止 |
| 向上看 | 鼠标向上 |
| 向下看 | 鼠标向下 |
| 向右看 | 鼠标向右 |
| 向左看 | 鼠标向左 |

在同样经过基于CNN的VGG网络训练后，在测试集上模型识别准确率为100%

## 结论

证明了该系统可以捕捉到眼部动作，并通过两个应用验证有一定的实用价值。实现了5°的眼球转动检测精度。通过该方法可以实现闭眼的眼动检测，这对研究快速眼动周期（REM）睡眠有很不错的帮助。
