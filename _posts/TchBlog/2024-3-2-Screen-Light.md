---
layout: post
title: "[Tch] 反射式屏幕挂灯"
subtitle: "Reflective screen hanging lamp"
author: "Kannmu"
# header-style: text
header-img: "../../../../img/Photography/Humanistic/DSC3869.jpg"
header-mask: 0.4
tags:
  - Project
  - PCB
  - Light
  - Open Source
---

## Intro

最近想添置一个屏幕挂灯，但是看到明基1k多的价格直接劝退。不如来DIY一个吧。

![1](https://github.com/Kannmu/Kannmu.github.io/blob/master/img/Tch/Screen_Light_20240302184703.jpg?raw=true)
![2](https://github.com/Kannmu/Kannmu.github.io/blob/master/img/Tch/Screen_Light_20240302184704.jpg?raw=true)
![3](https://github.com/Kannmu/Kannmu.github.io/blob/master/img/Tch/Screen_Light_20240302184706.jpg?raw=true)
![4](https://github.com/Kannmu/Kannmu.github.io/blob/master/img/Tch/Screen_Light_20240302184709.jpg?raw=true)

## 光路

最开始发现的方案是使用现成的LED灯带 + 反光管。但是这样长度太大，体积不好控制。因此最终选择把LED灯珠布置在PCB上，并加上一个反射板来将光线反射到桌面上的键盘区域。

下图是反射板光路的侧截面轮廓图，曲线分为两段，红色的第一段为一个抛物线，蓝色的第二段为直线。对应到反射板三维模型上，第一段则为一个抛物线沿着垂直于抛物线平面的直线运动掠过的面，第二段为一平面。

![5](https://github.com/Kannmu/Kannmu.github.io/blob/master/img/Tch/Kannmu_Light_Reflector.png?raw=true)

将LED灯珠放置在抛物线的焦点处，在这张图中即为原点的位置。由于PCB物理遮挡，则仅有上部180°范围内会有光线射出。其中左上的150°范围的光线会被抛物线面接收到，并反射为水平向右的光线。

水平向右的光线接着被平面反射到桌面上的对应区域。可以控制在键盘与手附近的矩形区域内均匀照射。（需要对反射板平面段使用砂纸进行打磨磨砂处理）

## 电路