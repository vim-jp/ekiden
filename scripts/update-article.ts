import { sprintf } from "jsr:@std/fmt@1.0.0/printf";
import type { Article } from "../src/lib/type.ts";

function readJSONFile(path: string) {
  return JSON.parse(Deno.readTextFileSync(path));
}

const CONTENT_JSON_PATH = "./src/content.json";

function readContentJSON() {
  return readJSONFile(CONTENT_JSON_PATH);
}

function writeContentJSON(o: unknown) {
  Deno.writeTextFileSync(CONTENT_JSON_PATH, JSON.stringify(o, null, 2) + "\n");
}

type Issue = {
  number: number;
  title: string;
  body: string;
  state: string;
  state_reason: string;
  user: {
    login: string;
  };
};

type Action = "insert" | "delete" | null;

type Result = {
  action?: Action;
  error: string | null;
};

class ValidationError extends Error {
  constructor(message: string) {
    super(message);
  }
}

function weekdayNumToStr(weekday: number): string {
  return [
    "日曜日",
    "月曜日",
    "火曜日",
    "水曜日",
    "木曜日",
    "金曜日",
    "土曜日",
  ][weekday];
}

function todayInJST(): string {
  const d = new Date();
  d.setHours(d.getHours() + 9);
  return d.toISOString().split("T")[0];
}

function validatePublishDate(date: string) {
  if (date.localeCompare("2023-03-01") < 0) {
    throw new ValidationError(
      `公開日は 2023-03-01 以降の日付である必要があります。: ${date}`,
    );
  }

  const VALID_WEEKDAYS = [1, 3, 5];
  const weekday = new Date(date).getDay();
  if (!VALID_WEEKDAYS.includes(weekday)) {
    const VALID_WEEKDAY_STRS = VALID_WEEKDAYS.map(weekdayNumToStr).join("、");
    throw new ValidationError(
      `公開日は${VALID_WEEKDAY_STRS}のいずれかである必要があります。: ${date} (${weekdayNumToStr(weekday)
      })`,
    );
  }
}

function unescapeContent(s: string): string {
  return /^(`*)(.*)\1$/s.exec(s)![2].trim().replaceAll(/[\r\n]/g, "");
}

function descriptionToArticle(
  description: string,
  githubUser: string,
): Article {
  let title: string | null = null
  let runner: string | null = null
  let date: string | null = null
  let url: string | null = null;

  const sections = description.split("\n###").map((s) => s.trim()).filter((s) =>
    s != ""
  );

  const isEmpty = (s: string): boolean => {
    return /^\s*$/.test(s) || s === "_No response_";
  };

  sections.forEach((section) => {
    const matched = section.match(/([^\r\n]+)[\r\n]*(.*)/s);
    if (!matched) {
      throw new ValidationError(`不正な形式のセクションです。: ${section}`);
    }

    const [_, head, content] = matched;
    switch (head) {
      case "公開日": {
        const matchedDate = content.match(/(\d+)\D+(\d+)\D+(\d+)/);
        if (!matchedDate) {
          throw new ValidationError(`公開日が不正です。: ${content}`);
        }
        const d = sprintf(
          "%04d-%02d-%02d",
          matchedDate[1],
          matchedDate[2],
          matchedDate[3],
        );
        validatePublishDate(d);
        date = d
        break;
      }
      case "執筆者名": {
        const unescaped = unescapeContent(content);
        runner = isEmpty(unescaped) ? githubUser : unescaped;
        break;
      }
      case "記事タイトル": {
        title = unescapeContent(content);
        break;
      }
      case "記事 URL": {
        const unescaped = unescapeContent(content);
        if (/^http/.test(unescaped)) {
          url = unescaped;
        } else if (!isEmpty(unescaped)) {
          throw new ValidationError(`記事 URL の形式が不正です。: ${content}`);
        }
        break;
      }
      case "注意事項の確認": {
        // noop
        break;
      }
      default:
        throw new ValidationError(
          `未対応のセクションが含まれています。: ${head}`,
        );
    }
  });

  if (!title) {
    throw new ValidationError("記事タイトルがありません。");
  }
  if (!date) {
    throw new ValidationError("公開日がありません。");
  }
  if (!runner) {
    throw new ValidationError("執筆者名がありません。");
  }

  return {
    title,
    date,
    runner,
    url,
    githubUser,
  };
}

function checkOverwritable(existanceArticle: Article, newArticle: Article) {
  if (
    typeof existanceArticle.issueNumber === "number" &&
    typeof newArticle.issueNumber === "number"
  ) {
    return existanceArticle.issueNumber === newArticle.issueNumber;
  }
  return existanceArticle.runner === newArticle.runner;
}

function insertArticleToContents(articles: Article[], newArticle: Article): Action {
  const existenceSameIssueArticleIndex = articles.findIndex((a) =>
    a.issueNumber === newArticle.issueNumber
  );
  if (0 <= existenceSameIssueArticleIndex) {
    articles.splice(existenceSameIssueArticleIndex, 1);
  }

  const existenceArticleIndex = articles.findIndex((a) =>
    a.date === newArticle.date
  );
  if (0 <= existenceArticleIndex) {
    if (checkOverwritable(articles[existenceArticleIndex], newArticle)) {
      articles[existenceArticleIndex] = newArticle;
    } else {
      let msg = `${newArticle.date} はすでに登録済みです。`;
      const issueNumber = articles[existenceArticleIndex].issueNumber;
      if (issueNumber) {
        msg += ` (#${issueNumber})`;
      }
      throw new ValidationError(msg);
    }
  } else {
    articles.push(newArticle);
  }
  articles.sort((a, b) => a.date.localeCompare(b.date));
  return 0 <= existenceSameIssueArticleIndex ? null : "insert";
}

function deleteArticleFromContents(articles: Article[], newArticle: Article): Action {
  const existenceArticleIndex = articles.findIndex((a) =>
    a.issueNumber === newArticle.issueNumber
  );
  if (0 <= existenceArticleIndex) {
    articles.splice(existenceArticleIndex, 1);
    return "delete";
  }
  return null;
}

function isFulfillCancelCondition(issue: Issue, article: Article) {
  return issue.state === "closed" &&
    (article.url == null || todayInJST().localeCompare(article.date) < 0 ||
      issue.state_reason === "not_planned");
}

function main() {
  const result: Result = {
    error: null,
  };
  const { issue } = readJSONFile(Deno.args[0]) as { issue: Issue };
  const description = `公開日\n${issue.title}\n${issue.body}`;
  const githubUser = issue.user.login;
  const article = descriptionToArticle(description, githubUser);

  article.issueNumber = issue.number;

  const contents = readContentJSON();
  if (isFulfillCancelCondition(issue, article)) {
    // キャンセル条件を満たしていた場合は記事を削除する
    result.action = deleteArticleFromContents(contents.articles, article);
  } else {
    // それ以外の場合は記事を追加または更新する
    result.action = insertArticleToContents(contents.articles, article);
  }
  writeContentJSON(contents);
  return result;
}

try {
  const result = main();
  console.log(JSON.stringify(result));
} catch (e) {
  if (e instanceof ValidationError) {
    console.log(JSON.stringify({
      error: e.message,
    }));
  } else {
    console.log(JSON.stringify({
      error: `Fatal error: ${e}`,
    }));
  }
}
