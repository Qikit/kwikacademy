import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';

// Replace `site` with the real GitHub username before deploy; `base` matches the repo name.
export default defineConfig({
  site: 'https://example.github.io',
  base: '/kwikacademy/',
  trailingSlash: 'ignore',
  integrations: [react(), mdx()],
});
