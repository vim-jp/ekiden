import { defineConfig } from "astro/config";

// https://astro.build/config
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  base: "/ekiden",
  integrations: [react(), tailwind()],
  server:{
      host:true
  }
});
