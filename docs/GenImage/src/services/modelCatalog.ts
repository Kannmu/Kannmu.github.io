import axios from 'axios'
import { getApiErrorMessage, getApiPayloadError } from './apiErrors'
import { resolveGptImageRequestBaseUrl } from './gptImageEndpoints'
import { normalizeModelCatalog, type ModelCatalog } from './modelCatalogPolicy'

export type { CatalogModel, ModelCatalog } from './modelCatalogPolicy'
export { isImageGenerationModel, normalizeModelCatalog } from './modelCatalogPolicy'

const MODEL_LIST_TIMEOUT_MS = 20_000

export type FetchModelCatalogOptions = {
  apiKey: string
  baseUrl?: string
  signal?: AbortSignal
}

/**
 * Reads the live model catalog of the configured GPT Image compatible gateway.
 * Nothing is hard coded so a model that disappears upstream simply disappears
 * from the picker instead of becoming an unusable button.
 */
export const fetchGptImageModels = async ({
  apiKey,
  baseUrl,
  signal
}: FetchModelCatalogOptions): Promise<ModelCatalog> => {
  if (!apiKey.trim()) throw new Error('请先填写极算云 API Key 再获取模型列表。')

  const requestBaseUrl = resolveGptImageRequestBaseUrl(baseUrl)
  const response = await axios.get(`${requestBaseUrl}/v1/models`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${apiKey.trim()}`
    },
    timeout: MODEL_LIST_TIMEOUT_MS,
    signal
  })

  const payloadError = getApiPayloadError(response.data)
  if (payloadError) throw new Error(payloadError)

  const catalog = normalizeModelCatalog(response.data)
  if (catalog.models.length === 0) {
    throw new Error('模型列表为空：服务端没有返回任何可用模型，请确认 Base URL 与 API Key。')
  }

  return catalog
}

export { getApiErrorMessage }
