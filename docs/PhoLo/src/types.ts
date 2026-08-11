export type Cut = 'H' | 'V'

export type SliceNode =
  | { kind: 'leaf'; id: string }
  | { kind: 'branch'; cut: Cut; left: SliceNode; right: SliceNode }

export interface LayoutImage {
  id: string
  name: string
  width: number
  height: number
  aspect: number
  weight: number
}

export interface AssetImage extends LayoutImage {
  src: string
  enabled: boolean
  file?: File
  origin: 'demo' | 'user'
  fileKey?: string
}

export type LibraryMode = 'empty' | 'demo' | 'user'
export type UiLocale = 'zh-CN' | 'en'
export type PanelMode = 'assets' | 'adjust' | 'export' | null

export interface LayoutRect {
  id: string
  x: number
  y: number
  width: number
  height: number
  scale: number
}

export interface LayoutMetrics {
  uniformity: number
  aspectError: number
  sizeSpread: number
  fill: number
}

export interface LayoutResult {
  tree: SliceNode
  rects: LayoutRect[]
  canvasWidth: number
  canvasHeight: number
  gap: number
  score: number
  iteration: number
  metrics: LayoutMetrics
}

export interface SearchConfig {
  canvasWidth: number
  gap: number
  targetAspect: number
  fixedFrame: boolean
  balance: number
  iterations: number
  seed: number
}

export type WorkerRequest =
  | { type: 'search'; requestId: number; images: LayoutImage[]; config: SearchConfig }
  | { type: 'cancel'; requestId: number }

export type WorkerResponse =
  | { type: 'started'; requestId: number; result: LayoutResult }
  | { type: 'progress'; requestId: number; result: LayoutResult; progress: number; evaluations: number; elapsed: number }
  | { type: 'complete'; requestId: number; result: LayoutResult; evaluations: number; elapsed: number }
  | { type: 'error'; requestId: number; message: string }

export interface PreviewWorkerRequest {
  requestId: number
  file: File
  maxEdge: number
}

export type PreviewWorkerResponse =
  | { type: 'complete'; requestId: number; width: number; height: number; preview: Blob | null }
  | { type: 'unsupported'; requestId: number }
  | { type: 'error'; requestId: number }

export type ExportFormat = 'png' | 'jpeg' | 'webp' | 'svg'
export type ExportResolution = 'original' | 'eight-k' | 'four-k' | 'two-k' | 'full-hd' | 'hd' | 'small'
export type ExportAction = 'download' | 'copy'

export interface ExportSize {
  id: ExportResolution
  width: number
  height: number
  native: boolean
}
