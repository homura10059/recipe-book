import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://recipe-book.homura10059.dev',
  integrations: [sitemap()],
  image: {
    domains: ['images.microcms-assets.io', 'imagedelivery.net'],
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
