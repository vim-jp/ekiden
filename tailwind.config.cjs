/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        "ekiden-black": {
          500: "#333",
        },
        "ekiden-gray": {
          500: "#666",
        },
        "ekiden-green": {
          500: "#477745",
          600: "#97C795",
        },
        "ekiden-blue": {
          500: "#2a9bdd",
        },
        "ekiden-white": {
          500: "#efefef",
        },

      },
    },
    fontFamily: {
      "ekiden-heading": ["Kaushan Script", "Yuji Syuku", "serif"],
      "ekiden-base": ["sans-serif"],
      "ekiden-mono": ["DejaVu Sans Mono", "monospace"]
    }
  },
  plugins: [],
};
