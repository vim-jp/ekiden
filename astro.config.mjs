import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";

// https://astro.build/config
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  site: "https://vim-jp.org",
  base: "/ekiden",
  trailingSlash: "always",
  integrations: [tailwind(), svelte()],
  server: {
    host: true,
  },
  redirects: {
    "/archive": "/ekiden/archives",
  },
});
