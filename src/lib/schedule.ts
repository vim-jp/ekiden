import dayjs from "dayjs";

// Schedules must be started on Monday, Wednesday or Friday
function calcFirstDate(start: dayjs.Dayjs): dayjs.Dayjs {
  switch (start.day()) {
    case 0:
    case 2:
    case 4:
      return start.add(1, "d");
    case 1:
    case 3:
    case 5:
      return start;
    case 6:
      return start.add(2, "d");
  }
}

/**
  Generates scheduled dates only on Monday, Wednesday and Friday
 */
export function* generate({
  start,
}: {
  start?: dayjs.Dayjs;
}): Generator<dayjs.Dayjs, void, unknown> {
  let cur = calcFirstDate(start ?? dayjs());
  while (true) {
    yield cur;
    cur = cur.add(cur.day() >= 4 ? 3 : 2, "d");
  }
}
