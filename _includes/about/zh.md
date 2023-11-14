```cs
using System;

class Program
{
    static void Main()
    {
        // 关于我
        string name = "范林涵（涵无Kannmu）";
        string university = "东南大学";
        string department = "工业设计系 / 设计学专业";
        string supervisor = "[牛亚峰](https://me.seu.edu.cn/nyf_31777/list.htm)";
        string[] hobbies = { "摄影", "游戏", "登山", "跑步" };

        // 经历
        var masterDegree = new
        {
            university = "东南大学",
            school = "机械工程学院",
            department = "工业设计系",
            major = "设计学专业",
            startDate = "2023.9",
            endDate = "至今"
        };

        var internship = new
        {
            company = "成都路行通信息技术有限公司",
            position = "深度学习算法实习生",
            startDate = "2022.8",
            endDate = "2023.3"
        };

        var roboconTeam = new
        {
            name = "Robocon川山甲战队",
            roles = new[] { "机械","硬件组" },
            duration = "2020-2022"
        };

        var bachelorDegree = new
        {
            university = "四川大学",
            school = "机械工程学院",
            major = "机械设计制造及其自动化（卓越工程师）",
            startDate = "2019.9",
            endDate = "2023.6"
        };
    }
}
```