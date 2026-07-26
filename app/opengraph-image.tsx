import { ImageResponse } from "next/og";

export const alt = "レアどれ？ みんなが選ばなそうな答えを選べ。";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 84px",
          color: "#fafafa",
          background: "#09090b",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", color: "#bef264", fontSize: 30, letterSpacing: 8 }}>RARE DORE?</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 106, fontWeight: 900, letterSpacing: -5 }}>レアどれ？</div>
          <div style={{ display: "flex", marginTop: 28, fontSize: 36, color: "#d4d4d8" }}>みんなが選ばなそうな答えを選べ。</div>
        </div>
        <div style={{ display: "flex", fontSize: 24, color: "#a1a1aa" }}>reardore.ivrm.jp</div>
      </div>
    ),
    size,
  );
}
