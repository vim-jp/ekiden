import eslint from "@eslint/js";
import eslintPluginAstro from "eslint-plugin-astro";

export default [
  eslint.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
];
