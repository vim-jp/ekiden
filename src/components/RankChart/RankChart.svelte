<script lang="ts">
  import {
    Chart as ChartJS,
    CategoryScale,
    BarController,
    LinearScale,
    BarElement,
  } from "chart.js";
  import { getData, getOptions, getRanking } from "./utils.js";
  import type { Article } from "./types.js";
  import { onMount } from "svelte";

  let canvas: HTMLCanvasElement | undefined;

  /** published な記事のみを抽出 */
  type Props = {
    articles: Article[];
  };
  const { articles }: Props = $props();

  /** ランキングを計算し、1つの配列にまとめる */
  const ranking = $derived(getRanking(articles));

  const data = $derived(getData(ranking));
  const options = $derived(getOptions(data));

  // effect が実行される前に Chart.js のカスタムスケールと要素を登録
  onMount(() => {
    // Register the custom scales and elements
    ChartJS.register(CategoryScale, LinearScale, BarElement, BarController);

    // Unregister the custom scales and elements
    return () => {
      ChartJS.unregister(BarController, BarElement, LinearScale, CategoryScale);
    };
  });

  // グラフの描画。jsが読み込まれた後に実行される。
  $effect(() => {
    const ctx = canvas?.getContext("2d");
    if (ctx == null) {
      return;
    }

    const chart = new ChartJS(ctx, {
      type: "bar",
      data,
      options,
    });

    // グラフの破棄
    return () => {
      chart.destroy();
    };
  });
</script>

<div id="rankings-container" class="w-[90vw] max-w-3xl px-1">
  <!-- svelte-ignore element_invalid_self_closing_tag -->
  <canvas bind:this={canvas} id="myChart" height={600} />
</div>
