import * as utils from "./utils";
import { getArticles } from "@/lib/article";

const PUBLISHED_FIRST_50_ARTICLES = getArticles({ isPublished: true }).slice(
  0,
  50,
);

describe("RankChart utils.ts", () => {
  it("get to 10 ranking", () => {
    const ranking = utils.getRanking(PUBLISHED_FIRST_50_ARTICLES);
    expect(ranking).toMatchInlineSnapshot(`
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
    const ranking = utils.getRanking(PUBLISHED_FIRST_50_ARTICLES);
    const data = utils.getData(ranking);
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
    const data = utils.getData(utils.getRanking(PUBLISHED_FIRST_50_ARTICLES));
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
