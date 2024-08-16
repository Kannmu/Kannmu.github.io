---
layout: post
title: "Python解释器直接运行与打包为.exe可执行文件的运行效率对比"
subtitle: "Efficiency Comparison of Python Interpreter and Packaged .exe Executable"
author: "Kannmu"
header-img: "../../../../img/Photography/Humanistic/DSC3869.jpg"
header-mask: 0.4
tags:
  - Python
  - Performance
  - Exe Packaging
---

<!-- Latex Support -->
<head>
    <script src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML"  type="text/javascript"></script>
    <script type="text/x-mathjax-config">
        MathJax.Hub.Config({
            tex2jax: {
            skipTags: ['script', 'noscript', 'style', 'textarea', 'pre'],
            inlineMath: [['$','$']]
            }
        });
    </script>
</head>

## 1. 介绍

本文探讨了Python代码在解释器中运行与被打包成.exe可执行文件后运行的效率差异。这种对比对于理解不同运行环境下Python程序的性能表现至关重要。

### 1.1 测试环境

测试在Python 3.11环境下进行，使用Anaconda进行环境配置。
测试使用的硬件平台为 ThinkPad T495。CPU为 AMD Ryzen 5 PRO 3500U w/ Radeon Vega Mobile Gfx。四核，默频2.1GHz。

### 1.2 测试方法

#### 1.2.1 测试的代码方法

测试代码设计为评估两个主要方面的性能：**Python基本循环效率**与**使用Numpy操作效率**。

**基本循环效率测试：**定义了一个名为test_loop_efficiency的函数，该函数执行一个简单的空循环一百万次。循环效率测试重复五次，每次测试记录下执行所需的时间。使用time.time()函数获取精确到秒的时间戳，以计算循环执行的开始和结束时间。测试结果包括最小、最大和平均执行时间，这些数据提供了循环效率的量化度量。

**Numpy操作效率测试：**定义了一个名为test_numpy_operations的函数，用于评估Numpy库在矩阵运算中的性能。该测试同样重复五次，每次生成两个1000x1000的随机矩阵，并执行矩阵乘法、求逆和求和操作。同循环效率测试一样，使用time.time()记录操作开始和结束的时间，以计算每次测试的持续时间。测试结果展示最小、最大和平均时间，从而评估Numpy操作的效率。

两个测试函数均使用min、max和np.mean函数来处理和展示结果，确保了测试结果的准确性和可读性。测试结果通过控制台输出，使用colorama库增强了输出的可读性，通过不同颜色的文本区分不同的测试结果。

使用PyInstaller工具将Python脚本打包成.exe文件，并在相同硬件环境下进行测试，以确保测试的公正性。

## 2. 测试结果

<centering>

**解释器直接运行测试结果**

![alt text](../../../../img/Tch/PythonSpeedTest_0.png)


**打包可执行.exe文件测试结果**

![alt text](../../../../img/Tch/PythonSpeedTest_1.png)

</centering>

可以看出，在两个测试项上，打包为可执行文件后的运行效率都有少许提升。平均5次测试结果，基本循环效率提升了约3.58%。而使用Numpy库的效率提升了4.14%。推测引起两者效率提升的应该为统一原因。但由于笔者能力问题，无法再进一步深入探索引起这种性能提升差异的原因。

## 3. 测试代码

具体进行测试使用的Python代码如下

```py
import time
import numpy as np
from colorama import Fore, Style

def test_loop_efficiency(times=5):
    durations = []
    for _ in range(times):
        start_time = time.time()
        for _ in range(1000000):
            pass
        end_time = time.time()
        durations.append(end_time - start_time)
    print(Fore.RED + f"Loop efficiency test took {min(durations):.6f} seconds (min), {max(durations):.6f} seconds (max), {np.mean(durations):.6f} seconds (avg)")

def test_numpy_operations(times=5):
    durations = []
    for _ in range(times):
        start_time = time.time()
        array_size = 1000
        a = np.random.rand(array_size, array_size)
        b = np.random.rand(array_size, array_size)
        result = np.dot(a, b)
        result = np.linalg.inv(result)
        result = np.sum(result)
        end_time = time.time()
        durations.append(end_time - start_time)
    print(Fore.GREEN + f"Numpy operations test took {min(durations):.6f} seconds (min), {max(durations):.6f} seconds (max), {np.mean(durations):.6f} seconds (avg)")

def main():
    # 测试循环效率，重复5次
    test_loop_efficiency()

    # 测试Numpy操作效率，重复5次
    test_numpy_operations()

    # 所有测试完成后输出结果
    print(Fore.BLUE + "All tests completed.")

if __name__ == "__main__":
    main()
    input("Press any key to exit ...")

```

## 4. 结语

通过对比Python解释器与打包为.exe可执行文件的运行效率，可以得出打包为可执行文件可以略微提高程序运行效率的结论。然而，进一步的原理探究和更加全面详细的测试需要被执行。

请注意，实际的测试结果可能会因为多种因素而有所不同，包括但不限于硬件配置、操作系统版本、Python解释器的优化等。因此，本文的结论仅供参考，具体的性能表现还需根据实际使用场景进行评估。
