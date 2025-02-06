import * as utils from "./utils";

describe("RankChart utils.ts", () => {
  describe("getRanking", () => {
    it("should start with rank 1", () => {
      const ranking = utils.getRanking([{ githubUser: "alice" }]);
      expect(ranking[0].rank).toBe(1);
    });

    it("should assign same rank for ties and skip next ranks appropriately", () => {
      const articles = [
        { githubUser: "alice" },
        { githubUser: "alice" },
        { githubUser: "alice" },
        { githubUser: "bob" },
        { githubUser: "bob" },
        { githubUser: "bob" },
        { githubUser: "charlie" },
        { githubUser: "charlie" },
        { githubUser: "david" },
      ];

      const ranking = utils.getRanking(articles);

      expect(ranking).toEqual([
        { rank: 1, user: "alice", articleCount: 3 },
        { rank: 1, user: "bob", articleCount: 3 },
        { rank: 3, user: "charlie", articleCount: 2 },
        { rank: 4, user: "david", articleCount: 1 },
      ]);
    });

    it("should have total article count", () => {
      const ranking = utils.getRanking([
        { githubUser: "alice" },
        { githubUser: "alice" },
        { githubUser: "bob" },
      ]);

      expect(ranking.length).toBe(2);
    });
  });

  describe("getTopNRanking", () => {
    const ranking = utils.getRanking([
      { githubUser: "alice" },
      { githubUser: "alice" },
      { githubUser: "alice" },
      { githubUser: "bob" },
      { githubUser: "bob" },
      { githubUser: "bob" },
      { githubUser: "charlie" },
      { githubUser: "charlie" },
      { githubUser: "david" },
    ]);

    it("should get top 1 rank", () => {
      const top1Ranking = utils.getTopNRanking(ranking, 1);
      expect(top1Ranking).toEqual([
        { rank: 1, user: "alice", articleCount: 3 },
        { rank: 1, user: "bob", articleCount: 3 },
      ]);
    });

    it("should get top 2 ranks (including ties)", () => {
      const top2Ranking = utils.getTopNRanking(ranking, 2);
      expect(top2Ranking).toEqual([
        { rank: 1, user: "alice", articleCount: 3 },
        { rank: 1, user: "bob", articleCount: 3 },
      ]);
    });

    it("should get top 3 ranks", () => {
      const top3Ranking = utils.getTopNRanking(ranking, 3);
      expect(top3Ranking).toEqual([
        { rank: 1, user: "alice", articleCount: 3 },
        { rank: 1, user: "bob", articleCount: 3 },
        { rank: 3, user: "charlie", articleCount: 2 },
      ]);
    });
  });

  describe("getData", () => {
    const ranking = utils.getRanking([
      { githubUser: "alice" },
      { githubUser: "alice" },
      { githubUser: "alice" },
      { githubUser: "bob" },
      { githubUser: "bob" },
      { githubUser: "bob" },
      { githubUser: "charlie" },
      { githubUser: "charlie" },
      { githubUser: "david" },
    ]);
    const top3Ranking = utils.getTopNRanking(ranking, 3);

    it("should match getData snapshot", () => {
      const data = utils.getData(top3Ranking);
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
                3,
                3,
                2,
              ],
              "label": "記事数",
            },
          ],
          "labels": [
            "1. alice  ",
            "1. bob    ",
            "3. charlie",
          ],
        }
      `);
    });
  });

  describe("getOptions", () => {
    const ranking = utils.getRanking([]);

    it("should match getOptions snapshot", () => {
      const data = utils.getData(ranking);
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
});
