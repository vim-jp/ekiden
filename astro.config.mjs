import { defineConfig } from 'astro/config';

// https://astro.build/config
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  site: "https://peacock0803sz.github.io/ekiden/",
  base: "/ekiden",
  integrations: [react()]
});
