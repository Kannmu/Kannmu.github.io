# Kannmu Image Studio

Vue 3 + Vite 图片生成工具，支持两套互相独立的 API 提供商：

- ZenMux：Gemini 原生 `generateContent` 图片生成
- GPT Image 2：极算云 OpenAI 兼容 `/v1/images/generations` 与 `/v1/images/edits`

## 本地开发

```bash
npm install
npm run dev
```

Vite 会把浏览器请求的 `/gpt-image-api/*` 代理到 `https://xkj.jisuanyun.vip`。API Key 由用户在页面中输入，只保存在浏览器本地存储；不要把密钥写进 `.env.production` 或前端源码。

## 生产构建

```bash
npm run build
```

生产环境需要在站点同源部署 [cloudflare-worker.mjs](./cloudflare-worker.mjs)，并为 `/gpt-image-api/*` 配置 Worker 路由。极算云接口未开放浏览器 CORS，纯静态页面不能直接调用；Worker 仅转发模型列表、图片生成和图片编辑三个端点，不保存 API Key。

公开配置位于 `.env.production`：

```dotenv
VITE_GPT_IMAGE_BASE_URL=https://xkj.jisuanyun.vip
VITE_GPT_IMAGE_PROXY_URL=/gpt-image-api
```

如已有其他同源后端，可将 `VITE_GPT_IMAGE_PROXY_URL` 改为该代理地址，并保持 OpenAI Images API 路径不变。

## GPT Image 2 参数

GPT Image 2 模式支持以下交互参数：

- 输出尺寸：`auto`、三种标准尺寸、2K/4K 兼容预设，以及 256-8192 px 范围内的自定义宽高
- 画质：`auto`、`low`、`medium`、`high`
- 输出：1-10 张、PNG/JPEG/WebP、不透明/透明/自动背景
- JPEG/WebP 压缩率：0-100
- 图片生成：`auto` 或 `low` 内容审核强度
- 图片编辑：`low` 或 `high` 输入保真度、最多 16 张参考图和可选蒙版
- 可选 `user` 标识

标准尺寸遵循 OpenAI Images 兼容接口的通用取值。2K、4K 和自定义尺寸属于兼容层扩展能力，是否可用由当前上游接口决定；接口不接受时会直接显示服务端返回的参数错误。
