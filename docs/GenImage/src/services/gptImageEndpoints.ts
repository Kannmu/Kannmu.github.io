export const GPT_IMAGE_BASE_URL = 'https://bya.re'
export const GPT_IMAGE_PROXY_URL = '/gpt-image-api'

export const normalizeBaseUrl = (baseUrl?: string) => (baseUrl || '').trim().replace(/\/+$/, '')

/**
 * The public bya.re origin does not send CORS headers, so same-site deployments
 * reach it through the Cloudflare Worker mounted at /gpt-image-api. A custom
 * Base URL is used verbatim. Keeping this in one place makes sure the model
 * catalog and the image endpoints always talk to the same upstream.
 */
export const resolveGptImageRequestBaseUrl = (baseUrl?: string) => {
  const normalized = normalizeBaseUrl(baseUrl)
  return !normalized || normalized === GPT_IMAGE_BASE_URL ? GPT_IMAGE_PROXY_URL : normalized
}
