import dayjs from "dayjs";
import contents from "@/content.json";
import type { IsStringLiteral, OverrideProperties } from "type-fest";
import type { Article } from "./type.js";

/** 記事のフィルタリング条件 */
export type ReturnArticlesFilterOptions<T extends boolean, U extends string> = {
  /** 記事が公開されているかどうか */
  isPublished?: T;
  /** runner が指定されている場合、その runner の記事のみを抽出 */
  runner?: U;
};

/** 処理された記事の型 */
export type ProcessedArticle<
  T extends boolean | undefined = undefined,
  U extends string = string,
> = OverrideProperties<
  Article & {
    published: boolean;
    shortDate: string;
    year: string;
    originalIndex: number;
    runnerPath?: string;
  },
  {
    /** isPublished が true なら url は必ず存在する */
    url: T extends true ? string : string | null;
    /** isPublished が true なら published は必ず true になる */
    published: T extends true ? true : boolean;
    /* runner が指定されている場合、runner はそのliteral string と一致する */
    runner: U extends IsStringLiteral<T> ? T : string;
  }
>;

/**
 * 記事の一覧を返す
 * @param {ReturnArticlesOptions} options
 * @param {boolean} options.isPublished
 * @param {string} options.runner
 */
export function getArticles<T extends boolean, U extends string>(
  options: ReturnArticlesFilterOptions<T, U> = {},
): ProcessedArticle<T, U>[] {
  const today = dayjs();
  const articles: Article[] = contents.articles;
  return (
    articles
      /** 記事の日付を昇順に並び替え */
      .sort((a, b) => dayjs(a.date).unix() - dayjs(b.date).unix())
      /** 記事の日付をフォーマット */
      .map((article, index) => ({
        ...article,
        /**
         * もし、記事の日付が今日以前で、かつ、記事の URL が null でないなら published を true にする
         * NOTE: != null で null と undefined を両方弾いている https://typescript-jp.gitbook.io/deep-dive/recap/null-undefined#dochiradearukawochekkusuru
         */
        published: dayjs(article.date) <= today && article.url != null,
        shortDate: dayjs(article.date).format("M/D"),
        year: dayjs(article.date).format("YYYY"),
        /** index は記事のインデックス番号。０から始まる */
        originalIndex: index,
        runnerPath: article.githubUser
          ? `/ekiden/runners/${article.githubUser}/`
          : undefined,
      }))
      /** githubUser が runner と一致するものを抽出. もし runner が undefined なら全ての記事を抽出 */
      .filter(
        ({ githubUser }) =>
          options.runner === undefined || githubUser === options.runner,
      )
      /** もし fileterByIsPublished が undefined なら全ての記事を抽出. もし、true なら published が true の記事を抽出 */
      .filter(
        (article) => options.isPublished === undefined || article.published,
      ) as ProcessedArticle<T, U>[]
  );
}
