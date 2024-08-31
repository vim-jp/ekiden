export type Article = {
  title: string;
  date: string;
  runner: string;
  url: string | null;
  githubUser: string;
  issueNumber?: number;
};
