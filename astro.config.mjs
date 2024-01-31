import { defineConfig } from "astro/config";

// https://astro.build/config
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  site: "https://vim-jp.org",
  base: "/ekiden",
  integrations: [tailwind()],
  server:{
      host:true
  },
  redirects: {
    "/archive": "/ekiden/archives"
  },
  trailingSlash: 'always'
});
