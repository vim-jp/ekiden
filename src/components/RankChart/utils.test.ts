import type { Ranking } from "./types";
import * as utils from "./utils";
import { getArticles } from "@/lib/article";

describe("RankChart utils.ts", () => {
  let RANKING: Ranking[];
  let TOP_10_RANKING: Ranking[];
  beforeEach(() => {
    /** テストの結果が変わらないように、最初の50記事のみを取得 */
    const PUBLISHED_FIRST_50_ARTICLES = getArticles({
      isPublished: true,
    }).slice(0, 50);
    RANKING = utils.getRanking(PUBLISHED_FIRST_50_ARTICLES);
    TOP_10_RANKING = utils.getTopNRanking(RANKING, 10);
    Object.freeze(TOP_10_RANKING); // Ensure that the array is not mutated
  });

  it("getRanking", () => {
    const publishedFirst50Articles = getArticles({
      isPublished: true,
    }).slice(0, 50);
    const ranking = utils.getRanking(publishedFirst50Articles);

    /** ランクが1から始まっているか */
    expect(ranking[0].rank).toBe(1);

    /** 同じ記事数の場合は同じランクになるか.ソートされているか.上位10件のみで検証 */
    Array.from({ length: 10 }).forEach((_, i) => {
      const current = ranking[i];
      const prev = ranking[i - 1];

      /** どちらかが存在しない場合はスキップ */
      if (!(current && prev)) {
        return;
      }

      if (prev && prev.articleCount === current.articleCount) {
        expect(current.rank).toBe(prev.rank);
      } else {
        expect(current.rank).toBeGreaterThan(prev.rank);
      }
    });

    /** 記事数で降順ソートされているか */
    expect(ranking).toEqual(
      ranking.toSorted((a, b) => b.articleCount - a.articleCount),
    );

    /** 記事数の合計が50であるか */
    const totalArticleCount = ranking.reduce(
      (acc, { articleCount }) => acc + articleCount,
      0,
    );

    expect(totalArticleCount).toBe(50);
  });

  it("get to 10 ranking using getTopNRanking", () => {
    expect(TOP_10_RANKING.at(-1)?.rank).toBeLessThanOrEqual(10);
    expect(TOP_10_RANKING).toMatchInlineSnapshot(`
      [
        {
          "articleCount": 5,
          "rank": 1,
          "user": "staticWagomU",
        },
        {
          "articleCount": 5,
          "rank": 1,
          "user": "uga-rosa",
        },
        {
          "articleCount": 4,
          "rank": 3,
          "user": "monaqa",
        },
        {
          "articleCount": 3,
          "rank": 4,
          "user": "atusy",
        },
        {
          "articleCount": 3,
          "rank": 4,
          "user": "ryoppippi",
        },
        {
          "articleCount": 3,
          "rank": 4,
          "user": "kyoh86",
        },
        {
          "articleCount": 2,
          "rank": 7,
          "user": "thinca",
        },
        {
          "articleCount": 2,
          "rank": 7,
          "user": "matoruru",
        },
        {
          "articleCount": 2,
          "rank": 7,
          "user": "ArcCosine",
        },
        {
          "articleCount": 2,
          "rank": 7,
          "user": "eihigh",
        },
        {
          "articleCount": 2,
          "rank": 7,
          "user": "skanehira",
        },
      ]
    `);
  });

  it("getData", () => {
    const data = utils.getData(TOP_10_RANKING);
    expect(data).toMatchInlineSnapshot(`
      {
        "datasets": [
          {
            "backgroundColor": [Function],
            "barPercentage": 0.5,
            "barThickness": 12,
            "borderRadius": 5,
            "borderWidth": 0,
            "data": [
              5,
              5,
              4,
              3,
              3,
              3,
              2,
              2,
              2,
              2,
              2,
            ],
            "label": "記事数",
          },
        ],
        "labels": [
          "1. staticWagomU",
          "1. uga-rosa    ",
          "3. monaqa      ",
          "4. atusy       ",
          "4. ryoppippi   ",
          "4. kyoh86      ",
          "7. thinca      ",
          "7. matoruru    ",
          "7. ArcCosine   ",
          "7. eihigh      ",
          "7. skanehira   ",
        ],
      }
    `);
  });

  it("getOptions", () => {
    const data = utils.getData(TOP_10_RANKING);
    const options = utils.getOptions(data);
    expect(options).toMatchInlineSnapshot(`
      {
        "elements": {
          "bar": {
            "borderWidth": 2,
          },
        },
        "indexAxis": "y",
        "maintainAspectRatio": false,
        "onClick": [Function],
        "plugins": {
          "legend": {
            "display": false,
          },
          "title": {
            "display": false,
          },
        },
        "responsive": true,
        "scales": {
          "x": {
            "ticks": {
              "stepSize": 1,
            },
          },
          "y": {
            "grid": {
              "display": false,
            },
            "ticks": {
              "autoSkip": false,
              "font": {
                "family": "monospace",
                "size": 16,
              },
              "padding": 4,
            },
          },
        },
      }
    `);
  });
});
