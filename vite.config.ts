import Vue from "@vitejs/plugin-vue";
import * as path from "path";
import Icons from "unplugin-icons/vite";
import { defineConfig } from "vitest/config";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    Vue(),
    Icons({ compiler: "vue3" }),
    VitePWA({
      manifest: {
        name: "Can't Decide",
        short_name: "Can't Decide",
        lang: "en-US",
        theme_color: "#213080",
        background_color: "#141D4D",
        icons: [
          {
            src: "./img/icons/manifest-icon-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable any",
          },
          {
            src: "./img/icons/manifest-icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable any",
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    include: ["**/*.spec.ts"],
  },
});
