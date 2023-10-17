---
layout: post
title: "[Tch] Unity Shader 2D UI边缘发光效果 [学习笔记]"
subtitle: "2D UI Edge glowing effect using Unity Shader"
author: "Kannmu"
# header-style: text
header-img: "../../../../img/Photography/Humanistic/DSC3869.jpg"
header-mask: 0.4
tags:
  - Shader
  - TA
  - Unity
  - 知乎
  - UI
  - 技术博客
  - 技术美术
---

<head>
    <script src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML" type="text/javascript"></script>
    <script type="text/x-mathjax-config">
        MathJax.Hub.Config({
            tex2jax: {
            skipTags: ['script', 'noscript', 'style', 'textarea', 'pre'],
            inlineMath: [['$','$']]
            }
        });
    </script>
</head>

> 这篇文章转载自[我在知乎上的文章](https://zhuanlan.zhihu.com/p/633616509)

由于最近在尝试做一个项目的UI界面，想对标题、菜单文本等组件增加一种边缘发光的效果。想通过Shader来实现。这里记录一下效果、用到的原理和代码。

## 1. 效果展示

首先展示一下最终实现的效果：

(还没搞懂怎么在这里放视频，视频展示不了。移步我的知乎回答[知乎回答](https://zhuanlan.zhihu.com/p/633616509)来观看效果)
​

## 2. 素材准备

首先需要准备增加目标效果的UI图片，这里使用png格式。举例如下：
​
![](https://picx.zhimg.com/80/v2-d2e503d950c78c60d427242e35b0501f_720w.png?source=d16d100b "未选中默认按钮贴图")
<center><font size=2>未选中默认按钮贴图</font></center>

![](https://pic1.zhimg.com/80/v2-2e35377fbe5fa0c25a1252855f28ff88_720w.png?source=d16d100b"被选中状态贴图")
<center><font size=2>被选中状态贴图</font></center>

背景为透明像素。

## 3. 定义参数

首先定义一些调整效果的参数

```glsl
Properties
    {
        _MainTex ("Texture", 2D) = "white" {}
        [HDR]_OutlineColor_0 ("Outline Color_0", Color) = (1,1,1,1)
        [HDR]_OutlineColor_1 ("Outline Color_1", Color) = (1,1,1,1)
        _OutlineMinAlpha ("Outline Min Alpha", Range(0,0.5)) = 0.1
        _OutlineMaxAlpha ("Outline Max Alpha", Range(0,2)) = 0.3
        _GlowSpeed ("Glow Speed", Range(0,10)) = 2
        _OutLineWidth ("Outline Width", Range(0,0.1)) = 0.01
        _Overall_Alpha ("_Overall_Alpha", float) = 1
    }
```

| Name |  Descriptions |
|:--------------------:|:--------------------:|
| _MainTex    | 主材质，这里填上文的贴图。|
| _OutlineColor_0 和 _OutlineColor_1 | 颜色渐变效果的两端。|
| _OutlineMinAlpha | 提取边缘的透明度下限。|
| _OutlineMaxAlpha | 提取边缘的透明度上限。|
| _GlowSpeed | 滚动效果的播放速度。|
| _OutLineWidth | 边缘发光效果宽度。|
| _Overall_Alpha | 控制整体透明度，用来实现渐入渐出效果。|

## 4. 边缘发光

边缘提取是通过筛选透明度来实现的。贴图背景部分透明度为0，而主体内容部分透明度为1。这样在图片边缘部分则会产生一个从0到1的变化。通过筛选透明度在  区间的子区间的像素便可以提取出图像的边缘。

具体流程有边缘扩展、透明度筛选、发光三部分。

### 4.1. 边缘扩展：

由于UI贴图在边缘处透明度变化非常剧烈，直接通过透明度区间来筛选只能得到一个很窄很小的边缘区域。

所以在提取边缘之前首先对贴图的透明度通道进行平滑模糊处理。来扩大处于中间透明度的像素区域。

这里使用二维的中值模糊来扩展边缘，将每个像素的透明度使用周围2n*2n的方形区域透明度的平均值来代替。公式如下：

$
A_{i,j}^{'} = \frac{1}{n^2} \sum_{x = i -n }^{ i+n}\sum_{y = j -n }^{j+n} A_{x,y} \tag{1}
$

其中，$A_{x,y}$ 为贴图上像素的透明度，$A_{i,j}^{'}$  为透明度扩展后uv上i，j点的透明度。n为采样方形区域的半边长，这里设置n = 10.

在代码中为了提高运行效率，使用_OutLineWidth参数来定义边缘扩展的程度。会在边长为2倍_OutLineWidth的正方形区域内均匀采样10*10共100个点，使用100个点的透明度平均值来定义这个点的透明度。示意如下图：
​
![](https://pica.zhimg.com/80/v2-53923194019d0ef46121f8d5b87eb395_720w.png?source=d16d100b)
<center><font size=2>100点采样中值模糊</font></center>

本文所有计算都放在片元着色器中实现，代码如下：
```glsl
//获取贴图
float4 col = tex2D(_MainTex, i.uv);
//使用Alpha来复制透明度的值，防止影响原始数据
float Alpha = col.a;

//中值模糊，循环方形区域内每个像素
for (int x = -10 ; x < 10; x++)
{
    for(int y = -10; y < 10; y++)
    {
        float2 offset = (float2(x, y) * _OutLineWidth)/10;//计算该次采样点的uv偏移量，除以10目的是限制采样区域在_OutLineWidth内
        Alpha += tex2D(_MainTex, i.uv + offset).a;//累加透明度值
     }
}
Alpha /= 300;//平均，300这个值可以试几次手动调节一下
```

### 4.2. 透明度筛选：

通过透明度截取来进行边缘提取，在完成了边缘透明度扩展之后。使用[ _OutlineMinAlpha , _OutlineMaxAlpha ]这个区间来进行透明度筛选得到边缘。Shader中使用clip函数来筛选透明度下界，clamp函数来筛选上界。代码如下：

```glsl
//裁切小于_OutlineMinAlpha的像素
clip(Alpha - _OutlineMinAlpha);
//限制大于_OutlineMaxAlpha的像素
Alpha = clamp(Alpha,0,_OutlineMaxAlpha);
```

此时Alpha便是边缘像素的透明度值。

### 4.3. 发光与动态效果 ：

接下来来绘制动态边缘发光：

```glsl
//计算边缘渐变颜色，包含横向动态滚动效果。 
float3 OutLine =  lerp(_OutlineColor_0, _OutlineColor_1, (0.5 * sin(_GlowSpeed * _Time.y + 2*i.uv.x) + 0.5)) * Alpha;
//叠加边缘透明度到输出
col.a += Alpha;
//叠加边缘颜色到输出
col.rgb += OutLine;
```

这里使用lerp函数来对_OutlineColor_0 和_OutlineColor_1两个颜色进行线性插值，比例由当前点的uv坐标x数据和系统时间共同决定，从而实现横向动态效果。

$$0.5  sin(GlowSpeed \times Time.y + 2UV_x) + 0.5  \tag{2}$$

前面乘以0.5和最后加上0.5将sin函数的值映射到(0, 1)内。_GlowSpeed控制变化频率，i.uv.x控制该点的相位。

## 5. 代码

全部代码如下：

```glsl
// Kannmu 2023.5.10
Shader "Unlit/Edge Glowing"
{
    Properties
    {
        _MainTex ("Texture", 2D) = "white" {}
        [HDR]_OutlineColor_0 ("Outline Color_0", Color) = (1,1,1,1)
        [HDR]_OutlineColor_1 ("Outline Color_1", Color) = (1,1,1,1)
        _OutlineMinAlpha ("Outline Min Alpha", Range(0,0.5)) = 0.1
        _OutlineMaxAlpha ("Outline Max Alpha", Range(0,2)) = 0.3
        _GlowSpeed ("Glow Speed", Range(0,10)) = 2
        _OutLineWidth ("Outline Width", Range(0,0.1)) = 0.01
        _Overall_Alpha ("_Overall_Alpha", float) = 1
    }
    SubShader
    {
        Tags { "RenderType"="Opaque" }
        LOD 100

        Pass 
        {
            Name "OUTLINE"
            Tags {"Queue"="Transparent" "RenderType"="Transparent"}
            Cull Off
            ZWrite Off
            ZTest Always
            Blend SrcAlpha OneMinusSrcAlpha
            CGPROGRAM
            #pragma vertex vert
            #pragma fragment frag
            #include "UnityCG.cginc"
    
            sampler2D _MainTex;
            float4 _MainTex_ST;
            float _OutlineMinAlpha, _OutlineMaxAlpha, _OutLineWidth, _GlowSpeed;
            float4 _OutlineColor_0, _OutlineColor_1;
            float _Overall_Alpha;

            struct appdata_t {
                float4 vertex : POSITION;
                float2 uv : TEXCOORD0;
            };
    
            struct v2f {
                float2 uv : TEXCOORD0;
                float4 vertex : SV_POSITION;
            };
    
            v2f vert (appdata_t v) {
                v2f o;
                o.vertex = UnityObjectToClipPos(v.vertex);
                o.uv = v.uv;
                return o;
            }
    
            fixed4 frag (v2f i) : SV_Target {
               
                float4 col = tex2D(_MainTex, i.uv);
                float Alpha = col.a;

                for (int x = -10 ; x < 10; x++)
                {
                    for(int y = -10; y < 10; y++)
                    {
                        float2 offset = (float2(x, y) * _OutLineWidth)/10;
                        Alpha += tex2D(_MainTex, i.uv + offset).a;
                    }
                }
                Alpha /= 300;

                //Alpha = clamp(Alpha,0,1);

                clip(Alpha - _OutlineMinAlpha);
                //clip(_OutlineMaxAlpha - Alpha);

                Alpha = clamp(Alpha,0,_OutlineMaxAlpha);

                float3 OutLine =  lerp(_OutlineColor_0, _OutlineColor_1, (0.5 * sin(_GlowSpeed * _Time.y + 2*i.uv.x) + 0.5)) * Alpha;

                col.a += Alpha;
                col.rgb += OutLine;
                col.a *= pow(_Overall_Alpha,3);

                return col;
            }
            ENDCG
        }
    }
}
```
