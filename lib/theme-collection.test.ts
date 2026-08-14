import { describe, expect, it } from "vitest";
import type { QuestionSet } from "./game";
import type { PlayHistoryEntry } from "./history";
import {
  calculateThemeCollectionSummary,
  restoreThemeCollection,
  serializeThemeCollection,
  synchronizeThemeCollection,
  type ThemeDiscovery,
} from "./theme-collection";

const questionSets: QuestionSet[] = [
  { id: "theme-a", title: "テーマA", questions: [] },
  { id: "theme-b", title: "テーマB", questions: [] },
  { id: "theme-c", title: "テーマC", questions: [] },
];

function historyEntry(dateKey: string, questionSetId: string): PlayHistoryEntry {
  return {
    dateKey,
    questionSetId,
    questionSetTitle: questionSetId,
    totalScore: 500,
    playerTitle: "テスト",
    rarities: ["N", "N", "N", "N", "N"],
  };
}

describe("restoreThemeCollection", () => {
  it("保存値がない場合は空配列を返す", () => {
    expect(restoreThemeCollection(null, questionSets)).toEqual([]);
  });

  it.each(["{", "[]", JSON.stringify({ version: 2, discoveries: [] })])(
    "不正な保存値を安全に無視する",
    (rawValue) => {
      expect(restoreThemeCollection(rawValue, questionSets)).toEqual([]);
    },
  );

  it("未知ID・不正日付を除外する", () => {
    const rawValue = JSON.stringify({
      version: 1,
      discoveries: [
        { questionSetId: "theme-a", discoveredOn: "2026-08-01" },
        { questionSetId: "unknown", discoveredOn: "2026-08-02" },
        { questionSetId: "theme-b", discoveredOn: "2026-02-30" },
      ],
    });

    expect(restoreThemeCollection(rawValue, questionSets)).toEqual([
      { questionSetId: "theme-a", discoveredOn: "2026-08-01" },
    ]);
  });

  it("重複テーマは最も古い初回発見日を保持する", () => {
    const rawValue = JSON.stringify({
      version: 1,
      discoveries: [
        { questionSetId: "theme-a", discoveredOn: "2026-08-10" },
        { questionSetId: "theme-a", discoveredOn: "2026-08-03" },
        { questionSetId: "theme-a", discoveredOn: "2026-08-07" },
      ],
    });

    expect(restoreThemeCollection(rawValue, questionSets)).toEqual([
      { questionSetId: "theme-a", discoveredOn: "2026-08-03" },
    ]);
  });
});

describe("synchronizeThemeCollection", () => {
  it("既存履歴からテーマをバックフィルする", () => {
    expect(
      synchronizeThemeCollection(
        [],
        [historyEntry("2026-08-02", "theme-b"), historyEntry("2026-08-01", "theme-a")],
        questionSets,
      ),
    ).toEqual([
      { questionSetId: "theme-a", discoveredOn: "2026-08-01" },
      { questionSetId: "theme-b", discoveredOn: "2026-08-02" },
    ]);
  });

  it("同じテーマを再プレイしても初回発見日は変わらない", () => {
    const existing: ThemeDiscovery[] = [
      { questionSetId: "theme-a", discoveredOn: "2026-07-20" },
    ];

    expect(
      synchronizeThemeCollection(
        existing,
        [historyEntry("2026-08-10", "theme-a")],
        questionSets,
      ),
    ).toEqual(existing);
  });

  it("履歴から消えた保存済みテーマも維持する", () => {
    const existing: ThemeDiscovery[] = [
      { questionSetId: "theme-a", discoveredOn: "2026-07-01" },
    ];

    expect(synchronizeThemeCollection(existing, [], questionSets)).toEqual(existing);
  });

  it("履歴側の方が古い場合は初回発見日を更新する", () => {
    const existing: ThemeDiscovery[] = [
      { questionSetId: "theme-b", discoveredOn: "2026-08-10" },
    ];

    expect(
      synchronizeThemeCollection(
        existing,
        [historyEntry("2026-08-04", "theme-b")],
        questionSets,
      ),
    ).toEqual([{ questionSetId: "theme-b", discoveredOn: "2026-08-04" }]);
  });
});

describe("calculateThemeCollectionSummary", () => {
  it("未発見テーマの名前を公開しない", () => {
    const summary = calculateThemeCollectionSummary(
      [{ questionSetId: "theme-a", discoveredOn: "2026-08-01" }],
      questionSets,
    );

    expect(summary.discoveredCount).toBe(1);
    expect(summary.totalCount).toBe(3);
    expect(summary.items).toEqual([
      {
        questionSetId: "theme-a",
        title: "テーマA",
        discovered: true,
        discoveredOn: "2026-08-01",
      },
      {
        questionSetId: "theme-b",
        title: null,
        discovered: false,
        discoveredOn: null,
      },
      {
        questionSetId: "theme-c",
        title: null,
        discovered: false,
        discoveredOn: null,
      },
    ]);
  });

  it("問題セット順を維持する", () => {
    const summary = calculateThemeCollectionSummary(
      [
        { questionSetId: "theme-c", discoveredOn: "2026-08-03" },
        { questionSetId: "theme-a", discoveredOn: "2026-08-01" },
      ],
      questionSets,
    );

    expect(summary.items.map((item) => item.questionSetId)).toEqual([
      "theme-a",
      "theme-b",
      "theme-c",
    ]);
  });
});

describe("serializeThemeCollection", () => {
  it("正規化した保存値を復元できる", () => {
    const discoveries: ThemeDiscovery[] = [
      { questionSetId: "theme-b", discoveredOn: "2026-08-05" },
      { questionSetId: "theme-a", discoveredOn: "2026-08-01" },
    ];

    const serialized = serializeThemeCollection(discoveries, questionSets);
    expect(restoreThemeCollection(serialized, questionSets)).toEqual([
      { questionSetId: "theme-a", discoveredOn: "2026-08-01" },
      { questionSetId: "theme-b", discoveredOn: "2026-08-05" },
    ]);
  });
});
