export type CatalogModel = {
  id: string
  name: string
  createdAt?: number
}

export type ModelCatalog = {
  /** Models the UI may offer, in the order the API returned them. */
  models: CatalogModel[]
  /** Total number of models in the response, before image filtering. */
  total: number
  /** True when no image model could be identified and every model is exposed. */
  fallback: boolean
}

/**
 * Image capable models are detected from the model id / display name because
 * OpenAI compatible /v1/models responses rarely describe capabilities. The
 * pattern intentionally covers the OpenAI image families as well as the
 * aggregator style names seen on OpenAI compatible gateways.
 */
const IMAGE_MODEL_PATTERN =
  /(image|imagen|imagine|banana|dall[-\s_]?e|gpt[-\s_]?image|flux|seedream|seededit|kolors|sdxl|stable[-\s_]?diffusion|recraft|ideogram|midjourney|jimeng|wanx|qwen[-\s_]?image|hunyuan[-\s_]?image|ming[-\s_]?image|muse[-\s_]?image|llada[-\s_]?image|nano[-\s_]?banana|photogen|text2image|txt2img)/i

const OUTPUT_MODALITY_KEYS = [
  'output_modalities',
  'outputModalities',
  'outputs',
  'modalities',
  'modality',
  'supported_modalities'
] as const

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value)

const readString = (value: unknown) => (typeof value === 'string' && value.trim() ? value.trim() : '')

const readTimestamp = (value: unknown) => {
  const numeric = typeof value === 'string' ? Number(value) : value
  if (typeof numeric !== 'number' || !Number.isFinite(numeric) || numeric <= 0) return undefined
  // Second based timestamps are the norm; keep millisecond inputs as-is.
  return numeric < 1e12 ? Math.round(numeric * 1000) : Math.round(numeric)
}

const readStringList = (value: unknown) => {
  if (typeof value === 'string') return value.split(/[,\s]+/).filter(Boolean)
  if (!Array.isArray(value)) return []
  return value.filter((entry): entry is string => typeof entry === 'string').map((entry) => entry.trim()).filter(Boolean)
}

const extractModelArray = (payload: unknown): unknown[] => {
  if (Array.isArray(payload)) return payload
  if (!isRecord(payload)) return []
  if (Array.isArray(payload.data)) return payload.data
  if (Array.isArray(payload.models)) return payload.models
  if (Array.isArray(payload.result)) return payload.result
  if (isRecord(payload.data)) {
    if (Array.isArray(payload.data.models)) return payload.data.models
    if (Array.isArray(payload.data.data)) return payload.data.data
  }
  return []
}

export const toCatalogModel = (raw: unknown): CatalogModel | null => {
  if (typeof raw === 'string') {
    const id = readString(raw)
    return id ? { id, name: id } : null
  }
  if (!isRecord(raw)) return null

  const id = readString(raw.id) || readString(raw.model) || readString(raw.name)
  if (!id) return null

  const displayName = readString(raw.display_name) || readString(raw.displayName) || readString(raw.name)
  const createdAt = readTimestamp(raw.created) ?? readTimestamp(raw.created_at) ?? readTimestamp(raw.createdAt)

  return {
    id,
    name: displayName && displayName !== id ? displayName : id,
    createdAt
  }
}

const readOutputModalities = (entry: Record<string, unknown>) => {
  for (const key of OUTPUT_MODALITY_KEYS) {
    const modalities = readStringList(entry[key])
    if (modalities.length > 0) return modalities
  }
  return []
}

const hasImageModality = (modalities: string[]) =>
  modalities.some((modality) => /image|img|picture/i.test(modality))

export const isImageGenerationModel = (raw: unknown): boolean => {
  const model = toCatalogModel(raw)
  if (!model) return false
  if (!isRecord(raw)) return IMAGE_MODEL_PATTERN.test(model.id)

  const modalities = readOutputModalities(raw)
  if (modalities.length > 0) return hasImageModality(modalities)

  const type = readString(raw.type) || readString(raw.model_type)
  // "type": "model" is the OpenAI object type, not a capability, so only a
  // positive image hint is trusted here.
  if (/image/i.test(type)) return true

  return IMAGE_MODEL_PATTERN.test(`${model.id} ${model.name}`)
}

/**
 * Turns any /v1/models payload into the model list shown in the UI. Order from
 * the API is preserved so the gateway keeps control over which model is first.
 */
export const normalizeModelCatalog = (payload: unknown): ModelCatalog => {
  const list = extractModelArray(payload)
  const all: CatalogModel[] = []
  const imageModels: CatalogModel[] = []
  const seen = new Set<string>()

  for (const raw of list) {
    const model = toCatalogModel(raw)
    if (!model || seen.has(model.id)) continue
    seen.add(model.id)
    all.push(model)

    if (isImageGenerationModel(raw)) imageModels.push(model)
  }

  const fallback = imageModels.length === 0 && all.length > 0

  return {
    models: fallback ? all : imageModels,
    total: all.length,
    fallback
  }
}
