import { file } from "bun";
import { resolve } from "node:path";
import { ISLAND_PATTERN } from "./manifest.js";

/**
 * @param {Object} options
 * @param {{ islands: Record<string, Record<string, string>> }} options.manifest
 */
export function createServer({ manifest }) {
  /**
   * @param {import('vite').Connect.IncomingMessage | import('node:http').IncomingMessage} req
   * @param {import('node:http').ServerResponse} res
   * @param {import('vite').Connect.NextFunction} [next]
   */
  return async (req, res, next) => {
    const url = req.originalUrl ?? req.url;

    try {
      if (url === "/") {
        /**
         * Load template and build manifest
         */
        const [buildManifest, template] = await Promise.all([
          await file(resolve("dist/server/.vite/manifest.json")).json(),
          await file(resolve("dist/client/index.html")).text(),
        ]);

        /**
         * Render the html for each island
         */
        const renderedIslands = Object.entries(manifest.islands).map(
          async ([match, island]) => {
            const entry = resolve(
              "dist/server",
              buildManifest[island.server].file,
            );
            const { render } = await import(entry);
            return [match, await render()];
          },
        );

        const islands = Object.fromEntries(await Promise.all(renderedIslands));

        /**
         * Replace the <island /> tags with the rendered html
         */
        const html = template.replaceAll(
          ISLAND_PATTERN,
          (match) => islands[match],
        );

        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html");
        return res.end(html);
      }

      /**
       * Serve static files
       */
      const staticFile = file(resolve("dist/client", url.replace(/^\//, "")));

      if (await staticFile.exists()) {
        res.statusCode = 200;
        res.setHeader("Content-Type", staticFile.type);
        return res.end(await staticFile.text());
      }
    } catch (e) {
      /**
       * Pass error to `next` for the Vite Preview Server
       */
      if (next) {
        return next(e);
      }

      /**
       * In production, log the error and respond with `500`
       */
      console.error(e);
      res.statusCode = 500;
      return res.end("Internal Server Error");
    }

    res.statusCode = 404;
    return res.end("Not Found");
  };
}

/**
 * @param {Object} options
 * @param {{ islands: Record<string, Record<string, string>> }} options.manifest
 * @param {import('vite').ViteDevServer} options.vite
 */
export function createDevServer({ manifest, vite }) {
  /**
   * @param {import('vite').Connect.IncomingMessage} req
   * @param {import('node:http').ServerResponse} res
   * @param {import('vite').Connect.NextFunction} next
   */
  return async (req, res, next) => {
    /**
     * The Vite dev server overwrites the request url to always point to the
     * index.html, so we need to read from the originalUrl instead
     */
    const url = req.originalUrl ?? "/";

    try {
      /**
       * Load and transform the index.html
       */
      const template = await vite.transformIndexHtml(
        url,
        await file(resolve("index.html")).text(),
      );

      /**
       * Render the html for each island
       */
      const renderedIslands = await Promise.all(
        Object.entries(manifest.islands).map(async ([match, island]) => {
          const { render } = await vite.ssrLoadModule(island.server);
          return [match, await render()];
        }),
      );

      const islands = Object.fromEntries(renderedIslands);

      /**
       * Replace the <island /> tags with the rendered html
       */
      const html = template.replaceAll(
        ISLAND_PATTERN,
        (match) => islands[match],
      );

      res.statusCode = 200;
      res.setHeader("Content-Type", "text/html");
      return res.end(html);
    } catch (e) {
      if (e instanceof Error) {
        vite.ssrFixStacktrace(e);
      }

      return next(e);
    }
  };
}
