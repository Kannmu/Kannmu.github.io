import { describe, expect, it } from 'vitest'
import { parseImageDimensions } from '../src/core/imageMetadata'

function png(width: number, height: number): ArrayBuffer {
  const buffer = new ArrayBuffer(24)
  const view = new DataView(buffer)
  view.setUint32(0, 0x89504e47)
  view.setUint32(4, 0x0d0a1a0a)
  view.setUint32(12, 0x49484452)
  view.setUint32(16, width)
  view.setUint32(20, height)
  return buffer
}

function orientedJpeg(): ArrayBuffer {
  const bytes = new Uint8Array([
    0xff, 0xd8,
    0xff, 0xe1, 0x00, 0x1e,
    0x45, 0x78, 0x69, 0x66, 0x00, 0x00,
    0x49, 0x49, 0x2a, 0x00, 0x08, 0x00, 0x00, 0x00,
    0x01, 0x00,
    0x12, 0x01, 0x03, 0x00, 0x01, 0x00, 0x00, 0x00, 0x06, 0x00, 0x00, 0x00,
    0xff, 0xc0, 0x00, 0x0b, 0x08, 0x0b, 0xb8, 0x0f, 0xa0, 0x01, 0x01, 0x11, 0x00,
    0xff, 0xd9,
  ])
  return bytes.buffer
}

function extendedWebp(width: number, height: number): ArrayBuffer {
  const buffer = new ArrayBuffer(30)
  const view = new DataView(buffer)
  view.setUint32(0, 0x52494646)
  view.setUint32(8, 0x57454250)
  view.setUint32(12, 0x56503858)
  const encodedWidth = width - 1
  const encodedHeight = height - 1
  view.setUint8(24, encodedWidth & 0xff)
  view.setUint8(25, (encodedWidth >>> 8) & 0xff)
  view.setUint8(26, (encodedWidth >>> 16) & 0xff)
  view.setUint8(27, encodedHeight & 0xff)
  view.setUint8(28, (encodedHeight >>> 8) & 0xff)
  view.setUint8(29, (encodedHeight >>> 16) & 0xff)
  return buffer
}

function isoBmff(width: number, height: number): ArrayBuffer {
  const buffer = new ArrayBuffer(40)
  const view = new DataView(buffer)
  view.setUint32(0, 20)
  view.setUint32(4, 0x66747970)
  view.setUint32(8, 0x61766966)
  view.setUint32(20, 20)
  view.setUint32(24, 0x69737065)
  view.setUint32(32, width)
  view.setUint32(36, height)
  return buffer
}

describe('image metadata parsing', () => {
  it('reads PNG dimensions without decoding pixels', () => {
    expect(parseImageDimensions(png(12000, 8000))).toEqual({ width: 12000, height: 8000 })
  })

  it('applies JPEG EXIF orientation to layout dimensions', () => {
    expect(parseImageDimensions(orientedJpeg())).toEqual({ width: 3000, height: 4000 })
  })

  it('reads extended WebP dimensions', () => {
    expect(parseImageDimensions(extendedWebp(8192, 5461))).toEqual({ width: 8192, height: 5461 })
  })

  it('reads ISO-BMFF image dimensions', () => {
    expect(parseImageDimensions(isoBmff(6048, 4032))).toEqual({ width: 6048, height: 4032 })
  })

  it('rejects unrelated data', () => {
    expect(parseImageDimensions(new ArrayBuffer(32))).toBeNull()
  })
})
