import { onBeforeUnmount, ref, watch } from 'vue'
import { getApiErrorMessage } from '../services/apiErrors'
import { normalizeBaseUrl } from '../services/gptImageEndpoints'
import { fetchGptImageModels, type CatalogModel } from '../services/modelCatalog'

const CACHE_PREFIX = 'genimage-model-cache:'
const DEFAULT_DEBOUNCE_MS = 700

type CachedCatalog = {
  fetchedAt: number
  models: CatalogModel[]
  total: number
  fallback: boolean
}

export type UseGptImageModelsOptions = {
  enabled: () => boolean
  apiKey: () => string
  baseUrl: () => string
  debounceMs?: number
}

const cacheKeyFor = (baseUrl: string) => `${CACHE_PREFIX}${normalizeBaseUrl(baseUrl) || 'default'}`

const readCache = (baseUrl: string): CachedCatalog | null => {
  try {
    const raw = localStorage.getItem(cacheKeyFor(baseUrl))
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<CachedCatalog>
    if (!Array.isArray(parsed.models)) return null
    const models = parsed.models.filter((model): model is CatalogModel =>
      Boolean(model) && typeof model.id === 'string' && model.id.trim() !== '')
    if (models.length === 0) return null
    return {
      fetchedAt: typeof parsed.fetchedAt === 'number' ? parsed.fetchedAt : 0,
      models,
      total: typeof parsed.total === 'number' ? parsed.total : models.length,
      fallback: Boolean(parsed.fallback)
    }
  } catch {
    return null
  }
}

const writeCache = (baseUrl: string, cache: CachedCatalog) => {
  try {
    localStorage.setItem(cacheKeyFor(baseUrl), JSON.stringify(cache))
  } catch {
    // A full quota only costs the offline cache; the live list still works.
  }
}

/**
 * Loads the gateway model catalog. The cached list is shown instantly so the
 * picker never flashes empty, then it is refreshed from /v1/models in the
 * background. A failed refresh keeps the cache and surfaces a retry hint.
 */
export const useGptImageModels = (options: UseGptImageModelsOptions) => {
  const models = ref<CatalogModel[]>([])
  const total = ref(0)
  const fallback = ref(false)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const fetchedAt = ref<number | null>(null)
  const fromCache = ref(false)

  let controller: AbortController | null = null
  let timer: ReturnType<typeof setTimeout> | undefined
  let requestToken = 0

  const applyCache = () => {
    const cache = readCache(options.baseUrl())
    if (!cache) return false
    models.value = cache.models
    total.value = cache.total
    fallback.value = cache.fallback
    fetchedAt.value = cache.fetchedAt || null
    fromCache.value = true
    return true
  }

  const refresh = async () => {
    if (!options.enabled()) return
    const apiKey = options.apiKey().trim()
    if (!apiKey) {
      error.value = null
      if (models.value.length === 0) {
        fetchedAt.value = null
        fromCache.value = false
      }
      return
    }

    controller?.abort()
    controller = new AbortController()
    const token = ++requestToken

    loading.value = true
    error.value = null

    try {
      const catalog = await fetchGptImageModels({
        apiKey,
        baseUrl: options.baseUrl(),
        signal: controller.signal
      })
      if (token !== requestToken) return

      models.value = catalog.models
      total.value = catalog.total
      fallback.value = catalog.fallback
      fetchedAt.value = Date.now()
      fromCache.value = false
      error.value = null
      writeCache(options.baseUrl(), {
        fetchedAt: fetchedAt.value,
        models: catalog.models,
        total: catalog.total,
        fallback: catalog.fallback
      })
    } catch (caughtError) {
      if (token !== requestToken) return
      if (controller.signal.aborted) return

      const cached = models.value.length > 0 ? true : applyCache()
      error.value = getApiErrorMessage(caughtError, '模型列表')
      fromCache.value = cached
    } finally {
      if (token === requestToken) loading.value = false
    }
  }

  const scheduleRefresh = (delay: number) => {
    if (timer !== undefined) clearTimeout(timer)
    timer = setTimeout(() => {
      timer = undefined
      void refresh()
    }, delay)
  }

  watch(
    () => options.enabled(),
    (enabled) => {
      if (!enabled) return
      applyCache()
      scheduleRefresh(0)
    },
    { immediate: true }
  )

  watch(
    () => normalizeBaseUrl(options.baseUrl()),
    () => {
      if (!options.enabled()) return
      applyCache()
      scheduleRefresh(0)
    }
  )

  watch(
    () => options.apiKey(),
    () => {
      if (!options.enabled()) return
      scheduleRefresh(options.debounceMs ?? DEFAULT_DEBOUNCE_MS)
    }
  )

  onBeforeUnmount(() => {
    if (timer !== undefined) clearTimeout(timer)
    timer = undefined
    controller?.abort()
  })

  return {
    models,
    total,
    fallback,
    loading,
    error,
    fetchedAt,
    fromCache,
    refresh
  }
}
