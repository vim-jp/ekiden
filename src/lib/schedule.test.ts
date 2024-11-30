import { expect, test } from "vitest";
import dayjs from "dayjs";
import { generate } from "./schedule.ts";

const LIMIT_TO_PREVENT_INIFINITE_LOOPS = 1000;

test("generates first date closed to the start", () => {
  const today = dayjs();
  for (const date of generate({ start: today })) {
    expect(today <= date).toBe(true);
    expect(
      date < today.add(3, "d"),
      `expect ${date.format("YYYY-MM-DD")} is less than three days later (${today.add(3, "d").format("YYYY-MM-DD")})`,
    ).toBe(true);
    break;
  }
});

test("generates days only on Monday, Wednesday or Friday", () => {
  let count = 0; // to prevent infinite loops
  for (const date of generate({})) {
    expect([1, 3, 5]).contain(date.day());
    if (count++ > LIMIT_TO_PREVENT_INIFINITE_LOOPS) {
      break;
    }
  }
});
