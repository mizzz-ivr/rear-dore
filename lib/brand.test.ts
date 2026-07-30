import { describe, expect, it } from "vitest";
import manifest from "../app/manifest";
import {
  buildPwaIconPath,
  parsePwaIconSize,
  PWA_ICON_SIZES,
} from "./brand";

describe("parsePwaIconSize", () => {
  it.each([
    ["192", 192],
    ["512", 512],
  ] as const)("対応サイズ%sを受け付ける", (value, expected) => {
    expect(parsePwaIconSize(value)).toBe(expected);
  });

  it.each(["", "0", "191", "256", "513", "abc", "192px", "192.0"]) (
    "未対応の値%sを拒否する",
    (value) => {
      expect(parsePwaIconSize(value)).toBeNull();
    },
  );
});

describe("buildPwaIconPath", () => {
  it("対応サイズから安定した画像URLを生成する", () => {
    expect(PWA_ICON_SIZES.map(buildPwaIconPath)).toEqual([
      "/pwa-icon/192",
      "/pwa-icon/512",
    ]);
  });
});

describe("manifest", () => {
  it("PWA用192pxと512pxアイコンを登録する", () => {
    expect(manifest().icons).toEqual([
      {
        src: "/pwa-icon/192",
        sizes: "192x192",
        type: "image/png",
        purpose: "any maskable",
      },
      {
        src: "/pwa-icon/512",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable",
      },
    ]);
  });
});
