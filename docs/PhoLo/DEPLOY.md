# Deploying PhoLo

PhoLo follows the same source plus `dist/` convention as the other standalone tools in this repository. From this directory:

```bash
npm ci
npm test
npm run build
```

Publish the contents of `dist/` as a static site. The default asset base is `/PhoLo/`, so it is suitable for the repository's existing GitHub Pages path when the build output is copied to the `PhoLo` site root. For a different path, set `VITE_BASE_PATH` before building, for example `VITE_BASE_PATH=/tools/pholo/ npm run build`.

Do not deploy the Vite source `index.html` as the production entry without building first. The generated `dist/index.html` contains the hashed worker and application assets.
