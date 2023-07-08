import { getStdin } from "https://deno.land/x/get_stdin@v1.1.0/mod.ts";
import { parse } from "https://deno.land/std@0.177.0/flags/mod.ts";
import { sprintf } from "https://deno.land/std@0.177.0/fmt/printf.ts";

const CONTENT_JSON_PATH = "./src/content.json";

function readContentJSON() {
  return JSON.parse(Deno.readTextFileSync(CONTENT_JSON_PATH));
}

function writeContentJSON(o: unknown) {
  Deno.writeTextFileSync(CONTENT_JSON_PATH, JSON.stringify(o, null, 2) + "\n");
}

type Article = {
  title: string;
  date: string;
  runner: string;
  url: string | null;
  githubUser: string;
  issueNumber?: number;
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
      `公開日は${VALID_WEEKDAY_STRS}のいずれかである必要があります。: ${date} (${
        weekdayNumToStr(weekday)
      })`,
    );
  }
}

function unescapeContent(s: string): string {
  return /^(`*)(.*)\1$/.exec(s)![2].trim();
}

function descriptionToArticle(
  description: string,
  githubUser: string,
): Article {
  let title, runner, date, url = null;

  const sections = description.split("\n###").map((s) => s.trim()).filter((s) =>
    s != ""
  );

  const isEmpty = (s: string): boolean => {
    return /^\s*$/.test(s) || s === "_No response_";
  };

  sections.forEach((section) => {
    const matched = section.match(/([^\r\n]+)[\r\n]*(.*)/);
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
        date = sprintf(
          "%04d-%02d-%02d",
          matchedDate[1],
          matchedDate[2],
          matchedDate[3],
        );
        validatePublishDate(date);
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

function insertArticleToContents(articles: Article[], newArticle: Article) {
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
}

function deleteArticleFromContents(articles: Article[], newArticle: Article) {
  const existenceArticleIndex = articles.findIndex((a) =>
    a.issueNumber === newArticle.issueNumber
  );
  if (newArticle.url) {
    throw new ValidationError(
      "URL が登録されている場合はクローズでのエントリー解除はできません。エントリー解除がしたい場合は URL を空にしてからやり直してください。",
    );
  }
  if (0 <= existenceArticleIndex) {
    articles.splice(existenceArticleIndex, 1);
  }
}

async function main() {
  const parsedArgs = parse(Deno.args);
  const description = await getStdin({ exitOnEnter: false });
  const { githubUser } = parsedArgs;
  if (!githubUser) {
    throw new Error("--githubUser required.");
  }
  const article = descriptionToArticle(description, githubUser);

  const issueNumber = Number(parsedArgs.issueNumber);
  if (issueNumber) {
    article.issueNumber = issueNumber;
  }

  const contents = readContentJSON();
  if (parsedArgs._[0] === "delete") {
    deleteArticleFromContents(contents.articles, article);
  } else {
    insertArticleToContents(contents.articles, article);
  }
  writeContentJSON(contents);
}

try {
  await main();
} catch (e) {
  if (e instanceof ValidationError) {
    console.error(e.message);
  } else {
    console.error("Fatal error:");
    console.error(e);
    Deno.exit(1);
  }
}
