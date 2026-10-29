# Visual QA harness

Small script used while redesigning the site. It is **not published** — the folder
is listed in `_config.yml → exclude`.

It drives a headless Chrome over the DevTools Protocol (no npm dependencies) and
writes a PNG, optionally in dark mode or at a given scroll offset.

```bash
# start the site first (from docs/)
JEKYLL_NO_BUNDLER_REQUIRE=true jekyll serve --port 4100 --no-watch

cd _preview

# full page, light theme
node shot.mjs http://127.0.0.1:4100/ out/home.png 1440 900 full light

# one viewport at 1000px scroll, dark theme
node shot.mjs http://127.0.0.1:4100/about/ out/about.png 1440 1000 scroll dark 1 1000

# mobile width
node shot.mjs http://127.0.0.1:4100/ out/mobile.png 390 844 viewport light
```

Arguments: `url out [width] [height] [full|viewport|scroll] [light|dark] [scale] [scrollY]`

It prints a JSON probe (page height, theme, language) plus any console errors, which
is handy for catching broken selectors after a redesign.
