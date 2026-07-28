import { describe, expect, it } from "vitest";
import type { Rarity } from "./game";
import {
  appendShareUrl,
  buildRarityGrid,
  buildShareText,
  buildXShareUrl,
  getRaritySymbol,
} from "./share";

const rarities: Rarity[] = ["UR", "SSR", "SR", "R", "N", "多数派"];

describe("getRaritySymbol", () => {
  it.each([
    ["UR", "🟪"],
    ["SSR", "🟥"],
    ["SR", "🟨"],
    ["R", "🟩"],
    ["N", "🟦"],
    ["多数派", "⬜"],
  ] as const)("%sを%sへ変換する", (rarity, symbol) => {
    expect(getRaritySymbol(rarity)).toBe(symbol);
  });
});

describe("buildRarityGrid", () => {
  it("回答順を維持してレア度グリッドを生成する", () => {
    expect(buildRarityGrid(rarities.map((rarity) => ({ rarity })))).toBe("🟪🟥🟨🟩🟦⬜");
  });
});

describe("buildShareText", () => {
  it("ネタバレを含まない共有文面を生成する", () => {
    const text = buildShareText({
      dateKey: "2026-07-28",
      questionSetTitle: "もしも編",
      totalScore: 1975,
      playerTitle: "人類の裏を読む者",
      answers: rarities.slice(0, 5).map((rarity) => ({ rarity })),
    });

    expect(text).toBe(
      [
        "レアどれ？ 2026-07-28",
        "「もしも編」",
        "🟪🟥🟨🟩🟦",
        "1,975点｜人類の裏を読む者",
        "#レアどれ",
      ].join("\n"),
    );
    expect(text).not.toContain("透明人間");
    expect(text).not.toContain("有名人を見に行く");
  });

  it.each([
    ["不正な日付", { dateKey: "2026/07/28" }],
    ["空の問題セット名", { questionSetTitle: "" }],
    ["負の点数", { totalScore: -1 }],
    ["小数の点数", { totalScore: 1.5 }],
    ["空の称号", { playerTitle: "" }],
    ["空の回答", { answers: [] }],
  ])("%sを拒否する", (_label, override) => {
    expect(() =>
      buildShareText({
        dateKey: "2026-07-28",
        questionSetTitle: "もしも編",
        totalScore: 1000,
        playerTitle: "逆張りの探索者",
        answers: [{ rarity: "UR" }],
        ...override,
      }),
    ).toThrow(RangeError);
  });
});

describe("appendShareUrl", () => {
  it("共有文面の末尾へ正規化したURLを追加する", () => {
    expect(appendShareUrl("共有文面", "https://reardore.ivrm.jp")).toBe(
      "共有文面\nhttps://reardore.ivrm.jp/",
    );
  });

  it("不正なURLを拒否する", () => {
    expect(() => appendShareUrl("共有文面", "not-a-url")).toThrow(TypeError);
  });
});

describe("buildXShareUrl", () => {
  it("文面をURLエンコードしたX共有URLを生成する", () => {
    const url = buildXShareUrl("レアどれ？\nhttps://reardore.ivrm.jp/");
    expect(url).toBe(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent("レアどれ？\nhttps://reardore.ivrm.jp/")}`,
    );
  });
});
