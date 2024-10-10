## 1. Project boilerplate

- App with vite config
- Svelte, Vue, React app boilerplate
- Empty vite plugin
- Explain architecture structure
  - index.html (aka manifest)
  - entry-server.js
  - entry-client.js
  - Counter.(svelte|vue|jsx)

## 2. Intro text

- App:
  - Add entry to index.html
- Plugin:
  - Generate manifest (ssr:setup#config)
  - Create dev server (ssr:dev#configureServer)
    - Get url from req.originalUrl
    - Get transformed template (vite.transformIndexHtml)
    - Render islands from manifest (vite.ssrLoadModule)
    - Append rendered islands in template
  - Configure entrypoints from manifest (ssr:compile#config)

## 3. Vanilla counter

- App:
  - Add entry to index.html
- Plugin:
  - Add client script to index.html from manifest (ssr:compile#transformIndexHtml)

## 4. Svelte counter

- App:
  - Add entry to index.html
  - Install svelte plugin
  - Add svelte plugin to vite config

## 5. Vue counter

- App:
  - Add entry to index.html
  - Install vue plugin
  - Add vue plugin to vite config

## 5. React counter

- App:
  - Add entry to index.html
  - Install react plugin
  - Add react plugin to vite config

## 6. Production build

- Plugin:
  - Create production/preview server
    - Handle app route ('/' only)
      - Get url from req.originalUrl (preview) or req.url (prod)
      - Read vite manifest to get generated file names
      - Read template from generated index.html
      - Render islands using vite manifest
    - Handle static files
      - Check if file exists in client outdir
      - If it exists respond with contents and mimetype (res.statusCode, res.setHeader, res.end)
    - Log errors and send 500 status
    - All other cases return 404 status
  - Generate ssr & client (ssr:compile#writeBundle)
  - Generate server entry (ssr:compile#writeBundle)
  - Configure preview server (ssr:dev#configurePreviewServer)
