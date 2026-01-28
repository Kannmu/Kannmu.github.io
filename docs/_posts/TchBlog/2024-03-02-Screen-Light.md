---
layout: post
title: "[Tch] 反射式屏幕挂灯"
subtitle: "Reflective screen hanging lamp"
author: "Kannmu"
# header-style: text
header-img: "/img/Photography/Humanistic/DSC3869.jpg"
header-mask: 0.4
tags:
  - Project
  - PCB
  - Light
  - Open Source
---

## Intro

最近想添置一个屏幕挂灯，但是看到明基1k多的价格直接劝退。不如来DIY一个吧。

![Screen_Light_20240302184703.jpg](https://p.sda1.dev/19/f7ee6cbac2ed15fd5da02345bd3e967c/Screen_Light_20240302184703.jpg)
![Screen_Light_20240302184704.jpg](https://p.sda1.dev/19/0fe7c474415008efc7b44bf3cee9151a/Screen_Light_20240302184704.jpg)
![Screen_Light_20240302184706.jpg](https://p.sda1.dev/19/07200669cf9114554288ded66a0bd6cd/Screen_Light_20240302184706.jpg)
![Screen_Light_20240302184709.jpg](https://p.sda1.dev/19/0e34affe30ba30f3bcf3ada49894aa5f/Screen_Light_20240302184709.jpg)

## 光路

最开始发现的方案是使用现成的LED灯带 + 反光管。但是这样长度太大，体积不好控制。因此最终选择把LED灯珠布置在PCB上，并加上一个反射板来将光线反射到桌面上的键盘区域。

下图是反射板光路的侧截面轮廓图，曲线分为两段，红色的第一段为一个抛物线，蓝色的第二段为直线。对应到反射板三维模型上，第一段则为一个抛物线沿着垂直于抛物线平面的直线运动掠过的面，第二段为一平面。

![Kannmu_Light_Reflector.png](https://p.sda1.dev/19/771edf195b75743e8cadbe77a8104ae7/Kannmu_Light_Reflector.png)

将LED灯珠放置在抛物线的焦点处，在这张图中即为原点的位置。由于PCB物理遮挡，则仅有上部180°范围内会有光线射出。其中左上的150°范围的光线会被抛物线面接收到，并反射为水平向右的光线。

水平向右的光线接着被平面反射到桌面上的对应区域。可以控制在键盘与手附近的矩形区域内均匀照射。（需要对反射板平面段使用砂纸进行打磨磨砂处理，否则会对灯珠进行成像投影，光线不够均匀）。

## 电路

电路可以直接看我在立创[开源的工程](https://oshwhub.com/kannmu/kannmu_light)。

![原理图](https://image-pro.lceda.cn/pullimages/8332c6bf44534e4d99fe14a293c71ebb.webp)

![PCB](https://image-pro.lceda.cn/pullimages/b5c84494c40b4129bcab85613756f1b0.webp)

电路部分反而非常简单了，主要部分是一个使用CH224K芯片的PD快充诱骗器，默认配置到输出12V的电压，因此从供电的TypeC口输入电压及为12V。之后经过XL1509降压到5V（顺便当限流2A用），再过一个保险丝后到LED灯珠阵列。

还有一个TypeC口用来提供另一个功能，使用SL2.1A的USB2.0一拖四扩展坞，将其中的一路拿来接GL823K芯片来做SD卡读卡器（未验证，因为手边没有SD卡hhh）。剩下的三个USB2.0接口很适合插上鼠标键盘等的2.5G接收器（因为屏幕灯挂在开阔的高处，无线信号会好很多）。

## 制造

反射板部分直接交给代工3D打印就可以了。不过需要注意的是模型的薄壁部分不要过薄，否则打印出来会因为受潮或者热胀冷缩而大幅度变形。

电路部分，PCB加工交给嘉立创打样。并且立创的基础库原件可以很便宜的进行SMT贴片加工。绝大部分的常用电阻电容，还有一些AMS1117等非常非常常用的芯片都很推荐直接SMT加工。在这里我五块板子贴片了两片，包含PCB加工一共也就花了不到100块。

但是对于类似排针排母这样的插件，嘉立创目前都归类为扩展库，每种原件需要额外加20块钱，就不是很划算了。不过对于16Pin及以上的TypeC接口还是推荐使用SMT加工，除非有热风枪、加热台或者回流焊机这样的工具，仅使用烙铁将会非常难以焊接（引脚太接近，且角度刁钻）。


