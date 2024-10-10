import { file } from 'bun';

export const ISLAND_PATTERN = /\s*<island(.*)\/>\s*/g;

/**
 * @param {string} path
 * @returns {Promise<{ islands: Record<string, Record<string, string>> }>}
 */
export async function generateManifest(path) {
  const html = await file(path).text();
  const tags = html.matchAll(ISLAND_PATTERN);
  const islands = {};

  for (const [html, htmlAttrs] of tags) {
    /**
     * Parse html attributes
     */
    const attrs = {};

    for (const htmlAttr of htmlAttrs.split(" ").filter((s) => s.trim())) {
      const [key, value] = htmlAttr.split("=");
      attrs[key] = value?.replaceAll(/\"/g, "") ?? true;
    }
    /**
     * Set island options
     */
    islands[html] = {
      src: attrs.src,
      server: `src/${attrs.src}/entry-server.js`,
      client: `src/${attrs.src}/entry-client.js`,
      hydrate: attrs.hydrate ?? false,
    };
  }

  return { path, islands };
}
