export interface ImageDimensions {
  width: number
  height: number
}

const INITIAL_HEADER_SIZE = 64 * 1024
const MAX_HEADER_SIZE = 1024 * 1024
const JPEG_START_OF_FRAME = new Set([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf])

function validDimensions(width: number, height: number): ImageDimensions | null {
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) return null
  return { width, height }
}

function uint24(view: DataView, offset: number): number {
  return view.getUint8(offset) | (view.getUint8(offset + 1) << 8) | (view.getUint8(offset + 2) << 16)
}

function jpegOrientation(view: DataView, start: number, end: number): number {
  if (end - start < 14) return 1
  if (view.getUint32(start) !== 0x45786966 || view.getUint16(start + 4) !== 0) return 1
  const tiff = start + 6
  const byteOrder = view.getUint16(tiff)
  const littleEndian = byteOrder === 0x4949
  if (!littleEndian && byteOrder !== 0x4d4d) return 1
  if (view.getUint16(tiff + 2, littleEndian) !== 42) return 1
  const ifd = tiff + view.getUint32(tiff + 4, littleEndian)
  if (ifd < tiff || ifd + 2 > end) return 1
  const entries = view.getUint16(ifd, littleEndian)
  for (let index = 0; index < entries; index += 1) {
    const entry = ifd + 2 + index * 12
    if (entry + 12 > end) break
    if (view.getUint16(entry, littleEndian) === 0x0112) return view.getUint16(entry + 8, littleEndian)
  }
  return 1
}

function jpegDimensions(view: DataView): ImageDimensions | null {
  if (view.byteLength < 4 || view.getUint16(0) !== 0xffd8) return null
  let offset = 2
  let orientation = 1
  let dimensions: ImageDimensions | null = null

  while (offset + 4 <= view.byteLength) {
    if (view.getUint8(offset) !== 0xff) {
      offset += 1
      continue
    }
    while (offset < view.byteLength && view.getUint8(offset) === 0xff) offset += 1
    if (offset >= view.byteLength) break
    const marker = view.getUint8(offset)
    offset += 1
    if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) continue
    if (marker === 0xd9 || marker === 0xda || offset + 2 > view.byteLength) break
    const segmentLength = view.getUint16(offset)
    if (segmentLength < 2) break
    const dataStart = offset + 2
    const segmentEnd = offset + segmentLength
    if (segmentEnd > view.byteLength) break
    if (marker === 0xe1) orientation = jpegOrientation(view, dataStart, segmentEnd)
    if (JPEG_START_OF_FRAME.has(marker) && dataStart + 5 <= segmentEnd) {
      dimensions = validDimensions(view.getUint16(dataStart + 3), view.getUint16(dataStart + 1))
    }
    offset = segmentEnd
  }

  if (!dimensions) return null
  return orientation >= 5 && orientation <= 8
    ? { width: dimensions.height, height: dimensions.width }
    : dimensions
}

function pngDimensions(view: DataView): ImageDimensions | null {
  if (view.byteLength < 24 || view.getUint32(0) !== 0x89504e47 || view.getUint32(4) !== 0x0d0a1a0a) return null
  return validDimensions(view.getUint32(16), view.getUint32(20))
}

function gifDimensions(view: DataView): ImageDimensions | null {
  if (view.byteLength < 10) return null
  const signature = view.getUint32(0)
  if (signature !== 0x47494638 || (view.getUint16(4) !== 0x3761 && view.getUint16(4) !== 0x3961)) return null
  return validDimensions(view.getUint16(6, true), view.getUint16(8, true))
}

function webpDimensions(view: DataView): ImageDimensions | null {
  if (view.byteLength < 30 || view.getUint32(0) !== 0x52494646 || view.getUint32(8) !== 0x57454250) return null
  const chunk = view.getUint32(12)
  if (chunk === 0x56503858) return validDimensions(uint24(view, 24) + 1, uint24(view, 27) + 1)
  if (chunk === 0x5650384c && view.getUint8(20) === 0x2f) {
    const bits = view.getUint32(21, true)
    return validDimensions((bits & 0x3fff) + 1, ((bits >>> 14) & 0x3fff) + 1)
  }
  if (chunk === 0x56503820 && view.getUint8(23) === 0x9d && view.getUint8(24) === 0x01 && view.getUint8(25) === 0x2a) {
    return validDimensions(view.getUint16(26, true) & 0x3fff, view.getUint16(28, true) & 0x3fff)
  }
  return null
}

function bmpDimensions(view: DataView): ImageDimensions | null {
  if (view.byteLength < 26 || view.getUint16(0) !== 0x424d) return null
  const headerSize = view.getUint32(14, true)
  if (headerSize === 12) return validDimensions(view.getUint16(18, true), view.getUint16(20, true))
  return validDimensions(Math.abs(view.getInt32(18, true)), Math.abs(view.getInt32(22, true)))
}

function isoBmffDimensions(view: DataView): ImageDimensions | null {
  if (view.byteLength < 20 || view.getUint32(4) !== 0x66747970) return null
  for (let offset = 4; offset + 16 <= view.byteLength; offset += 1) {
    if (view.getUint32(offset) !== 0x69737065) continue
    const boxStart = offset - 4
    const boxSize = view.getUint32(boxStart)
    if (boxSize < 20 || boxStart + boxSize > view.byteLength) continue
    const dimensions = validDimensions(view.getUint32(offset + 8), view.getUint32(offset + 12))
    if (dimensions) return dimensions
  }
  return null
}

export function parseImageDimensions(buffer: ArrayBuffer): ImageDimensions | null {
  const view = new DataView(buffer)
  return jpegDimensions(view)
    ?? pngDimensions(view)
    ?? gifDimensions(view)
    ?? webpDimensions(view)
    ?? bmpDimensions(view)
    ?? isoBmffDimensions(view)
}

export async function readImageDimensions(file: Blob): Promise<ImageDimensions | null> {
  const initialSize = Math.min(file.size, INITIAL_HEADER_SIZE)
  let dimensions = parseImageDimensions(await file.slice(0, initialSize).arrayBuffer())
  if (dimensions || initialSize === file.size) return dimensions
  const extendedSize = Math.min(file.size, MAX_HEADER_SIZE)
  if (extendedSize === initialSize) return null
  dimensions = parseImageDimensions(await file.slice(0, extendedSize).arrayBuffer())
  return dimensions
}
