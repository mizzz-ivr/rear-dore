import { BRAND_COLORS } from "./brand";

type BrandIconProps = Readonly<{
  size: number;
  maskable?: boolean;
}>;

export const BRAND_IMAGE_ALT = "レアどれ？ 少数派を狙うデイリー選択ゲーム";

export function BrandIcon({ size, maskable = false }: BrandIconProps) {
  const padding = Math.round(size * (maskable ? 0.18 : 0.08));
  const markSize = size - padding * 2;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: BRAND_COLORS.background,
      }}
    >
      <div
        style={{
          width: markSize,
          height: markSize,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: Math.round(size * 0.22),
          color: BRAND_COLORS.accentDark,
          background: BRAND_COLORS.accent,
          boxShadow: `0 ${Math.max(2, Math.round(size * 0.035))}px ${Math.round(size * 0.12)}px rgba(0, 0, 0, 0.35)`,
          fontSize: Math.round(markSize * 0.62),
          fontWeight: 900,
          lineHeight: 1,
        }}
      >
        ?
      </div>
    </div>
  );
}

export function BrandSocialImage() {
  const rarityColors = [
    BRAND_COLORS.violet,
    "#fca5a5",
    "#fde047",
    BRAND_COLORS.accent,
    BRAND_COLORS.sky,
  ];

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "72px 84px",
        color: BRAND_COLORS.foreground,
        background: BRAND_COLORS.background,
      }}
    >
      <div
        style={{
          width: 690,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            alignSelf: "flex-start",
            display: "flex",
            border: `2px solid ${BRAND_COLORS.accent}`,
            borderRadius: 999,
            padding: "10px 20px",
            color: BRAND_COLORS.accent,
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: "0.18em",
          }}
        >
          DAILY MINORITY GAME
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 34,
            fontSize: 92,
            fontWeight: 900,
            letterSpacing: "-0.04em",
            lineHeight: 1,
          }}
        >
          RARE DORE?
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 26,
            color: BRAND_COLORS.muted,
            fontSize: 31,
            fontWeight: 600,
            lineHeight: 1.35,
          }}
        >
          PICK THE LEAST PICKED.
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: 42,
          }}
        >
          {rarityColors.map((color, index) => (
            <div
              key={color}
              style={{
                width: 54,
                height: 54,
                display: "flex",
                marginRight: index === rarityColors.length - 1 ? 0 : 12,
                borderRadius: 14,
                background: color,
              }}
            />
          ))}
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 22,
            color: BRAND_COLORS.muted,
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: "0.12em",
          }}
        >
          5 QUESTIONS · EVERY DAY · JST
        </div>
      </div>

      <div
        style={{
          width: 320,
          height: 320,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: `2px solid rgba(255, 255, 255, 0.1)`,
          borderRadius: 76,
          background: BRAND_COLORS.panel,
          boxShadow: "0 36px 100px rgba(0, 0, 0, 0.45)",
        }}
      >
        <div
          style={{
            width: 230,
            height: 230,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 56,
            color: BRAND_COLORS.accentDark,
            background: BRAND_COLORS.accent,
            fontSize: 150,
            fontWeight: 900,
            lineHeight: 1,
          }}
        >
          ?
        </div>
      </div>
    </div>
  );
}
