---
layout: post
title: "[Tch] Unity C# 对 Python 调用与通信"
subtitle: "Run and communicate with Python Script from Unity C#"
author: "Kannmu"
# header-style: text
header-img: "../../../../img/Photography/Architecture/P1230474.jpg"
header-mask: 0.4
tags:
  - Unity
  - C#
  - Python
  - 技术博客
---

<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=720 height=86 src="https://music.163.com/outchain/player?type=2&id=1090226&auto=1&height=66"></iframe>

## 前言 Intro

最近在进行一个语音交互的项目，语音的部分在Python中完成的，而界面使用Unity做的。

所以需要进行Unity和Python脚本之间的调用和通信。探索和Debug一天后有了下面的经历。

**注：这部分我还没有系统性的了解，本文的实现方式可能并不是最优实现方法**

## 整体框架 Framework

整个系统需要从Unity C#脚本中对Python程序发出指令，并返回处理结果。

所以设计从在C#```Start()```函数中启动Python程序，之后使用UDP通信对Python发送指令。

Python程序处理后的结果通过Print函数输出到标准输出流中，并被C#捕获，从而实现返回处理结果至Unity。

## C#中执行Python文件 Execute Python Script In C#

由于项目主体部分在Unity中，所以需要将启动Python脚本的命令从Unity的C#脚本中发出。

这部分使用C#的 ```System.Diagnostics``` 库来执行。并且由于Python环境是在Anaconda下的虚拟环境，在直接执行Python文件前还需要激活虚拟环境。

这部分在C#脚本中的代码如下：

```cs
using System.Diagnostics;
```
在Class中：

```cs
//新建ProcessInfo和Process变量
private ProcessStartInfo startInfo;
private Process process;
```

首先新建两类变量

### 设置Cmd命令 Set CMD Command

接着在```Start()```函数中来激活Conda虚拟环境并调用Python文件。这里调用cmd命令来实现。```Start()```函数内容如下：

```cs
// 设置Python文件路径
string pythonPath = "Voice_Recognition_Python/Voice_Recognition.py";
// 获取Unity项目的数据路径，也就是Unity工程下的Assert文件夹路径
string dataPath = Application.dataPath;
// 拼接Python文件的完整路径
string fullPath = dataPath + "/" + pythonPath;
// 设置命令行参数，这里使用activate Python来激活
string command = "/c activate Python & python \"" + fullPath + "\"";
```

最后的```command```便是最终需要执行的命令，这里我的Anaconda虚拟环境名称是Python，注意替换成自己的名称。并且已经添加好了conda的环境变量，如果没有添加的话需要将```activate```替换为 ```conda activate```。

### 创建ProcessStartInfo Create ProcessStartInfo

接下来需要设置要创建的进程Process的相关属性

```cs
// 创建ProcessStartInfo对象
startInfo = new ProcessStartInfo();
// 设定执行cmd
startInfo.FileName = "cmd.exe";
// 输入参数是上一步的command字符串
startInfo.Arguments = command;
// 因为嵌入Unity中后台使用，所以设置不显示窗口
startInfo.CreateNoWindow = true;
// 这里需要设定为false
startInfo.UseShellExecute = false;
// 设置重定向这个进程的标准输出流，用于直接被Unity C#捕获，从而实现 Python -> Unity 的通信
startInfo.RedirectStandardOutput = true;
// 设置重定向这个进程的标准报错流，用于在Unity的C#中进行Debug Python里的bug
startInfo.RedirectStandardError = true;

```
### 创建进程 Create Process

设定好进程的StartInfo之后就可以创建进程了

```cs
// 创建Process
process = new Process();
// 设定Process的StartInfo至刚才设定好的内容
process.StartInfo = startInfo;
// 设置异步输出的回调函数，用于实时输出Python中的Print和报错内容到Unity的Console
process.OutputDataReceived += new DataReceivedEventHandler(OnOutputDataReceived);
process.ErrorDataReceived += new DataReceivedEventHandler(OnErrorDataReceived);

// 启动脚本Process，并且激活逐行读取输出与报错
process.Start();
// 设置异步输出流读取
process.BeginErrorReadLine();
process.BeginOutputReadLine();
```

### 捕获输出 Capture Output

另外需要添加两个回调函数，用来异步的实时捕获Python程序产生的输出，并显示到Unity。如下：

```cs
// 捕获标准输出
private void OnOutputDataReceived(object sender, DataReceivedEventArgs e)
{
    //UnityEngine.Debug.Log("OutPutReceived");
    if (!string.IsNullOrEmpty(e.Data))
    {
        UnityEngine.Debug.Log(e.Data);

    }
}
// 捕获报错
private void OnErrorDataReceived(object sender, DataReceivedEventArgs e)
{
    //UnityEngine.Debug.Log("ErrorReceived");
    if (!string.IsNullOrEmpty(e.Data))
    {
        // 调试语句
        UnityEngine.Debug.LogError("Received error output: " + e.Data);
    }
}
```

## UDP通信 UDP Conmunication

为了实现 C# 向 Python 发送指令，使用UDP协议来传输数据，C#作为发送端，Python监听端口响应。

### C# UDP设置

在C#中定义两个变量：

```cs
private UdpClient udpClient;
private IPEndPoint remoteEP;

```

并在```Start()```函数中增加：

```cs
// 创建UDP通信的Client
udpClient = new UdpClient();
// 设置IP地址与端口号
remoteEP = new IPEndPoint(IPAddress.Parse("127.0.0.1"), 31415);
```

这里我使用的IP为```127.0.0.1```，端口号使用```31415```，各位根据具体情况来选择具体值。

在```Update()```函数中可以添加发送指令的代码：

```cs
void Update()
{
    if (Input.GetKeyDown(KeyCode.Space))
    {
        // 准备指令
        byte[] message = Encoding.ASCII.GetBytes("Recognizing");
        // 发送指令            
        udpClient.Send(message, message.Length, remoteEP);
        // 表示发送
        UnityEngine.Debug.Log("Sent message: " + Encoding.ASCII.GetString(message));
    }
}
```

这里按下空格后会对```127.0.01:31415```端口发送```"Recognizing"```字符串指令。

### Python UDP设置

在Python中设置监听端口使用```socket```库

```py
import socket
```

然后设置IP和端口

```py
HOST = '127.0.0.1'
PORT = 31415
```

```py
with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:

    s.bind((HOST, PORT))

    print('Listening on', (HOST, PORT))

    # 这一行一定要有，用来清除Python标准输出的缓存，不然Unity C# 中捕获不到 Print 的输出
    sys.stdout.flush()

    while True:
        sys.stdout.flush()
        data, addr = s.recvfrom(1024)
        # 输出接收到的指令，测试用
        if(data.decode()):
            print(data.decode())
```
启动端口监听

**注意``` sys.stdout.flush() ```这一行一定要有，用来清除Python标准输出的缓存，不然Unity C# 中捕获不到 ```Print()``` 的输出。**

## 进程查杀 Kill Process

由于Unity退出后Python进程并不会自动退出，需要在C#中调用Python程序前和关闭Unity后都手动关闭Python进程。不然会造成端口占用，下一次无法打开端口进行监听。

这部分定义一个函数```Kill_All_Python_Process()```:

```cs
void Kill_All_Python_Process()
{
    Process[] allProcesses = Process.GetProcesses();
    foreach (Process process_1 in allProcesses)
    {
        try
        {
            // 获取进程的名称
            string processName = process_1.ProcessName;
            // 如果进程名称中包含"python"，则终止该进程，并且排除本进程本身
            if (processName.ToLower().Contains("python") && process_1.Id != Process.GetCurrentProcess().Id)
            {
                process_1.Kill();
            }
        }
        catch (Exception ex)
        {
            // 处理异常
            print(ex);
        }
    }
}
```

在```Start()```函数最开始和```OnApplicationQuit()```函数中都调用```Kill_All_Python_Process()```函数即可

```cs
void OnApplicationQuit()
{
    // 在应用程序退出前执行一些代码
    UnityEngine.Debug.Log("应用程序即将退出，清理所有Python进程");
    // 结束所有Python进程
    Kill_All_Python_Process();   
}

```




![](../../../../../img/Tch/Unity-Python-UDP.png)

结果看到在Unity中运行C#脚本后，自动启动Python程序，并返回结果。

## 全部代码 Code

### C#

```cs
using System.Collections;
using System.Collections.Generic;
using System.Diagnostics;
using UnityEngine;
using System.Text;
using System.Net.Sockets;
using System.Net;
using System;
using UnityEditor;

public class Voice_Recognition : MonoBehaviour
{
    
    private ProcessStartInfo startInfo;
    private Process process;

    private UdpClient udpClient;
    private IPEndPoint remoteEP;

    // Start is called before the first frame update
    void Start()
    {
        Kill_All_Python_Process();

        // 创建UDP通信的Client
        udpClient = new UdpClient();
        // 设置IP地址与端口号
        remoteEP = new IPEndPoint(IPAddress.Parse("127.0.0.1"), 31415);

        string pythonPath = "Voice_Recognition_Python/Voice_Recognition.py";
        // 获取Unity项目的数据路径
        string dataPath = Application.dataPath;
        // 拼接Python文件的完整路径
        string fullPath = dataPath + "/" + pythonPath;
        // 设置命令行参数
        string command = "/c activate Python & python \"" + fullPath + "\"";

        // 创建ProcessStartInfo对象
        startInfo = new ProcessStartInfo();
        // 设定执行cmd
        startInfo.FileName = "cmd.exe";
        // 输入参数是上一步的command字符串
        startInfo.Arguments = command;
        // 因为嵌入Unity中后台使用，所以设置不显示窗口
        startInfo.CreateNoWindow = true;
        // 这里需要设定为false
        startInfo.UseShellExecute = false;
        // 设置重定向这个进程的标准输出流，用于直接被Unity C#捕获，从而实现 Python -> Unity 的通信
        startInfo.RedirectStandardOutput = true;
        // 设置重定向这个进程的标准报错流，用于在Unity的C#中进行Debug Python里的bug
        startInfo.RedirectStandardError = true;

        // 创建Process
        process = new Process();
        process.StartInfo = startInfo;
        process.OutputDataReceived += new DataReceivedEventHandler(OnOutputDataReceived);
        process.ErrorDataReceived += new DataReceivedEventHandler(OnErrorDataReceived);

        //启动脚本Process，并且激活逐行读取输出与报错
        process.Start();
        process.BeginErrorReadLine();
        process.BeginOutputReadLine();

    }

    // Update is called once per frame
    void Update()
    {
        if (Input.GetKeyDown(KeyCode.Space))
        {
            //向Python发送识别指令
            byte[] message = Encoding.ASCII.GetBytes("Recognizing");
            udpClient.Send(message, message.Length, remoteEP);
            UnityEngine.Debug.Log("Sent message: " + Encoding.ASCII.GetString(message));
        }
    }
    private void OnOutputDataReceived(object sender, DataReceivedEventArgs e)
    {
        if (!string.IsNullOrEmpty(e.Data))
        {
            UnityEngine.Debug.Log(e.Data);
            if (e.Data == "StartRecognition")
            {
                print("Recognizing");
            }
        }
    }

    private void OnErrorDataReceived(object sender, DataReceivedEventArgs e)
    {
        if (!string.IsNullOrEmpty(e.Data))
        {
            // 调试语句
            UnityEngine.Debug.LogError("Received error output: " + e.Data);
        }
    }

    void Kill_All_Python_Process()
    {
        Process[] allProcesses = Process.GetProcesses();
        foreach (Process process_1 in allProcesses)
        {
            try
            {
                // 获取进程的名称
                string processName = process_1.ProcessName;
                // 如果进程名称中包含"python"，则终止该进程
                if (processName.ToLower().Contains("python") && process_1.Id != Process.GetCurrentProcess().Id)
                {
                    process_1.Kill();
                }
            }
            catch (Exception ex)
            {
                // 处理异常
                print(ex);
            }
        }
    }
    void OnApplicationQuit()
    {
        // 在应用程序退出前执行一些代码
        UnityEngine.Debug.Log("应用程序即将退出，清理所有Python进程");
        // 结束所有Python进程
        Kill_All_Python_Process();  
    }
}

```

### Python

```py
import socket
import sys

HOST = '127.0.0.1'
PORT = 31415

with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:

    s.bind((HOST, PORT))

    print('Listening on', (HOST, PORT))

    sys.stdout.flush()
    while True:
        sys.stdout.flush()
        data, addr = s.recvfrom(1024)
        if(data.decode()):
            print(data.decode())


```