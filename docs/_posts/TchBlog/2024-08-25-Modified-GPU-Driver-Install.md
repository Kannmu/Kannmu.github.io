---
layout: post
title: "[Tch] 使用笔记本核心魔改的桌面端显卡无法通过小蓝熊，以及黑神话悟空没有DLSS的解决方法"
subtitle: "GPU Driver Installation Guidance"
author: "Kannmu"
header-img: "/img/Tch/GPU/GPU_Face.jpg"
header-mask: 0.4
tags:
  - Modified GPU drivers
  - Laptop GPU
  - GPU
---





## 介绍

去年为了给自己的ITX主机配一张独显，终结使用核显打Apex的困窘。在某宝浏览合适的显卡。由于超小机箱的缘故，仅支持半高的显卡，且长度不超190mm。这时，突然发现一张RTX 3050 Ti，身材苗条，尺寸适中，价格廉价。便快速买下了。但是最近在使用它玩Apex和黑神话悟空时，遇到了各种问题（小蓝熊反作弊不通过、黑神话悟空没有DLSS选项等）。这里记录一下解决方法。

![alt text](/img/Tch/GPU/GPU_ALL.jpg)

当显卡到手后只能惊叹确实小巧精致，但是整体看完，发现并没有制造厂商品牌等信息。淘宝商家说这张显卡仅能使用它提供的魔改过的驱动，并且还不能后续升级。

![alt text](/img/Tch/GPU/GPU_IO.jpg)

![alt text](/img/Tch/GPU/GPU_Back.jpg)

当我按照商家指导安装装完驱动后，设备管理器中赫然写着，这是一张笔记本显卡！

![alt text](/img/Tch/GPU/GPU_0.png)

正当我安慰自己说，就这样用吧，也没啥大问题的时候缓缓启动了Apex。哦吼，这魔改驱动直接在小蓝熊反作弊检测阶段就没有通过，那我寻思这可不行。得想办法解决解决。

## 基本安装

如果不需要使用这块显卡来进行DLSS等和驱动紧密相关的新功能，仅想通过小蓝熊检测，从而可以愉快进行网游的话，其实要做的非常简单方便。流程如下：

### 下载驱动

首先，我们需要下载驱动，驱动的下载地址在[这里](https://www.nvidia.cn/geforce/drivers/)。注意需要手动选择自己显卡的型号，不要下载成GeForce Experience了。

![alt text](/img/Tch/GPU/GPU_1.png)

驱动下载完成后，会得到一个以版本号命名的```.exe```文件，如下图所示。

![alt text](/img/Tch/GPU/GPU_Driver.png)

随后，右键驱动文件，并使用解压程序进行解压。解压位置随意选择。

![alt text](/img/Tch/GPU/GPU_Unzip.png)

解压完成后打开该文件夹，将会得到以下的文件结构。其中```Display.Driver/```文件夹下保存了和显卡硬件映射相关的```.inf```文件。

![alt text](/img/Tch/GPU/GPU_Unzip_Finish.png)

这时，打开设备管理器，在对应显卡或者windows generic display (通用监视器) 选择Update driver (更新驱动) 选项。

![alt text](/img/Tch/GPU/image.png)

接着在弹出菜单中选择从本地文件中选择驱动。

![alt text](/img/Tch/GPU/image-1.png)

选择手动选择支持的驱动

![alt text](/img/Tch/GPU/image-2.png)

选择从硬盘中选择```.inf```文件

![alt text](/img/Tch/GPU/image-3.png)

点击选择文件，并选择刚才解压出来的```Display.Driver/```文件夹中的```nv_dispi.inf```文件

![alt text](/img/Tch/GPU/image-4.png)

![alt text](/img/Tch/GPU/image-5.png)

选择完成后，点击完成OK

![alt text](/img/Tch/GPU/image-6.png)

等待加载一段时间后，取消勾选仅显示兼容的硬件这个Check Box

![alt text](/img/Tch/GPU/image-7.png)

在下面的硬件列表中，选择自己显卡对应的型号，并进行安装。

![alt text](/img/Tch/GPU/image-8.png)

安装过程会黑屏闪烁几次，是正常现象。在安装完成后，便可正常通过小蓝熊反作弊检验。但是由于并未完整通过Nvidia官方驱动安装方式，对于20与30系显卡，现在还无法使用DLSS等功能，对应支持的游戏中并不会出现DLSS的选项（例如黑神话悟空）。

## 高级安装

如果需要使用DLSS等高级驱动功能，则需要使用官方安装器完整走完驱动安装流程。

### 查找显卡硬件ID

驱动解压出来的文件夹中的```setup.exe```即为官方的驱动安装入口。但是直接运行的话会出现硬件不兼容的报错。

![alt text](/img/Tch/GPU/image-9.png)
![Error](https://dynamic-image.yesky.com/1200x-/uploadImages/2022/074/13/9HFLS1N5478A.jpg)

文字描述可能略有差异，不过均为硬件不兼容导致的。这时就需要骗过驱动安装程序，修改检测兼容性的文件，来使得驱动程序成功通过兼容性检验。具体步骤如下：

- 打开设备管理器，找到你的显卡属性菜单
![alt text](/img/Tch/GPU/image-11.png)
- 在属性菜单的Details(细节)选项卡中，选择硬件ID项。
![alt text](/img/Tch/GPU/image-12.png)
- 记录下第一项的ID内容，并按顺序提取组合出16进制的ID，如图所示，我的显卡ID即为```10DE.25A0.0000.10DE```
![alt text](/img/Tch/GPU/image-13.png)

### 修改.inf文件中的显卡ID

- 找到上文提到的```Display.Driver/```文件夹，进入该文件夹。
- 搜索并找到```nvaci.inf```文件。
- 打开```nvaci.inf```文件。
- 搜索你的显卡型号，例如我这里就要搜索```RTX 3050 Ti```，可能会有多个项满足要求，随便选择一行复制一份。
![alt text](/img/Tch/GPU/image-10.png)
- 修改复制的这一行，的ID为自己的显卡ID的后三位。
![alt text](/img/Tch/GPU/image-14.png)
- 全文搜索复制的那一行修改之前的三个四位ID内容，我这里要搜索```25A0.143E.1025```
- 搜索得到以下一行结果，将其前后全部修改为自己的显卡ID。注意最后面SUBSYS字符后的部分为自己显卡ID的最后两个四位值拼接起来的一个8位ID。
![alt text](/img/Tch/GPU/image-15.png)

### 禁用windows驱动签名要求

接下来需要设置禁用windows驱动签名

- 打开 windows 设置，找到windows更新菜单中的高级设置
![alt text](/img/Tch/GPU/image-16.png)
- 高级设置中选择 恢复（Recovery） 选项卡
![alt text](/img/Tch/GPU/image-17.png)
- 选择高级启动
![alt text](/img/Tch/GPU/image-18.png)
- 重启后选择疑难解答
![alt text](https://mspoweruser.com/wp-content/uploads/2024/01/Driver-Signature-Enforcement-Windows-11-Troubleshoot-e1704803350424.jpg)
- 高级选项
![alt text](https://mspoweruser.com/wp-content/uploads/2024/01/Driver-Signature-Enforcement-Windows-11-Advanced-Options-e1704803529871.jpg)
- 启动设置
![alt text](https://mspoweruser.com/wp-content/uploads/2024/01/Driver-Signature-Enforcement-Windows-11-Startup-Settings-e1704804046896.jpg)
- 最后按键盘上的7或者F7即可
![alt text](https://mspoweruser.com/wp-content/uploads/2024/01/Driver-Signature-Enforcement-Windows-11-Startup-Settings-Restart-e1704804317196.jpg)

这时，电脑会自动重新启动，这时只要正常执行```setup.exe```的安装程序即可成功通过兼容性测试，正常安装驱动。请注意禁用windows驱动签名仅能生效在一次启动中，若出现了重启后则需要重新执行3.3来进行禁用一次。





