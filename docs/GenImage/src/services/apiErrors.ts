import axios from 'axios'

type ApiErrorPayload = {
  error?:
    | {
        message?: string
        status?: number
        code?: string
      }
    | string
  message?: string
  detail?: string
}

export const getApiPayloadError = (data: unknown) => {
  if (!data || typeof data !== 'object') return null
  const payload = data as ApiErrorPayload
  const apiMessage = typeof payload.error === 'string' ? payload.error : payload.error?.message
  return apiMessage || payload.message || payload.detail || null
}

export const getApiErrorMessage = (error: unknown, providerName = 'API') => {
  if (axios.isAxiosError(error)) {
    if (error.code === 'ERR_CANCELED') return `${providerName} 请求已取消。`

    const data = error.response?.data as ApiErrorPayload | undefined
    const apiMessage = getApiPayloadError(data)
    if (apiMessage) return apiMessage

    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      return `${providerName} 请求等待超时。图片可能仍在服务端生成，请稍后重试。`
    }

    if (!error.response && (error.code === 'ERR_NETWORK' || error.message === 'Network Error')) {
      return `未收到 ${providerName} 的响应。请求可能被网络或反向代理中断，并不表示图片生成失败。`
    }

    if (error.response?.status) {
      return `${providerName} 请求失败（HTTP ${error.response.status}）。`
    }

    return error.message
  }

  const apiMessage = getApiPayloadError(error)
  if (apiMessage) return apiMessage
  return error instanceof Error ? error.message : '图片生成失败'
}
