---
layout: post
title: "[作品集:硬件] [持续更新]"
subtitle: "Portfolio of Hardware works"
author: "Kannmu"
header-style: text
tags:
  - Portfolio
  - 作品集
  - Hardware
  - 硬件
  - 电路
  - PCB
---
## 写在前面 Intro

这里写一些详细的作品经历，可能会有一些很不完善的。

Here are some detailed work experiences, which may be incomplete.

我是在进行Robocon比赛期间开始学习的硬件知识。这部分比较基础了，放出来也只是记录一下。

---

## 基于 STM32F407ZGT6 的机器人主控板

<font size = 4>Robot control board based on STM32F407ZGT6`</font>`

24V 输入

6 路 串口通信接口

2 路 CAN 通信

2 路 集成 NMOS 管

支持 WS2812 灯带接口

NRF无线模块接口

![PCB_STM32F407.png](https://p.sda1.dev/19/f0e4d60170498e66aa9938cc54934542/PCB_STM32F407.png)

![PCB_STM32F407_1.png](https://p.sda1.dev/19/25cecc93cc71933108caa1cb4edc02a7/PCB_STM32F407_1.png)

![PCB_STM32F407_2.png](https://p.sda1.dev/19/8e0d46bf7975c5007a0e24abebbf7223/PCB_STM32F407_2.png)

## NMOS 管高速开关

<font size = 4>High-Speed switch using NMOS`</font>`

由于有个项目需要对气阀进行高速开关，而继电器最大通断频率一般只有50Hz，所以设计这个用来替代继电器进行高速气阀控制。

![PCB_NMOS.png](https://p.sda1.dev/19/7205ff25f3c856d23db185f0b1a02ae7/PCB_NMOS.png)

## BLDC 电机 FOC 驱动器（未成功）

<font size = 4>FOC driver for BLDC motor (Unfinished)`</font>`

这个前前后后迭代了有5、6代都炸了，最终还是没成功放弃了。

![PCB_FOC.png](https://p.sda1.dev/19/edb46dc2bf76bbcc5f48c0dd77f53882/PCB_FOC.png)
