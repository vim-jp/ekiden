import { defineConfig } from "astro/config";

// https://astro.build/config
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  site: "https://vim-jp.org",
  base: "/ekiden",
  integrations: [react(), tailwind()],
});
