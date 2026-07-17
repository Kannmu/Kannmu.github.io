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
