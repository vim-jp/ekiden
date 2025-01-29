import type { ProcessedArticle } from "@/lib/article";

export type Ranking = {
  user: string;
  articleCount: number;
  rank: number;
};

export type Article = ProcessedArticle<true>;
