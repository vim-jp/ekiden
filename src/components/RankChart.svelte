<script lang="ts">
  import { Bar } from "svelte-chartjs";
  import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
  } from "chart.js";
  import type { ChartData, ChartOptions } from "chart.js";

  ChartJS.register(CategoryScale, LinearScale, BarElement);

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

  const options = {
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
</script>

<div id="rankings-container" class="w-[90vw] max-w-3xl px-1">
  <div>
    <Bar {data} {options} height={600} />
  </div>
</div>
