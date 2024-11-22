import process from "node:process";
import { deepMerge } from "@std/collections/deep-merge";
import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from "unocss";

const isDevelopment = process.env.NODE_ENV === "development";

export default defineConfig({
  presets: [
    presetUno(), // base の設定。 https://unocss.dev/presets/uno
    presetAttributify(), // class ではなく属性でスタイルを適用するための設定。 https://unocss.dev/presets/attributify
    presetIcons({ autoInstall: isDevelopment }), // icon を使うための設定。 https://unocss.dev/presets/icons
    presetWebFonts({
      provider: "none", //TODO: google fontsからfetchできるようにしたい https://github.com/unocss/unocss/issues/4146
      fonts: {
        "ekiden-heading": ["Noto Serif JP", "serif"],
        "ekiden-base": ["Noto Sans JP", "sans-serif"],
        "ekiden-mono": ["DejaVu Sans Mono", "monospace"],
      },
    }), // web font を使うための設定。 https://unocss.dev/presets/web-fonts
  ],
  transformers: [
    transformerDirectives(), // @apply等のディレクティブを使うための設定。https://unocss.dev/presets/directives
    transformerVariantGroup(), // hoverなど `:` で始まるクラスをまとめる設定。https://unocss.dev/presets/variant-group
  ],

  // `extendTheme` を用いないと deep-merge されない https://github.com/unocss/unocss/issues/3038#issuecomment-2287766398
  extendTheme: (_theme) =>
    deepMerge(_theme, {
      colors: {
        ekiden: {
          black: {
            500: "#222222",
          },
          gray: {
            500: "#666",
            600: "#979381",
          },
          green: {
            500: "#477745",
            600: "#97C795",
            900: "#C4DFC3",
          },
          blue: {
            500: "#2a9bdd",
          },
          white: {
            500: "#FDFBF7",
          },
        },
      },
    }),
});
