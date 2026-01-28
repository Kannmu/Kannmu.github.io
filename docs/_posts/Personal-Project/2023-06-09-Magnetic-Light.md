---
layout: post
title: "[Project] 桌面磁吸灯"
subtitle: "Desktop magnetic light"
author: "Kannmu"
# header-style: text
# header-img: "/img/Backgrounds/Bg (1).jpg"
# header-mask: 0.4
tags:
  - Hardware
  - Mechanical
  - PCB
  - Project
---
## 前言 Intro

有段时间非常喜欢那种淡黄色的暖光露营灯，正好缺一个台灯，所以就想着自己做一个。

## 硬件 Hardware

整个硬件电路非常非常非常的简单，也没有增加一些Fancy的功能。

使用四个1206封装的暖光LED作为光源，18650锂电池作为电源，同时用TP4056芯片来做锂电池充电管理。

原理图找不到了就不放了，这么简单的电路也没必要。

PCB如下

![Light_PCB.png](https://p.sda1.dev/19/7a733df2a0905e0454bb4ee3038b2747/Light_PCB.png)

使用TypeC接口充电和供电。

交给嘉立创SMT贴片一些元件后如下：

![Light_PCB_Real.jpg](https://p.sda1.dev/19/7a1039254742b6f4587810cbdd84969c/Light_PCB_Real.jpg)

## 结构 Structure

外壳结构我打算采用一个菲涅尔式的凹透镜来扩散光线，让光照能够更加均匀。在顶盖和长边两个侧面都开槽出菲涅尔透镜的结构。

外壳结构整体使用了三种材料来3D打印，顶盖使用透明材料，并且不加抛光直接使用，会有一种毛玻璃的模糊效果。

![Light_0.jpg](https://p.sda1.dev/19/e36de77bf500e047f3e89c272f6e3285/Light_0.jpg)

![Light_3.png](https://p.sda1.dev/19/7c21d41ba9100df961b0d677750e4be4/Light_3.png)

<center><font size = 3> 菲涅尔凹透镜原理 <br> Fresnel concave lens principle </font></center>


