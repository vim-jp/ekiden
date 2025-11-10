import * as ufo from "ufo";
import contents from "@/content.json";
import type { Article } from "./type.js";

/** hashの移動先がない場合、archivesへ遷移 */
export const hashRedirect = () => {
  const hash = window.location.hash;

  if (hash) {
    const id = hash.substring(1);
    const element = document.getElementById(id);

    if (!element) {
      if (!/article-[0-9]{4}-[0-9]{2}-[0-9]{2}/.test(id)) {
        return;
      }
      const articles: Article[] = contents.articles;
      const hashDate = id.replace("article-", "");
      if (!articles.find((x) => x.date === hashDate)) {
        return;
      }

      window.location.href = `${ufo.withTrailingSlash(
        ufo.joinURL(import.meta.env.baseURL, "archives"),
      )}${hash}`;
    }
  }
};
