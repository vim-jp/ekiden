import * as ufo from "ufo";

/**
 * URL を結合して末尾にスラッシュを付与する
 */
export function joinURLWithTrailingSlash(
  baseURL: string,
  ...paths: string[]
): string {
  return ufo.withTrailingSlash(ufo.joinURL(baseURL, ...paths));
}
