import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import { VitePWA } from "vite-plugin-pwa";
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr(),
    VitePWA({
      manifest: {
        name: "LoFi FM",
        short_name: "LoFi FM",
        start_url: ".",
        display: "standalone",
        background_color: "#ffffff",
        lang: "en",
        scope: "/",
        icons: [
          {
            src: "lofifm.png",
            sizes: "64x64 32x32 24x24 16x16",
            type: "image/png",
          },
          { src: "lofifm.png", type: "image/png", sizes: "192x192" },
          { src: "lofifm.png", type: "image/png", sizes: "512x512" },
        ],
        theme_color: "#000000",
      },
    }),
    visualizer(),
  ],
  define: {
    "process.env": process.env,
  },
  server: {
    hmr: {
        clientPort: 443
    }
  }
});
