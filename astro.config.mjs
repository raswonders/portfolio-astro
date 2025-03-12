// @ts-check
import { defineConfig, passthroughImageService } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import netlify from "@astrojs/netlify";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  devToolbar: { enabled: false },
  server: { port: 3000, host: true },
  output: "server",
  adapter: netlify(),
  image: {
    service: passthroughImageService(),
  },
});
