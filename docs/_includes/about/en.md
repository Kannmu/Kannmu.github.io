```cs
using System;

class Program
{
    static void Main()
    {
        // About Me
        string name = "Linhan Fan (Kannmu)";
        string university = "Southeast University";
        string department = "Industrial Design Department / Design Studies";
        string supervisor = "[Yaofeng Niu](https://me.seu.edu.cn/nyf_31777/list.htm)";
        string[] hobbies = { "Photography", "Gaming", "Hiking", "Jogging" };

        // Experiences
        var masterDegree = new
        {
            university = "Southeast University",
            school = "School of Mechanical Engineering",
            department = "Industrial Design Department",
            major = "Design Studies",
            startDate = "September 2023",
            endDate = "Present"
        };

        var internship = new
        {
            company = "Chengdu Luxingtong Information Technology Co., Ltd.",
            position = "Deep Learning Algorithm Intern",
            startDate = "August 2022",
            endDate = "March 2023"
        };

        var roboconTeam = new
        {
            name = "Robocon Chuanshanjia Team",
            roles = new[] { "Mechanical & Hardware Team" },
            duration = "2020-2022"
        };

        var bachelorDegree = new
        {
            university = "Sichuan University",
            school = "School of Mechanical Engineering",
            major = "Mechanical Design, Manufacturing, and Automation (Outstanding Engineer)",
            startDate = "September 2019",
            endDate = "June 2023"
        };
    }
}
```