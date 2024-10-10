import { write } from "bun";
import { resolve } from "node:path";
import { build } from "vite";
import { createServer, createDevServer } from "./server.js";
import { generateManifest } from "./manifest.js";

/**
 * We will run the build twice first we'll generate an SSR bundle, then we'll
 * generate the client bundle
 */
let secondary_build_started = false;

/**
 * @returns {import('vite').Plugin[]}
 */
export function ssr() {
  /** @type {import('vite').UserConfig} */
  let initial_vite_config,
    /** @type {import('vite').ResolvedConfig} */
    vite_config,
    /** @type {import('vite').ConfigEnv} */
    vite_config_env,
    /** @type {boolean} */
    is_build,
    /** @type {{ islands: Record<string, Record<string, string>> }} */
    manifest;

  return [
    {
      name: "ssr:setup",

      async config(config, configEnv) {
        initial_vite_config = config;
        vite_config_env = configEnv;
        is_build = configEnv.command === "build";
        manifest = await generateManifest(resolve("index.html"));
      },

      configResolved(config) {
        vite_config = config;
      },
    },

    {
      name: "ssr:dev",
      configureServer(server) {
        return () =>
          server.middlewares.use(createDevServer({ manifest, vite: server }));
      },
    },

    {
      name: "ssr:preview",
      configurePreviewServer(server) {
        return () => server.middlewares.use(createServer({ manifest }));
      },
    },

    {
      name: "ssr:compile",

      /**
       * Configure build options
       */
      config() {
        const ssr = !secondary_build_started;

        /** @type {Record<string, string>} */
        const input = {};

        if (!ssr) {
          /**
           * Detect the client entries from the index.html
           */
          input.index = "index.html";
        } else {
          /**
           * Get the server entries from the manifest
           */
          for (const entry of Object.values(manifest.islands)) {
            input[entry.src] = entry.server;
          }
        }

        return {
          build: {
            ssr,
            manifest: true,
            outDir: ssr ? "dist/server" : "dist/client",
            rollupOptions: { input },
          },
        };
      },

      transformIndexHtml: {
        /**
         * Process the index.html before it is processed by Vite
         */
        order: "pre",
        async handler() {
          /**
           * @type {import('vite').HtmlTagDescriptor[]}
           */
          const clientScripts = [];

          for (const island of Object.values(manifest.islands)) {
            if (island.hydrate) {
              clientScripts.push({
                tag: "script",
                attrs: { type: "module", src: island.client },
                injectTo: "body",
              });
            }
          }

          return clientScripts;
        },
      },

      writeBundle: {
        sequential: true,
        async handler() {
          if (!is_build || secondary_build_started) {
            return;
          }

          secondary_build_started = true;

          /**
           * Build the client bundle
           */
          await build({
            configFile: vite_config.configFile,
            // CLI args
            mode: vite_config_env.mode,
            logLevel: vite_config.logLevel,
            clearScreen: vite_config.clearScreen,
            build: {
              minify: initial_vite_config.build?.minify,
              assetsInlineLimit: vite_config.build.assetsInlineLimit,
              sourcemap: vite_config.build.sourcemap,
            },
            optimizeDeps: {
              force: vite_config.optimizeDeps.force,
            },
          });

          /**
           * Build the server entry
           */

          const entryOutputPath = resolve("dist/server/start.js");

          const serverEntry = `
import { createServer as createHttpServer } from 'node:http';
import { createServer } from 'vite-plugin-ssr/server';

const manifest = ${JSON.stringify(manifest, null, "  ")};

createHttpServer(createServer({ manifest })).listen(8080);

console.log('Server listening at: http://localhost:8080');
					`;

          await write(entryOutputPath, serverEntry);

          this.emitFile({
            type: "prebuilt-chunk",
            fileName: "start.js",
            code: serverEntry,
          });
        },
      },
    },
  ];
}
