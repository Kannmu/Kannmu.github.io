---
layout: post
title: "[Tch] OpenMonitor 命令行系统资源监视器"
subtitle: "OpenMonitor command line resource monitoring tool"
author: "Kannmu"
# header-style: text
header-img: "../../../../img/Photography/Humanistic/DSC3869.jpg"
header-mask: 0.4
tags:
  - Project
  - Python
  - Tool
  - Open Source
---

为了给新添置的屏幕上放置一些常驻窗口，再加上刚好对之前用的Core Temp的信息展示方式不是很满意，所以打算自己来写一个小的资源监视器应用。还会添加一些更多的其他信息监控的功能。

仓库地址：[OpenMonitor](https://github.com/Kannmu/OpenMonitor/)

## OpenMonitor

![LineMode](https://github.com/Kannmu/OpenMonitor/assets/53987473/5aac234f-d9aa-4e97-808a-b38e37356c76)
![TableMode](https://github.com/Kannmu/OpenMonitor/assets/53987473/a94d2755-de33-4256-ad2c-10025fc90882)

OpenMonitor是一个使用Python开发的命令行工具，提供实时的系统信息，包括CPU使用率、CPU温度、CPU型号、RAM使用率、总RAM、GPU使用率、GPU内存使用率、总GPU内存、系统功耗和WiFi网络信息。该脚本使用了多个库，包括`os`、`psutil`、`cpuinfo`、`GPUtil`、`time`、`pywifi`、`numpy`、`prettytable`和`argparse`，用于收集和显示系统信息。

### 系统信息

该脚本获取以下系统信息：

- CPU使用率：当前CPU使用率的百分比。
- CPU型号：CPU型号名称。
- RAM使用率：当前RAM使用率的百分比。
- 总RAM：系统的总RAM容量（以GB为单位）。
- GPU使用率：当前GPU使用率的百分比。
- GPU内存使用率：当前GPU内存使用率的百分比。
- 总GPU内存：GPU的总内存容量（以字节为单位）。
- WiFi网络信息：当前连接的WiFi网络的SSID（网络名称）、信号强度（以dBm和百分比表示）和身份验证协议。

### 使用方法

只需运行OpenMonitor.exe或通过py脚本运行。

要运行该脚本，请使用以下命令：

```cmd
python OpenMonitor.py [-t]
```

该脚本接受一个可选参数`-t`或`--TablePrintInfo`，以表格格式显示系统信息。

如果未提供任何参数，脚本将以行格式显示系统信息。

该脚本会持续更新和刷新系统信息，每秒钟更新一次。

### 依赖项

该脚本需要以下依赖项：

- `psutil`：用于获取CPU和RAM信息。
- `cpuinfo`：用于获取CPU型号信息。
- `GPUtil`：用于获取GPU信息。
- `pywifi`：用于获取WiFi网络信息。
- `prettytable`：用于以表格格式显示系统信息。
- `argparse`：用于解析命令行参数。

您可以使用以下命令安装这些依赖项：

```py
pip install psutil cpuinfo gputil pywifi prettytable argparse
```

### 输出

该脚本以以下格式输出系统信息：

#### 行格式

```
CPU: <CPU使用率>% <CPU频率>GHz <CPU型号>
RAM: <RAM使用率>% (<已用RAM>/<总RAM>)
GPU: <GPU使用率>% (<已用GPU内存>/<总GPU内存>)
WI-FI: <SSID> <信号强度>dBm <信号强度百分比>%
```

#### 表格格式

```
+-------+--------+-------+
|  项目  | 使用率 | 总计  |
+-------+--------+-------+
|  CPU  | <CPU使用率>% | <CPU频率>GHz |
|  RAM  | <RAM使用率>% | <已用RAM>/<总RAM> |
|  GPU  | <GPU使用率>% | <已用GPU内存>/<总GPU内存> |
| WI-FI | <SSID> | <信号强度>dBm |
+-------+--------+-------+
```

### 示例

要以表格格式显示系统信息，请运行以下命令：

```
python openmonitor.py -t
```

要以行格式显示系统信息，请运行以下命令：

```
python openmonitor.py
```

该脚本会持续更新和刷新系统信息，每秒钟更新一次。

### 许可证

本项目基于 MIT 许可证。详见 [LICENSE](LICENSE) 文件以获取更多信息。

## OpenMonitor

![LineMode](https://github.com/Kannmu/OpenMonitor/assets/53987473/5aac234f-d9aa-4e97-808a-b38e37356c76)
![TableMode](https://github.com/Kannmu/OpenMonitor/assets/53987473/a94d2755-de33-4256-ad2c-10025fc90882)

OpenMonitor is a command line tool developed with Python that provides real-time system information such as CPU usage, CPU temperature, CPU model, RAM usage, total RAM, GPU usage, GPU memory usage, total GPU memory, system power consumption, and WiFi network information. The script uses various libraries such as `os`, `psutil`, `cpuinfo`, `GPUtil`, `time`, `pywifi`, `numpy`, `prettytable`, and `argparse` to gather and display the system information.

### System Information

The script retrieves the following system information:

- CPU Usage: The current CPU usage as a percentage.
- CPU Model: The CPU model name.
- RAM Usage: The current RAM usage as a percentage.
- Total RAM: The total RAM of the system in gigabytes.
- GPU Usage: The current GPU usage as a percentage.
- GPU Memory Usage: The current GPU memory usage as a percentage.
- Total GPU Memory: The total GPU memory in bytes.
- WiFi Network Information: The SSID (network name), signal strength (in dBm and percentage), and authentication protocol of the currently connected WiFi network.

### Usage

Simply run OpenMonitor.exe or run through py script.

To run the script, use the following command:

```
python OpenMonitor.py [-t]
```

The script accepts an optional argument `-t` or `--TablePrintInfo` to display the system information in a table format.

If no argument is provided, the script will display the system information in a line format.

The script continuously updates and refreshes the system information every second.

### Dependencies

The script requires the following dependencies:

- `psutil`: Used to retrieve CPU and RAM information.
- `cpuinfo`: Used to retrieve CPU model information.
- `GPUtil`: Used to retrieve GPU information.
- `pywifi`: Used to retrieve WiFi network information.
- `prettytable`: Used to display the system information in a table format.
- `argparse`: Used to parse command-line arguments.

You can install the dependencies using the following command:

```
pip install psutil cpuinfo gputil pywifi prettytable argparse
```

### Output

The script outputs the system information in the following format:

#### Line Format

```
CPU: <CPU Usage>% <CPU Frequency>GHz <CPU Model>
RAM: <RAM Usage>% (<Used RAM>/<Total RAM>)
GPU: <GPU Usage>% (<Used GPU Memory>/<Total GPU Memory>)
WI-FI: <SSID> <Signal Strength>dBm <Signal Strength Percentage>%
```

#### Table Format

```
+-------+--------+-------+
|  Item | Usage  | Total |
+-------+--------+-------+
|  CPU  | <CPU Usage>% | <CPU Frequency>GHz |
|  RAM  | <RAM Usage>% | <Used RAM>/<Total RAM> |
|  GPU  | <GPU Usage>% | <Used GPU Memory>/<Total GPU Memory> |
| WI-FI | <SSID> | <Signal Strength>dBm |
+-------+--------+-------+
```

### Example

To display the system information in a table format, run the following command:

```
python openmonitor.py -t
```

To display the system information in a line format, run the following command:

```
python openmonitor.py
```

The script will continuously update and refresh the system information every second.

### License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.