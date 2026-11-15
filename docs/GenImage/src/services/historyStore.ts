import {
  clampHistoryLimit,
  computeHistoryBudget,
  estimateRecordBytes,
  pruneHistory,
  type HistoryLike
} from './historyPolicy'

export type HistoryTimelineTextItem = {
  id: string
  kind: 'text'
  text: string
  isThought: boolean
  thoughtSignature?: string
}

export type HistoryTimelineImageItem = {
  id: string
  kind: 'image'
  imageUrl: string
  mimeType: string
  isThought: boolean
  isFinal: boolean
}

export type HistoryTimelineItem = HistoryTimelineTextItem | HistoryTimelineImageItem

export type HistoryRecord = HistoryLike & {
  provider: string
  prompt: string
  model: string
  modelName?: string
  aspectRatio: string
  imageSize: string
  quality?: string
  outputFormat?: string
  outputCount?: number
  background?: string
  outputCompression?: number
  moderation?: string
  inputFidelity?: string
  operation: 'generate' | 'edit'
  status: 'completed' | 'failed'
  items: HistoryTimelineItem[]
  error: string | null
  finishReason: string | null
  updatedAt: string
  responseId?: string
  modelVersion?: string
  usageMetadata?: Record<string, unknown> | null
}

export type HistorySnapshot = {
  records: HistoryRecord[]
  bytes: number
  budgetBytes: number
  limit: number
}

export class HistoryStorageUnavailable extends Error {
  constructor(message = '当前浏览器不支持或禁用了本地存储，历史记录不可用。') {
    super(message)
    this.name = 'HistoryStorageUnavailable'
  }
}

const DATABASE_NAME = 'genimage-history'
const DATABASE_VERSION = 1
const STORE_NAME = 'records'

let databasePromise: Promise<IDBDatabase> | null = null

const openDatabase = () => {
  if (databasePromise) return databasePromise

  databasePromise = new Promise<IDBDatabase>((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new HistoryStorageUnavailable())
      return
    }

    let request: IDBOpenDBRequest
    try {
      request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION)
    } catch {
      reject(new HistoryStorageUnavailable())
      return
    }

    request.onupgradeneeded = () => {
      const database = request.result
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(new HistoryStorageUnavailable(request.error?.message))
    request.onblocked = () => reject(new HistoryStorageUnavailable('历史记录数据库被其他标签页占用，请关闭其他页面后重试。'))
  })

  databasePromise.catch(() => {
    databasePromise = null
  })

  return databasePromise
}

const readAllRecords = async (): Promise<HistoryRecord[]> => {
  const database = await openDatabase()
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, 'readonly')
    const request = transaction.objectStore(STORE_NAME).getAll()
    request.onsuccess = () => resolve(Array.isArray(request.result) ? request.result as HistoryRecord[] : [])
    request.onerror = () => reject(new HistoryStorageUnavailable(request.error?.message))
  })
}

const replaceAllRecords = async (records: HistoryRecord[]) => {
  const database = await openDatabase()
  return new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    store.clear()
    records.forEach((record) => store.put(record))
    transaction.oncomplete = () => resolve()
    transaction.onerror = () => reject(new HistoryStorageUnavailable(transaction.error?.message))
    transaction.onabort = () => reject(new HistoryStorageUnavailable(transaction.error?.message))
  })
}

const estimateStorageQuota = async () => {
  try {
    const estimate = await navigator.storage?.estimate?.()
    return typeof estimate?.quota === 'number' ? estimate.quota : null
  } catch {
    return null
  }
}

const requestPersistentStorage = () => {
  try {
    navigator.storage?.persist?.()?.catch?.(() => {})
  } catch {
    // Persistence is best effort: browsers may reject it silently.
  }
}

/**
 * Reactive Vue records contain proxies and other non structured-cloneable
 * values, and IndexedDB rejects those with a DataCloneError. Persisting the
 * JSON projection keeps the stored shape plain and stable.
 */
const toPlainRecord = (record: HistoryRecord): HistoryRecord => JSON.parse(JSON.stringify(record)) as HistoryRecord

const toSnapshot = async (limit: number): Promise<HistorySnapshot> => {
  const stored = await readAllRecords()
  const quota = await estimateStorageQuota()
  const budgetBytes = computeHistoryBudget(quota)
  const normalizedLimit = clampHistoryLimit(limit)
  const { kept, removed, bytes } = pruneHistory(stored, normalizedLimit, budgetBytes)

  if (removed.length > 0) {
    await replaceAllRecords(kept)
  }

  return { records: kept, bytes, budgetBytes, limit: normalizedLimit }
}

export const loadHistory = async (limit: number): Promise<HistorySnapshot> => toSnapshot(limit)

/**
 * Persists one finished generation. Older records are evicted so the store
 * always holds the newest N entries within the storage budget.
 */
export const saveHistoryRecord = async (record: HistoryRecord, limit: number): Promise<HistorySnapshot> => {
  const plainRecord = toPlainRecord(record)
  const stored = await readAllRecords()
  const quota = await estimateStorageQuota()
  const budgetBytes = computeHistoryBudget(quota)
  const normalizedLimit = clampHistoryLimit(limit)
  const merged = [plainRecord, ...stored.filter((entry) => entry.id !== plainRecord.id)]
  const { kept, bytes } = pruneHistory(merged, normalizedLimit, budgetBytes)

  await replaceAllRecords(kept)
  requestPersistentStorage()

  return { records: kept, bytes, budgetBytes, limit: normalizedLimit }
}

export const deleteHistoryRecord = async (id: string, limit: number): Promise<HistorySnapshot> => {
  const stored = await readAllRecords()
  await replaceAllRecords(stored.filter((record) => record.id !== id))
  return toSnapshot(limit)
}

export const clearHistory = async (limit: number): Promise<HistorySnapshot> => {
  await replaceAllRecords([])
  const quota = await estimateStorageQuota()
  return {
    records: [],
    bytes: 0,
    budgetBytes: computeHistoryBudget(quota),
    limit: clampHistoryLimit(limit)
  }
}

export const measureHistoryRecord = (record: HistoryRecord) => estimateRecordBytes(record)
