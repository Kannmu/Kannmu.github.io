# ZenMux Platform API 参考

所有管理接口使用 `https://zenmux.ai/api/v1/management` 前缀，并通过 `Authorization: Bearer <ZENMUX_MANAGEMENT_API_KEY>` 鉴权。Management API Key 以 `sk-mg-` 开头；标准 API Key 不适用于这些接口。各接口独立限流，超过平台限制会返回 `422`。

| 能力 | 方法与路径 | 主要参数或用途 |
| --- | --- | --- |
| Flow 费率 | `GET /flow_rate` | 返回 `currency`、`base_usd_per_flow`、`effective_usd_per_flow`。 |
| PAYG 余额 | `GET /payg/balance` | 返回 `total_credits`、`top_up_credits`、`bonus_credits`，总额等于充值与奖励之和。 |
| 订阅详情 | `GET /subscription/detail` | 返回计划、账户状态、Flow 费率、5 小时/7 天滚动配额和月度上限。 |
| Generation | `GET /generation?id=<generation_id>` | 查询模型、耗时、TTFT、Token、用量、账单明细。Pay As You Go Key 才支持完整账单字段，通常请求完成 3–5 分钟后可查。 |
| 时间序列 | `GET /statistics/timeseries` | `metric=tokens|cost`、`bucket_width=1d|1w`、起止日期、`limit`（最多 50）。最多 60 个桶，数据从 2025-09-29 起按日聚合。 |
| 模型排行榜 | `GET /statistics/leaderboard` | `metric=tokens|cost`、起止日期、`limit`（最多 50），返回模型及 Others 汇总。 |
| Provider 市占 | `GET /statistics/market_share` | `metric`、`bucket_width`、起止日期、`limit`，返回各 Provider 绝对值，百分比需客户端按桶总量计算。 |
| 单模型用量 | `GET /statistics/model_usage` | 必填 `model`、`metric`、`starting_at`、`ending_at`；最多 30 天，返回总值和逐日序列。 |
| 趋势排行 | `GET /statistics/trending` | `metric`、`bucket_width=1d|1w`、`ending_at`（不能晚于昨日）、`limit`；返回增长率、前后窗口值和逐日明细。 |
| 性能排行 | `GET /statistics/performance` | `metric=throughput|ttft|cache_hit`、起止日期；最多 30 天，返回模型及 Provider 维度性能。 |

统计数据按日聚合，最新完整数据通常为昨日。滚动配额和余额属于账户实时数据。接口统一返回 `{ success: boolean, data: object }`；失败响应中的 `error.message` 用于页面提示。

参考文档：[Platform API](https://zenmux.ai/docs/api/platform/)
