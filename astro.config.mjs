import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://qikit.github.io',
  base: '/kwikacademy/',
  trailingSlash: 'ignore',
  integrations: [react(), mdx()],
});
