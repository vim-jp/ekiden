<script lang="ts">
  import { Bar } from "svelte-chartjs";
  import { Chart as ChartJS } from "chart.js";
  import "chart.js/auto";
  import type { ChartOptions } from "chart.js/auto";

  // export let userRankings: {
  //   user: string;
  //   articleCount: number;
  //   rank: number;
  // }[];
  export let articles: {
    title: string;
    date: string;
    runner: string;
    url: string | null;
    githubUser: string;
    issueNumber: number;
  }[];

  // GitHubユーザーごとの記事数をカウント
  const userCounts: { [user: string]: number } = {};
  articles.forEach((article) => {
    const user = article.githubUser;
    if (userCounts[user]) {
      userCounts[user]++;
    } else {
      userCounts[user] = 1;
    }
  });

  // 同率のユーザーをグループ化
  const groupedUsers: { [count: number]: { rank: number; users: string[] } } =
    {};
  Object.entries(userCounts).forEach(([user, count]) => {
    if (!groupedUsers[count]) {
      groupedUsers[count] = { rank: 0, users: [] };
    }
    groupedUsers[count].users.push(user);
  });

  // ランキングを計算し、1つの配列にまとめる
  const userRankings: { user: string; articleCount: number; rank: number }[] =
    [];
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

  // const rank_10_count = userRankings[10].articleCount;
  const ranking = userRankings.filter(({ rank }) => rank <= 10);

  const longestUsername = Math.max(...ranking.map(({ user }) => user.length));
  const rankingTick = ranking.map(({ user, rank }) => {
    // FIXME: 左揃えにする方法がわからなかった
    const padding = " ".repeat(longestUsername - user.length);
    return `${rank}. ${user}${padding}`;
  });

  const data = {
    labels: rankingTick,
    datasets: [
      {
        label: "記事数",
        data: ranking.map(({ articleCount }) => articleCount),
        barThickness: 12,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    indexAxis: "y",
    // Elements options apply to all of the options unless overridden in a dataset
    // In this case, we are setting the border of each horizontal bar to be 2px wide
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
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
  };
</script>

<div id="rankings-container">
  <div>
    <Bar {data} {options} height={600} />
  </div>
</div>
