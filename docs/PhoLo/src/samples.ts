import type { AssetImage } from './types'

const svgData = (width: number, height: number, body: string) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">${body}</svg>`)}`

const samples: AssetImage[] = [
  {
    id: 'sample-aurora', name: 'Aurora', width: 1200, height: 900, aspect: 4 / 3, weight: 1, enabled: true, origin: 'demo',
    src: svgData(1200, 900, `<defs><linearGradient id="a" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#17243d"/><stop offset=".48" stop-color="#4c8ca2"/><stop offset="1" stop-color="#e8b978"/></linearGradient><radialGradient id="b"><stop stop-color="#dff8ed" stop-opacity=".95"/><stop offset="1" stop-color="#6ed0c0" stop-opacity="0"/></radialGradient></defs><rect width="1200" height="900" fill="url(#a)"/><circle cx="420" cy="360" r="360" fill="url(#b)"/><path d="M0 670 Q240 550 430 690 T820 640 T1200 670 V900 H0Z" fill="#132236" fill-opacity=".8"/><circle cx="900" cy="180" r="72" fill="#f7dfb2" fill-opacity=".55"/>`),
  },
  {
    id: 'sample-tide', name: 'Tide', width: 1200, height: 1200, aspect: 1, weight: 1, enabled: true, origin: 'demo',
    src: svgData(1200, 1200, `<defs><linearGradient id="c" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#e9eee8"/><stop offset="1" stop-color="#78959a"/></linearGradient></defs><rect width="1200" height="1200" fill="url(#c)"/><path d="M0 640 C180 510 340 740 540 610 S900 560 1200 680 V1200 H0Z" fill="#264c56" fill-opacity=".86"/><path d="M0 720 C210 620 355 800 580 700 S970 690 1200 760" fill="none" stroke="#d2e7dc" stroke-width="22" stroke-opacity=".7"/><circle cx="270" cy="300" r="120" fill="#fff4dc" fill-opacity=".6"/>`),
  },
  {
    id: 'sample-noir', name: 'Noir', width: 1200, height: 1500, aspect: .8, weight: 1, enabled: true, origin: 'demo',
    src: svgData(1200, 1500, `<defs><linearGradient id="d" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#131a20"/><stop offset=".65" stop-color="#6d4a38"/><stop offset="1" stop-color="#d19a67"/></linearGradient></defs><rect width="1200" height="1500" fill="url(#d)"/><rect x="130" y="180" width="940" height="1080" rx="470" fill="#0e151b" fill-opacity=".6"/><circle cx="600" cy="600" r="220" fill="#c9a178" fill-opacity=".9"/><path d="M300 1280 Q600 850 900 1280 V1500 H300Z" fill="#11171c"/><path d="M490 545 Q600 470 710 545" fill="none" stroke="#f5d9b1" stroke-width="16" stroke-linecap="round"/>`),
  },
  {
    id: 'sample-signal', name: 'Signal', width: 1600, height: 900, aspect: 16 / 9, weight: 1, enabled: true, origin: 'demo',
    src: svgData(1600, 900, `<rect width="1600" height="900" fill="#f0d75f"/><path d="M0 0 L1600 900 M1600 0 L0 900" stroke="#1f3035" stroke-width="190"/><path d="M0 210 L1600 690 M0 690 L1600 210" stroke="#e06f53" stroke-width="90" stroke-opacity=".92"/><circle cx="800" cy="450" r="128" fill="#f0d75f" stroke="#1f3035" stroke-width="34"/>`),
  },
]

export function makeSampleImages(): AssetImage[] {
  return samples.map((image) => ({ ...image }))
}
