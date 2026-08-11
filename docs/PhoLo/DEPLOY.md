# Deploying PhoLo

PhoLo follows the same source plus `dist/` convention as the other standalone tools in this repository. From this directory:

```bash
npm ci
npm test
npm run build
```

Commit and publish the complete `dist/` directory. With this repository's `docs/` GitHub Pages source, the application is then available at `https://kannmu.top/PhoLo/dist/`. The default asset base is relative, so the entry script, stylesheet, favicon, and generated workers remain under that directory and no generated file needs manual path replacement.

For a fixed absolute deployment path, set `VITE_BASE_PATH` before building, for example `VITE_BASE_PATH=/tools/pholo/ npm run build`. The value must be the URL directory that contains the generated `index.html`, including its trailing slash.

Do not deploy the Vite source `index.html` as the production entry without building first, and do not edit `dist/index.html` after building. Vite writes the same base into the entry document and the worker URLs embedded in the application bundle; changing only the entry document breaks layout and image processing even when the interface itself loads.
