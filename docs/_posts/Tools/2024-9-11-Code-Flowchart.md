---
layout: post
title: "Python 代码转换流程图转换器"
subtitle: "Python code to flowchart converter"
author: "Kannmu"
header-img: "../../../../img/Photography/Humanistic/DSC3869.jpg"
header-mask: 0.4
tags:
  - Tools
  - Code
  - Flowchart
---

<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<title>拖拽上传Python文件</title>
<style>
  #drop_zone {
    border: 2px dashed #0087F7;
    border-radius: 5px;
    width: 300px;
    height: 200px;
    color: #cccccc;
    text-align: center;
    line-height: 200px;
    font-family: Arial, sans-serif;
    position: relative;
  }
  .file-icon {
    width: 20px;
    height: 20px;
    display: inline-block;
    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="%23444" d="M13 9h5.5L13 3.5V9M6 2h8l6 6v12c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2m3 18h12V9h-5.5L18 12.5V18H6v2z"/></svg>');
    margin-right: 10px;
  }
  #controls {
    margin-top: 20px;
  }
  button {
    padding: 10px 20px;
    margin-right: 10px;
    cursor: pointer;
  }
</style>
</head>
<body>

<div id="drop_zone">拖拽Python文件到这里</div>
<div id="file_list"></div>
<div id="controls">
  <button id="clear_button">清空</button>
  <button id="confirm_button">确认</button>
</div>

<head>
    <meta charset="UTF-8">
    <title>Python代码到流程图转换器</title>
    <script src="https://cdn.jsdelivr.net/npm/mermaid@8.8.0/dist/mermaid.min.js"></script>
    <style>
        #diagram {
            text-align: center;
        }
        #diagram pre {
            text-align: left;
            white-space: pre-wrap;
        }
    </style>
</head>

<script>
  var fileContentString = ''; // 用于存储所有文件内容的字符串

  document.addEventListener('dragover', function(e) {
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  });

  document.addEventListener('drop', function(e) {
    e.stopPropagation();
    e.preventDefault();

    var files = e.dataTransfer.files;
    var file;
    var reader;
    var fileListDiv = document.getElementById('file_list');

    for (var i = 0; i < files.length; i++) {
      file = files[i];

      if (file.name.endsWith('.py')) {
        reader = new FileReader();

        reader.onload = (function(file) {
          return function(e) {
            fileContentString += e.target.result + '\n\n';

            var fileItem = document.createElement('div');
            var fileIcon = document.createElement('span');
            fileIcon.classList.add('file-icon');
            var fileName = document.createTextNode(file.name);
            fileItem.appendChild(fileIcon);
            fileItem.appendChild(fileName);
            fileListDiv.appendChild(fileItem);
          };
        })(file);

        reader.readAsText(file);
      } else {
        alert('请确保您上传的是Python文件 (.py)');
      }
    }
  });
     function renderFlowchart(flowchartCode) {
        // 创建一个容器来存放流程图
        const graphContainer = document.createElement('div');
        graphContainer.className = 'mermaid';
        graphContainer.innerHTML = flowchartCode;
        document.body.appendChild(graphContainer);

        // 初始化mermaid并渲染流程图
        mermaid.initialize({ startOnLoad: true });
        mermaid.contentLoaded();
    }
  // 清空按钮事件
  document.getElementById('clear_button').addEventListener('click', function() {
    fileContentString = ''; // 清空字符串
    document.getElementById('file_list').innerHTML = ''; // 清空文件列表
  });
    async function getMermaidCode(input) {
            const api_key = "sk-caQnDXpwc00jFJu4LqO76ob5iPHeZzGwHuWdlZQZZFV9xMuv"; // 替换为你的API密钥
            const messages = [
                {
                    "role": "system",
                    "content": "你是一个Python代码解析器和mermaid流程图绘制器，你可以阅读并深度理解输入的Python代码间的内容关系，并使用mermaid格式将代码架构转换成流程图。你仅会输出mermaid字符串。"
                },
                {
                    "role": "user",
                    "content": "这是我的python代码，分为多个文件，请你帮我根据代码间的逻辑关系，输出一个字符串格式的mermaid流程图绘制的字符串，尽量使用竖向的长布局。仅输出mermaid字符串，不要输出首尾的```和mermaid字样。\n" + input
                }
            ];
            try {
                const response = await fetch('https://api.moonshot.cn/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${api_key}`
                    },
                    body: JSON.stringify({
                        "model": "moonshot-v1-8k",
                        "messages": messages,
                        "temperature": 0.3
                    })
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log('Response:', data.choices[0].message.content);
                renderFlowchart(data.choices[0].message.content); // 渲染代码
                return data.choices[0].message.content;
            } catch (error) {
                console.error('Error:', error);
            }
    }
  // 确认按钮事件
  document.getElementById('confirm_button').addEventListener('click', function() {
    console.log("Start send code to LLM"); // 输出所有文件内容拼接的字符串
    getMermaidCode(fileContentString);
  });
</script>
<div id="diagram"></div>

</body>
</html>

