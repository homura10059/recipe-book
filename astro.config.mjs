import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

export default defineConfig({
  image: {
    domains: ['images.microcms-assets.io'],
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
