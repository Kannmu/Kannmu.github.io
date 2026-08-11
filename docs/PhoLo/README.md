# PhoLo

PhoLo is a browser-native photo layout optimizer. It arranges uncropped images into a rectangular canvas using translation and uniform scaling only. Every internal seam uses one exact gap, and the search runs in a Web Worker so the interface remains responsive.

## Run locally

```bash
npm install
npm run dev
```

Production build and tests:

```bash
npm test
npm run build
```

The default Vite base path is relative, so the complete `dist/` directory can be published at any URL without editing generated files. In this repository it is served at `https://kannmu.top/PhoLo/dist/`. For a fixed absolute deployment path, set `VITE_BASE_PATH` before building.

## Algorithm

PhoLo searches the space of slicing floorplans. A leaf has aspect ratio `r` and relation `W = rH`. Every subtree is reduced to the affine form `W = aH + bg`, where `g` is the global gap and `b` counts its geometric contribution. Horizontal and vertical composition therefore remain analytical rather than relying on pixel fitting. A fixed frame is enforced as an exact canvas ratio. The uncropped, proportionally scaled layout is centered within it, leaving only the background margin that is mathematically necessary when the source proportions cannot fill the frame.

The optimizer uses seeded multi-start construction and simulated annealing with four mutations: leaf exchange, cut inversion, tree rotation, and stochastic restart. Its objective combines weighted visual-area fairness, frame fill, extreme-size penalties, and invalid-geometry rejection. Search complexity is `O(iterations × N)` with a small constant and no image-pixel work.

Slicing floorplans are intentionally a restricted family. They guarantee exact gaps, no overlap, rectangular bounds, and fast deterministic geometry, but do not contain every possible rectangular dissection. This is a product tradeoff rather than a claim that all floorplans are slicing.

## Privacy and export

Uploaded files stay in browser memory. No server or API is used. PNG, JPEG, WebP, and SVG exports are rendered locally at 1600 px width.
