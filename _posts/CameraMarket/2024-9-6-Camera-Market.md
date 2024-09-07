---
layout: post
title: "二手相机历史价格趋势查询"
subtitle: "Second hand camera price trends"
author: "Kannmu"
header-img: "../../../../img/Photography/Humanistic/DSC3869.jpg"
header-mask: 0.4
tags:
  - Tool
  - Camera
  - 二手相机
---

<!-- Latex Support -->
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

<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=700 height=86 src="https://music.163.com/outchain/player?type=2&id=1300698999&auto=1&height=66"></iframe>

## 介绍

这里记录了二手市场一些相机价格的历史数据，供大家参考使用。

数据来源：咸鱼实时市场行情。由于二手市场情况非常复杂，每个店家卖出的配件、附带镜头以及成色的情况都不同。所统计价格绝对值参考意义较低，但价格趋势具有较大参考意义。

计算方法：抽取搜索时最前出现的价格的第一分位点到第三分位点之间的价格数据(25% - 75%)的平均值作为当日价格行情。数据每日更新一次。

曲线图右下角的按钮可以切换相机品牌

## 价格走势 Price trends

<head>
    <title>二手相机价格走势</title>
    <!-- 引入Chart.js -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <!-- 引入zoom插件 -->
    <script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-zoom"></script>
    <style>
        .chart-container {
            position: relative; /* 设置相对定位 */
            width: 800px; /* 设置容器宽度 */
            margin: 0 auto; /* 居中容器 */
        }
        #brandSelect {
            position: absolute; /* 使用绝对定位相对于容器 */
            bottom: 10;       /* 菜单距离容器顶部的距离 */
            right: 0;      /* 菜单距离容器左侧的距离 */
            z-index: 100; /* 确保菜单在图表之上 */
        }
        canvas {
            max-width: 100%;
            height: auto;
        }
    </style>
</head>

<body>
<div class="chart-container">
    <canvas id="cameraChart" width="1920" height="1080"></canvas>
    <select id="brandSelect"></select>
</div>
<script>
// 初始化全局变量
var cameraChart = null;
var defaultBrand = null;
var allData = [];
fetch('../../../../CameraMarketData/Data.json')
  .then(response => {
    if (response.ok) {
      return response.json();
    }
    throw new Error('Network response was not ok.');
  })
  .then(jsonData => {
    allData = jsonData; // 存储所有数据
    // 动态添加品牌选项到下拉菜单
    var brands = Object.keys(jsonData);
    defaultBrand = brands[0]; 
    var selectElement = document.getElementById('brandSelect');
    brands.forEach(function(brand) {
      var option = document.createElement('option');
      option.value = brand;
      option.textContent = brand;
      selectElement.appendChild(option);
    });
    // 初始化图表
    updateChart(defaultBrand);
  })
  .catch(error => {
    console.error('There has been a problem with your fetch operation:', error);
  });
// 监听下拉菜单变化
document.getElementById('brandSelect').addEventListener('change', function(event) {
  updateChart(event.target.value);
});
function updateChart(selectedBrand) {
  var datasets = [];
  var brands = Object.keys(allData);
  var maxPricesLength = 0;
  var currentDate = new Date();
  lastHue = 170;
  brands.forEach(function(brand) {
    if (selectedBrand === 'all' || brand === selectedBrand) {
      var cameras = allData[brand];
      var cameraNames = Object.keys(cameras);
      cameraNames.forEach(function(cameraName) {
        var prices = cameras[cameraName];
        var color = getPairedColor();
        datasets.push({
          label: cameraName,
          data: prices,
          borderColor: color,
          backgroundColor: color.replace(')', ', 0.5)').replace('hsl', 'hsla'),
          tension: 0.3
        });
        if (prices.length > maxPricesLength) {
          maxPricesLength = prices.length;
        }
      });
    }
  });
  var labels = [];
  for (var i = 0; i < maxPricesLength; i++) {
    var date = new Date(currentDate);
    date.setDate(currentDate.getDate() - i);
    labels.unshift(date.toISOString().split('T')[0]);
  }
  // 如果图表已经存在，则更新数据
  if (cameraChart !== null) {
    cameraChart.data.datasets = datasets;
    cameraChart.data.labels = labels;
    cameraChart.update();
  } else {
    // 否则创建新的图表实例
    var ctx = document.getElementById('cameraChart').getContext('2d');
    cameraChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: datasets
      },
      options: {
        responsive: true,
        title: {
          display: true,
          text: '价格走势图'
        },
        scales: {
            x:{
                title: {
                    display: true,
                    text: '日期 Date'
                }
            },
            y: {
                beginAtZero: false,
                title: {
                    display: true,
                    text: '价格 Price (CNY)'
                }
            }
        },
        tooltips: {
          enabled: true
        },
        plugins: {
          zoom: {
            pan: {
              enabled: true,
              mode: 'x',
              speed: 20,
              threshold: 5
            },
            zoom: {
              wheel: {
                enabled: true
              },
              pinch: {
                enabled: true
              },
              mode: 'x'
            }
          }
        }
      }
    });
  }
}
function getRandomColor() {
  var hue = Math.floor((Math.random()-0.5) * 50 + 190);
  var saturation = 60;
  var lightness = 50;
  return 'hsl(' + hue + ', ' + saturation + '%, ' + lightness + '%)';
}
let lastHue = 0;
function getPairedColor() {
  // 定义色轮上的颜色间隔，例如每隔30度
  const hueStep = 20;
  // 计算下一个色调值
  lastHue = (lastHue + hueStep) % 360;
  // 使用固定饱和度和亮度值，确保颜色可以搭配
  const saturation = 60; // 饱和度
  const lightness = 60; // 亮度
  // 返回新的颜色
  return `hsl(${lastHue},${saturation}%, ${lightness}%)`;
}
</script>
</body>
