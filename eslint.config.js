import eslint from "@eslint/js";

import tsEslint from "typescript-eslint";
import tsEslintParser from "@typescript-eslint/parser";

import eslintPluginAstro from "eslint-plugin-astro";
import astroEslintParser from "astro-eslint-parser";

import eslintPluginSvelte from "eslint-plugin-svelte";
import svelteEslintParser from "svelte-eslint-parser";

const astroConfig = tsEslint.config({
  files: ["*.astro"],
  extends: [
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    ...eslintPluginAstro.configs.recommended,
  ],
  languageOptions: {
    parser: astroEslintParser,
    parserOptions: {
      parser: tsEslintParser,
      extraFileExtensions: [".astro"],
    },
  },
  rules: {
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        varsIgnorePattern: "^Props$",
      },
    ],
  },
});

const svelteConfig = tsEslint.config({
  files: ["*.svelte"],
  extends: [
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    ...eslintPluginSvelte.configs["flat/recommended"],
  ],
  languageOptions: {
    parser: svelteEslintParser,
    parserOptions: {
      parser: tsEslintParser,
      extraFileExtensions: [".svelte"],
    },
  },
});

const tsConfig = tsEslint.config({
  extends: [
    tsEslint.configs.eslintRecommended,
    ...tsEslint.configs.recommended,
    ...tsEslint.configs.recommendedTypeChecked,
  ],
  languageOptions: {
    parserOptions: {
      projectService: true,
      project: "./tsconfig.json",
      sourceType: "module",
      ecmaVersion: "latest",
    },
  },
});

export default tsEslint.config(
  eslint.configs.recommended,
  ...tsConfig,
  ...astroConfig,
  ...svelteConfig,
);
