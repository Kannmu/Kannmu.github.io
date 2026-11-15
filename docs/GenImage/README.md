# Kannmu Image Studio (GenImage)

Vue 3 + TypeScript + Vite 图片生成工作台，支持两种提供商：

- **ZenMux + Gemini**：Gemini 原生图片生成，支持 1K–4K 与多种画幅。
- **GPT Image 2**：通过 OpenAI 兼容 Images API 生成或编辑图片（默认 Base URL `https://bya.re`）。

## 模型列表来自服务端

GPT Image 2 页面不再硬编码模型 ID。页面加载、Base URL 变更或点击刷新时，会实时请求：

```
GET {Base URL}/v1/models
```

并用与生产环境一致的代理前缀（`/gpt-image-api`）访问 bya.re，因此：

- 服务端新增模型后，下拉列表自动出现，不需要改代码。
- 服务端下线模型后，该模型自动从列表消失；浏览器里保存的旧模型 ID 会被自动替换为当前可用模型。
- 请求失败时仍会显示上一次成功获取的列表（保存在 `localStorage`），并给出失败原因和「重试」按钮。
- 只能用图片类模型：根据 `output_modalities` 和模型名称识别，文本模型（如 `gpt-5.6`）不会出现在列表中；若完全识别不到图片模型，则回退展示服务端全部模型并给出提示。

相关实现：

| 文件 | 作用 |
| --- | --- |
| `src/services/modelCatalogPolicy.ts` | 纯函数：解析 / 过滤 / 去重 `/v1/models` 响应 |
| `src/services/modelCatalog.ts` | 请求 `/v1/models` |
| `src/composables/useGptImageModels.ts` | 加载状态、缓存、防抖自动刷新 |
| `src/services/gptImageEndpoints.ts` | Base URL 归一化与代理路径 |

## 历史记录

最近生成的结果会保存在浏览器 **IndexedDB**（`genimage-history` 数据库）中，刷新页面后仍可查看、下载、复制：

- 默认保存最新 **8** 条，可在界面切换 **5–10** 条；超出条数时循环覆盖最旧记录。
- 同时按浏览器存储配额限制总大小（`navigator.storage.estimate()` 的 15%，限制在 8–64 MB 之间），超限时先淘汰最旧记录；单条记录再大也至少保留最新一条。
- 点击历史卡片可在只读视图中查看，支持删除单条与清空全部。
- 若浏览器禁用本地数据库，页面会提示历史记录不可用，生成功能不受影响。

| 文件 | 作用 |
| --- | --- |
| `src/services/historyPolicy.ts` | 纯函数：条数 / 字节预算裁剪、时间排序、容量格式化 |
| `src/services/historyStore.ts` | IndexedDB 读写、配额探测、持久化申请 |
| `src/components/HistoryPanel.vue` | 历史记录列表 UI |

## 开发

```bash
npm install
npm run dev      # 本地开发，/gpt-image-api 已代理到 https://bya.re
npm run build    # vue-tsc 类型检查 + 生产构建（输出到 dist/，需一并提交）
npm run preview  # 预览 dist，同样带 /gpt-image-api 代理
npm test         # 纯函数单元测试（node:test）
npm run test:worker  # Cloudflare Worker 代理测试
```

生产环境由 `cloudflare-worker.mjs` 在 `/gpt-image-api/*` 上提供代理（支持 `GET /v1/models` 与两个 Images 接口），浏览器端所有请求都走相对路径，不依赖直接跨域访问上游。

## 部署

`dist/` 已提交到仓库，GitHub Pages 直接从 `docs/GenImage/dist/` 提供静态文件。修改源码后需要重新 `npm run build` 并提交构建产物。
