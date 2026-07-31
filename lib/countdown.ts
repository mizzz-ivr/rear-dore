export type CountdownParts = Readonly<{
  hours: number;
  minutes: number;
  seconds: number;
  text: string;
  accessibleText: string;
}>;

function assertFiniteMilliseconds(milliseconds: number): void {
  if (!Number.isFinite(milliseconds)) {
    throw new RangeError("millisecondsは有限の数値で指定してください。");
  }
}

function padTwoDigits(value: number): string {
  return value.toString().padStart(2, "0");
}

export function formatCountdown(milliseconds: number): CountdownParts {
  assertFiniteMilliseconds(milliseconds);

  const totalSeconds = Math.max(0, Math.ceil(milliseconds / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const text = `${padTwoDigits(hours)}:${padTwoDigits(minutes)}:${padTwoDigits(seconds)}`;
  const accessibleText =
    totalSeconds === 0
      ? "まもなく本日の問題を更新します。"
      : `次の問題更新まで${hours}時間${minutes}分${seconds}秒です。`;

  return {
    hours,
    minutes,
    seconds,
    text,
    accessibleText,
  };
}
