import type { ChartData, ChartOptions } from "chart.js";
import type { Article, Ranking } from "./types";

/**
 * ランキングを計算し、1つの配列にまとめる
 */
export function getRanking(articles: Article[]): Ranking[] {
  /** GitHubユーザーごとの記事数をカウント */
  const userCounts: { [user: string]: number } = {};
  articles.forEach((article) => {
    const user = article.githubUser;
    if (userCounts[user]) {
      userCounts[user]++;
    } else {
      userCounts[user] = 1;
    }
  });

  /** 同率のユーザーをグループ化 */
  const groupedUsers: { [count: number]: { users: string[] } } = {};
  Object.entries(userCounts).forEach(([user, count]) => {
    if (!groupedUsers[count]) {
      groupedUsers[count] = { users: [] };
    }
    groupedUsers[count].users.push(user);
  });

  const userRankings: Ranking[] = [];
  let rank = 1;
  Object.keys(groupedUsers)
    .map(Number)
    .sort((a, b) => b - a)
    .forEach((count) => {
      const users = groupedUsers[count].users;
      users.forEach((user) => {
        userRankings.push({ user, articleCount: count, rank });
      });
      rank += users.length;
    });

  return userRankings.filter(({ rank }) => rank <= 10);
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
