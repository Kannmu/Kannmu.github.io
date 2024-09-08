---
layout: post
title: "Effects of VR technology locomotive multi-sensory motion stimuli"
subtitle: "Paper reading"
author: "Kannmu"
# header-style: text
header-img: "../../../../img/Photography/Art/DSC3948.jpg"
header-mask: 0.4
tags:
  - Paper Reading
  - 论文研读
---

## Overall

[**《Effects of virtual reality technology locomotive multi-sensory motion stimuli on a user simulator sickness and controller intuitiveness during a navigation task》**](https://link.springer.com/article/10.1007/s11517-019-02070-2)

**Author:** **Cassandra N. Aldaba、Zahra Moussavi**

《Medical & Biological Engineering & Computing》期刊2019年第58卷

## Intro

**Motivation:** 优化用户体验，研究不同 **VR运动控制器** & **性别** 对 **Stimulator Sickness** 和 **Controller Intuitive** 的影响。

**Gaps:** 以往研究未充分探讨不同 **VR运动控制器** 和潜在 **性别效应** 的影响。

**Objective:** 研究的主要目标是调查不同的虚拟现实(VR)运动控制器对用户模拟器病和控制器直观性的影响。此外，研究还旨在探讨性别对这些变量的潜在影响。

## Method

### Equipments

![Experiment Equipments](https://media.springernature.com/lw685/springer-static/image/art%3A10.1007%2Fs11517-019-02070-2/MediaObjects/11517_2019_2070_Fig1_HTML.png?)

<center> Experiment Equipments </center>

**a TiltChair:** TiltChair 由可沿`z轴`和`y轴`转动的带平衡板座椅的转椅组成。通过板座上的9轴IMU与MCU确定轴的旋转。TiltChair利用用户原地旋转产生的沿`z轴`的旋转变化来改变其在虚拟环境中的航向；并利用用户前倾时沿`y轴`的旋转来控制在虚拟环境中前后移动。导航速度与前倾角度相关。

**b Omni-directional treadmill:** Omni-directional treadmill全向跑步机由一个带有中央地毯凹碗的木结构组成。使用HTC Vive控制器和绑在脚上的减摩拖鞋的用户可以沿着碗的墙壁行走。通过HTC Vive控制器获取用户的脚部位置，并利用步行算法将这种物理运动转化为虚拟运动。

**c VRNChair:** VRNChair是一个手动轮椅操纵杆，之前的研究已经开发出来，用于直观操作和减少模拟器病。它的每个轮子都有一个多极磁环，当轮子转动时，磁编码器检测到磁场变化并生成电脉冲，以此来估计轮椅的速度。通过Bosch Sensortec的BNO055惯性测量单元来估计前进方向，并将速度和方向信息发送到Unity游戏引擎中。

**d Joystick:** **普通手柄摇杆**。不提供任何本体感觉或前庭感觉的输入，主要依赖视觉刺激来控制游戏。

![IMU MCU Hardware](https://media.springernature.com/lw685/springer-static/image/art%3A10.1007%2Fs11517-019-02070-2/MediaObjects/11517_2019_2070_Fig2_HTML.png?)

<center> IMU MCU Hardware </center>

### Experiment one

**目的：** 让参与者使用四种常见的VR移动控制器（TiltChair、全方位跑步机、VRNChair和操纵杆）来执行相同的VR导航任务。旨在探究不同VR移动控制器对用户模拟器病和控制器直观性的影响。

**参与者：** 20名年轻成人（10名男性），年龄、性别均衡。

**任务：** 参与者需要在一个三层的立方体建筑内找到标记有“X”的目标房间。

**测量指标：** 通过模拟器病问卷（Simulator Sickness Questionnaire, SSQ）和姿势摇摆测量（Wii
 Balance Board）来评估模拟器病的严重程度；通过总行进距离和执行时间来评估控制器的直观性。

### Experiment two

**目的：** 探究用户颈部运动能力（通过颈部支撑限制或不限制颈部运动）对模拟器病和控制器直观性的影响。实验比较了使用颈部支撑的TiltChair、不使用颈部支撑的TiltChair和VRNChair。

**参与者：** 20名年轻成人（10名男性），年龄、性别均衡，这些参与者也参与了实验1。

**任务：** 与实验1相同，参与者需要在VR环境中导航并找到目标房间。

**测量指标：** 同样使用SSQ和姿势摇摆测量来评估模拟器病；通过总行进距离和执行时间来评估控制器的直观性。

### Simulator sickness measurements

1. 模拟器病问卷 (Simulator Sickness Questionnaire, SSQ)：包含一系列关于模拟器病症状的问题，包括恶心（如恶心、胃部不适、唾液分泌增多、打嗝）、迷失方向（如头晕、眩晕）和眼动症状（如眼睛疲劳、聚焦困难、视力模糊、头痛）。被试根据感受进行评分，有五个等级，从0（最不严重）到4（最严重）。汇总每个症状的评分，得出总的模拟器病评分。在实验中，被试在VR任务之前（baseline）以及在完成第1、4和8次试验后完成SSQ。通过比较基线和后续测试的评分变化，研究者能够评估不同控制器对模拟器病严重程度的影响。
2. 姿势摇摆测量 (Postural Sway Measurement)：通过Wii平衡板进行，测量时，被试站在平衡板上，同时戴上头戴式显示器（HMD），以便他们可以看到虚拟环境。测量分为两种情况： 睁眼条件：被试在看着VR任务建筑中的“X”标记时，尝试保持平衡并保持静止一分钟。 闭眼条件：被试闭上眼睛，HMD显示黑色屏幕，同样尝试保持平衡并保持静止一分钟。通过计算重心路径长度（center of pressure path length）来量化平衡的变化，这个值是通过处理来自平衡板的信号并应用低通滤波器来获得的。

通过这两种方法的结合，能够从生理和主观两个层面全面评估模拟器病的症状和严重程度。


### Intuitiveness measurements

## Results


![alt text](https://media.springernature.com/lw685/springer-static/image/art%3A10.1007%2Fs11517-019-02070-2/MediaObjects/11517_2019_2070_Fig3_HTML.png?)


![alt text](https://media.springernature.com/lw685/springer-static/image/art%3A10.1007%2Fs11517-019-02070-2/MediaObjects/11517_2019_2070_Fig4_HTML.png?)


![alt text](https://media.springernature.com/lw685/springer-static/image/art%3A10.1007%2Fs11517-019-02070-2/MediaObjects/11517_2019_2070_Fig5_HTML.png?)

![alt text](https://media.springernature.com/lw685/springer-static/image/art%3A10.1007%2Fs11517-019-02070-2/MediaObjects/11517_2019_2070_Fig6_HTML.png?)


## Discussion



## Conclusion




## Issues of This Paper

**1. 未对每个被试进行重复实验** 

$\quad$实验1与2都未对单个被试进行重复实验，可能由于实验耗时长、被试易疲劳等原因。但同时由于被试数量仅为20，可能存在样本数不足问题。建议增加对样本量计算验证的内容，增加数据与统计分析的可信度。

**2. 选取的控制器不具有普遍性** 

$\quad$实验中选取了四种VR移动控制器，除Joystick与全向跑步机外另外两者并不属于常用VR移动控制器，文中缺少对控制器选取的科学性的说明。

**3. 未深入研究其他用户变量的影响** 

$\quad$本研究中研究了性别对Sickness和Intuitive的影响，但并未深入研究其他用户变量对这两者的影响。结论较为局限。

$\quad$例如，实验中被试均选取为年轻人，而年龄和性别有很大可能为相关变量。则本文对性别影响的结论仅适用于改年龄段的人群，缺少普遍性。