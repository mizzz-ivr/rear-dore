import { describe, expect, it } from "vitest";
import { formatCountdown } from "./countdown";

describe("formatCountdown", () => {
  it.each([
    [24 * 60 * 60 * 1000, "24:00:00", 24, 0, 0],
    [60 * 60 * 1000, "01:00:00", 1, 0, 0],
    [60 * 1000, "00:01:00", 0, 1, 0],
    [1000, "00:00:01", 0, 0, 1],
  ] as const)("%smsを%sへ整形する", (milliseconds, text, hours, minutes, seconds) => {
    expect(formatCountdown(milliseconds)).toEqual({
      hours,
      minutes,
      seconds,
      text,
      accessibleText: `次の問題更新まで${hours}時間${minutes}分${seconds}秒です。`,
    });
  });

  it("端数ミリ秒を次の秒へ切り上げる", () => {
    expect(formatCountdown(1001).text).toBe("00:00:02");
    expect(formatCountdown(1).text).toBe("00:00:01");
  });

  it.each([0, -1, -1000])("%smsを更新直前として扱う", (milliseconds) => {
    expect(formatCountdown(milliseconds)).toEqual({
      hours: 0,
      minutes: 0,
      seconds: 0,
      text: "00:00:00",
      accessibleText: "まもなく本日の問題を更新します。",
    });
  });

  it.each([Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY])(
    "不正な値%sを拒否する",
    (milliseconds) => {
      expect(() => formatCountdown(milliseconds)).toThrow(RangeError);
    },
  );
});
