import { describe, expect, it } from "vitest";
import { DEFAULT_SITE_URL, getSiteOrigin, resolveSiteUrl } from "./site";

describe("resolveSiteUrl", () => {
  it("HTTPSのオリジンURLを採用する", () => {
    expect(resolveSiteUrl("https://example.com/").toString()).toBe("https://example.com/");
  });

  it("HTTPのローカル確認URLを採用する", () => {
    expect(getSiteOrigin("http://localhost:3000")).toBe("http://localhost:3000");
  });

  it.each([
    undefined,
    "",
    "not-a-url",
    "ftp://example.com",
    "https://user:password@example.com",
    "https://example.com/game",
    "https://example.com/?preview=1",
    "https://example.com/#result",
  ])("不正またはオリジン以外の値%jでは既定URLへ戻す", (value) => {
    expect(resolveSiteUrl(value).origin).toBe(DEFAULT_SITE_URL);
  });
});
