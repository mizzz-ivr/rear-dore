import { describe, expect, it } from "vitest";
import type { QuestionSet } from "./game";
import type { PlayHistoryEntry } from "./history";
import {
  calculateNewlyUnlockedThemeCollectionBadges,
  calculateThemeCollectionBadges,
  calculateThemeCollectionSummary,
  getNewlyDiscoveredTheme,
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

const tenQuestionSets: QuestionSet[] = Array.from({ length: 10 }, (_, index) => ({
  id: `theme-${index + 1}`,
  title: `テーマ${index + 1}`,
  questions: [],
}));

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

function discoveries(count: number): ThemeDiscovery[] {
  return Array.from({ length: count }, (_, index) => ({
    questionSetId: `theme-${index + 1}`,
    discoveredOn: `2026-08-${String(index + 1).padStart(2, "0")}`,
  }));
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

describe("getNewlyDiscoveredTheme", () => {
  it("現在のテーマが初めて追加された場合だけ発見情報を返す", () => {
    expect(
      getNewlyDiscoveredTheme(
        [{ questionSetId: "theme-a", discoveredOn: "2026-08-01" }],
        [
          { questionSetId: "theme-a", discoveredOn: "2026-08-01" },
          { questionSetId: "theme-b", discoveredOn: "2026-08-02" },
        ],
        "theme-b",
        questionSets,
      ),
    ).toEqual({
      questionSetId: "theme-b",
      title: "テーマB",
      discovered: true,
      discoveredOn: "2026-08-02",
    });
  });

  it("再プレイ済みテーマは新規発見扱いにしない", () => {
    const existing = [{ questionSetId: "theme-a", discoveredOn: "2026-08-01" }];

    expect(getNewlyDiscoveredTheme(existing, existing, "theme-a", questionSets)).toBeNull();
  });

  it("別テーマのバックフィルを現在テーマの新規発見と誤判定しない", () => {
    expect(
      getNewlyDiscoveredTheme(
        [],
        [{ questionSetId: "theme-a", discoveredOn: "2026-08-01" }],
        "theme-b",
        questionSets,
      ),
    ).toBeNull();
  });
});

describe("calculateThemeCollectionBadges", () => {
  it("3・5・10テーマの達成状態を現在の発見数から再計算する", () => {
    expect(
      calculateThemeCollectionBadges(discoveries(5), tenQuestionSets).map((badge) => ({
        id: badge.id,
        current: badge.current,
        target: badge.target,
        unlocked: badge.unlocked,
      })),
    ).toEqual([
      { id: "discover-3", current: 5, target: 3, unlocked: true },
      { id: "discover-5", current: 5, target: 5, unlocked: true },
      { id: "discover-10", current: 5, target: 10, unlocked: false },
    ]);
  });

  it("存在しない到達目標のバッジは表示しない", () => {
    expect(calculateThemeCollectionBadges([], questionSets).map((badge) => badge.id)).toEqual([
      "discover-3",
    ]);
  });

  it("今回新たに到達したバッジだけ返す", () => {
    expect(
      calculateNewlyUnlockedThemeCollectionBadges(
        discoveries(4),
        discoveries(5),
        tenQuestionSets,
      ).map((badge) => badge.id),
    ).toEqual(["discover-5"]);
  });

  it("すでに解除済みのバッジは再通知しない", () => {
    expect(
      calculateNewlyUnlockedThemeCollectionBadges(
        discoveries(5),
        discoveries(6),
        tenQuestionSets,
      ),
    ).toEqual([]);
  });
});

describe("serializeThemeCollection", () => {
  it("正規化した保存値を復元できる", () => {
    const collection: ThemeDiscovery[] = [
      { questionSetId: "theme-b", discoveredOn: "2026-08-05" },
      { questionSetId: "theme-a", discoveredOn: "2026-08-01" },
    ];

    const serialized = serializeThemeCollection(collection, questionSets);
    expect(restoreThemeCollection(serialized, questionSets)).toEqual([
      { questionSetId: "theme-a", discoveredOn: "2026-08-01" },
      { questionSetId: "theme-b", discoveredOn: "2026-08-05" },
    ]);
  });
});
