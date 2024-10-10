import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import vue from "@vitejs/plugin-vue";
import react from "@vitejs/plugin-react";
import { ssr } from "vite-plugin-ssr";

export default defineConfig({
  plugins: [svelte(), vue(), react(), ssr()],
});
