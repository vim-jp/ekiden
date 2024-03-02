import rss from "@astrojs/rss";
import dayjs from "dayjs";
import { getArticles } from "@/lib/article";

export async function GET(context: { site: string }) {
  const articles = getArticles({ isPublished: true }).slice(0, 10);

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
