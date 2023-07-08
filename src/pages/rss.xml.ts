import rss from "@astrojs/rss";
import dayjs from "dayjs";
import content from "../content.json";

export async function get(context: { site: string }) {
  const today = dayjs();
  const articles = content.articles
    .filter((article) => article.url)
    .filter((article) => today >= dayjs(article.date))
    .sort((a, b) => dayjs(b.date).unix() - dayjs(a.date).unix())
    .slice(0, 10);

  return rss({
    title: "Vim 駅伝",
    description:
      "「Vim 駅伝」とは、Vim に関する記事を持ち回りで執筆する企画です。",
    site: context.site,
    items: articles.map((article) => ({
      title: article.title,
      description: `By ${article.runner}`,
      pubDate: dayjs(article.date).toDate(),
      // article.url が null なものは除いているため本当はいらないのだが、
      // 型チェックを通すために仕方なく
      link: article.url ?? "",
    })),
  });
}
