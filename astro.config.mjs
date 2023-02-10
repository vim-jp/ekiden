import { defineConfig } from 'astro/config';

// https://astro.build/config
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  site: "https://peacock0803sz.github.io/ekiden/",
  base: "/ekiden",
  integrations: [react(), tailwind()],
});
