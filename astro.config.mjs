// @ts-check
import { defineConfig, passthroughImageService } from 'astro/config';

import tailwind from '@astrojs/tailwind';

import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  server: {port: 3000, host: true},
  output: "server",
  adapter: netlify(),
  image: {
    service: passthroughImageService()
  }
});