import eslint from "@eslint/js";
import eslintPluginAstro from "eslint-plugin-astro";
import unocss from "@unocss/eslint-config/flat";

export default [
  unocss,
  eslint.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
];
