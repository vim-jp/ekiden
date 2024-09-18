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
      provider: "none", // defaultをnoneにして、必要な場合のみgoogle fontを使うようにする https://unocss.dev/presets/web-fonts#google-fonts
      fonts: {
        "ekiden-heading": [
          { name: "Kaushan Script", provider: "google" },
          { name: "Yuji Syuku", provider: "google" },
          "serif",
        ],
        "ekiden-base": ["sans-serif"],
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
            500: "#333",
          },
          gray: {
            500: "#666",
          },
          green: {
            500: "#477745",
            600: "#97C795",
          },
          blue: {
            500: "#2a9bdd",
          },
          white: {
            500: "#efefef",
          },
        },
      },
    }),
});
