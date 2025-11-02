import * as ufo from "ufo";

/** hashの移動先がない場合、archivesへ遷移 */
export const hashRedirect = () => {
  const hash = window.location.hash;

  if (hash) {
    const id = hash.substring(1);
    const element = document.getElementById(id);

    if (!element) {

      window.location.href = `${ufo.withTrailingSlash(
        ufo.joinURL(import.meta.env.baseURL, "archives"),
      )}${hash}`;
    }
  }
};
