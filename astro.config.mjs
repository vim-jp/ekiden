import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";

// https://unocss.dev/integrations/astro
import UnoCSS from "unocss/astro";

export default defineConfig({
  site: "https://vim-jp.org",
  base: "/ekiden",
  publicDir: "./public",
  trailingSlash: "always",
  integrations: [
    UnoCSS({
      injectReset: true, // Inject the reset css. When passing `true`, `@unocss/reset/tailwind.css` will be used
    }),
    svelte(),
  ],
  server: {
    host: true,
  },
  redirects: {
    "/archive": "/ekiden/archives",
  },
});
