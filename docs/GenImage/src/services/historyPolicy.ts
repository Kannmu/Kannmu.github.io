export const HISTORY_LIMIT_MIN = 5
export const HISTORY_LIMIT_MAX = 10
export const HISTORY_LIMIT_DEFAULT = 8

const MEGABYTE = 1024 * 1024
const MIN_BUDGET_BYTES = 8 * MEGABYTE
const MAX_BUDGET_BYTES = 64 * MEGABYTE
const DEFAULT_BUDGET_BYTES = 32 * MEGABYTE

export type HistoryLike = {
  id: string
  createdAt: string
}

export const clampHistoryLimit = (value: unknown) => {
  const numeric = typeof value === 'string' ? Number(value) : value
  if (typeof numeric !== 'number' || !Number.isFinite(numeric)) return HISTORY_LIMIT_DEFAULT
  return Math.min(HISTORY_LIMIT_MAX, Math.max(HISTORY_LIMIT_MIN, Math.round(numeric)))
}

/**
 * Keeps the history inside the browser storage quota. Browsers expose a quota
 * through navigator.storage.estimate(); we only ever claim a slice of it so a
 * few large 4K generations cannot fill the whole origin.
 */
export const computeHistoryBudget = (quota: number | null | undefined) => {
  if (typeof quota !== 'number' || !Number.isFinite(quota) || quota <= 0) return DEFAULT_BUDGET_BYTES
  return Math.min(Math.max(quota * 0.15, MIN_BUDGET_BYTES), MAX_BUDGET_BYTES)
}

const encode = (value: string) => {
  if (typeof TextEncoder !== 'undefined') return new TextEncoder().encode(value).byteLength
  return value.length * 2
}

export const estimateRecordBytes = (record: HistoryLike) => {
  try {
    return encode(JSON.stringify(record))
  } catch {
    return 0
  }
}

export const compareHistoryRecords = (a: HistoryLike, b: HistoryLike) => {
  const first = Date.parse(a.createdAt) || 0
  const second = Date.parse(b.createdAt) || 0
  if (first !== second) return second - first
  return b.id.localeCompare(a.id)
}

export type PruneHistoryResult<T extends HistoryLike> = {
  /** Newest first, limited by both the record count and the byte budget. */
  kept: T[]
  /** Records that no longer fit and may be deleted from storage. */
  removed: T[]
  bytes: number
}

/**
 * Circular overwrite policy: only the newest `limit` records survive and the
 * oldest ones are evicted first whenever the byte budget would be exceeded.
 * The newest record is always kept, even when a single generation is bigger
 * than the whole budget.
 */
export const pruneHistory = <T extends HistoryLike>(
  records: T[],
  limit: number,
  maxBytes: number
): PruneHistoryResult<T> => {
  const sorted = [...records].sort(compareHistoryRecords)
  const recordLimit = clampHistoryLimit(limit)
  const byteLimit = Number.isFinite(maxBytes) && maxBytes > 0 ? maxBytes : DEFAULT_BUDGET_BYTES
  const kept: T[] = []
  const removed: T[] = []
  let bytes = 0

  for (const record of sorted) {
    const size = estimateRecordBytes(record)
    const exceedsCount = kept.length >= recordLimit
    const exceedsBytes = kept.length > 0 && bytes + size > byteLimit

    if (exceedsCount || exceedsBytes) {
      removed.push(record)
      continue
    }

    kept.push(record)
    bytes += size
  }

  return { kept, removed, bytes }
}

export const formatBytes = (bytes: number) => {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 KB'
  if (bytes >= MEGABYTE) return `${(bytes / MEGABYTE).toFixed(1)} MB`
  return `${Math.max(1, Math.round(bytes / 1024))} KB`
}
