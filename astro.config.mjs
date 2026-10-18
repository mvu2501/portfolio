// File cấu hình Astro.
import { defineConfig } from 'astro/config';
import rehypeOutcome from './src/plugins/rehype-outcome.mjs';

export default defineConfig({
  markdown: {
    // Gói mục Outcome thành 4 khung (xem src/plugins/rehype-outcome.mjs)
    rehypePlugins: [rehypeOutcome],
  },
});
