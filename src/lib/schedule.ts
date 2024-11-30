import dayjs from "dayjs";

export function* generate({ }: { breaker?: (d: dayjs.Dayjs) => boolean }): Generator<dayjs.Dayjs, void, unknown> {
  yield dayjs()
  yield dayjs()
  yield dayjs()
  yield dayjs()
  yield dayjs()
  yield dayjs()
}
