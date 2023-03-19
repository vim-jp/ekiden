module.exports = {
  extends: [
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:astro/recommended",
  ],
  parserOptions: {
    sourceType: "module",
    project: "./tsconfig.json",
    ecmaVersion: "latest",
  },
  overrides: [
    {
      files: ["*.astro"],
      parser: "astro-eslint-parser",
      parserOptions: {
        parser: "typescript-eslint-parser-for-extra-files",
        extraFileExtensions: [".astro"],
      },
      rules: {
        "@typescript-eslint/no-unused-vars": [
          "warn",
          {
            varsIgnorePattern: "^Props$",
          },
        ],
      },
    },
  ],
};
