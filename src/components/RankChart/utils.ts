import type { ChartData, ChartOptions } from "chart.js";
import type { Article, Ranking } from "./types";

/**
 * ランキングを計算し、1つの配列にまとめる
 */
export function getRanking(articles: Article[]): Ranking[] {
  /** GitHubユーザーごとの記事を集約 */
  const articlesGroupByUser = Object.groupBy(
    articles,
    ({ githubUser }) => githubUser,
  );

  /** ランキングを計算 */
  return (
    Object.entries(articlesGroupByUser)
      /** 記事数を計算 */
      .map(([user, articles]) => ({
        user,
        articleCount: articles?.length ?? 0,
      }))

      /** 記事数で降順ソート */
      .toSorted((a, b) => b.articleCount - a.articleCount)

      /** ランクを計算。同じ記事数の場合は同じランクにする */
      .reduce((acc, current, index) => {
        /** 1つ前のユーザー */
        const prevRankedUser = acc.at(index - 1);

        /** 
          もし前の要素が存在し、記事数が同じ場合は同じランクにする 
          それ以外の場合はインデックス+1をランクとする
        */
        const rank =
          prevRankedUser?.articleCount === current.articleCount
            ? prevRankedUser.rank
            : index + 1;

        return [...acc, { ...current, rank }];
      }, [] as Ranking[])
  );
}

/**
 * getOptions returns the options for the bar chart.
 */
export function getOptions(data: ChartData<"bar">) {
  return {
    indexAxis: "y",
    // Elements options apply to all of the options unless overridden in a dataset
    // In this case, we are setting the border of each horizontal bar to be 2px wide
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    onClick: function (_, items) {
      if (items.length > 0) {
        const item = items[0];
        if (data.labels === null || data.labels![item.index] === null) return;
        const labelText = data.labels![item.index] + "";

        const matched = /^\d+\.\s+(\S+)/.exec(labelText);
        if (matched === null) return;
        const githubUser = matched[1];
        window.location.href = `/ekiden/runners/${githubUser}/`;
      }
    },
    scales: {
      x: {
        ticks: {
          stepSize: 1,
        },
      },
      y: {
        ticks: {
          autoSkip: false,
          padding: 4,
          font: {
            size: 16,
            family: "monospace",
          },
        },
        grid: {
          display: false,
        },
      },
    },
  } as const satisfies ChartOptions<"bar">;
}

/**
 * getData returns the data for the bar chart.
 */
export function getData(ranking: Ranking[]) {
  /** find the longest username */
  const longestUsername = Math.max(...ranking.map(({ user }) => user.length));

  const rankingTick = ranking.map(({ user, rank }) => {
    // FIXME: 左揃えにする方法がわからなかった
    const padding = " ".repeat(longestUsername - user.length);
    return `${rank}. ${user}${padding}`;
  });

  return {
    labels: rankingTick,
    datasets: [
      {
        label: "記事数",
        data: ranking.map(({ articleCount }) => articleCount),
        barThickness: 12,
        backgroundColor: (ctx) => {
          const rank = ranking[ctx.dataIndex].rank;
          switch (rank) {
            case 1:
              return "#FFD700";
            case 2:
              return "#C0C0C0";
            case 3:
              return "#C47222";
            default:
              return "#6cb26a";
          }
        },
        borderRadius: 5,
        borderWidth: 0,
        barPercentage: 0.5,
      },
    ],
  } as const satisfies ChartData<"bar">;
}
