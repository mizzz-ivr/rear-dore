"use client";

type GlobalErrorPageProps = Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>;

export default function GlobalErrorPage({ reset }: GlobalErrorPageProps) {
  const buttonStyle = {
    minHeight: "3.5rem",
    borderRadius: "1rem",
    padding: "0.9rem 1.25rem",
    fontWeight: 800,
    cursor: "pointer",
  } as const;

  return (
    <html lang="ja">
      <head>
        <title>エラー | レアどれ？</title>
      </head>
      <body
        style={{
          minWidth: 320,
          minHeight: "100vh",
          margin: 0,
          color: "#fafafa",
          background: "#09090b",
          fontFamily: 'Arial, "Hiragino Kaku Gothic ProN", "Yu Gothic", Meiryo, sans-serif',
        }}
      >
        <main
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2.5rem 1rem",
          }}
        >
          <section
            style={{
              width: "100%",
              maxWidth: "32rem",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "2rem",
              padding: "2rem",
              textAlign: "center",
              background: "rgba(24, 24, 27, 0.92)",
            }}
          >
            <p style={{ margin: 0, color: "#bef264", fontSize: "0.875rem", letterSpacing: "0.18em" }}>
              SYSTEM ERROR
            </p>
            <h1 style={{ margin: "1rem 0 0", fontSize: "2rem", lineHeight: 1.25 }}>
              ページを表示できませんでした
            </h1>
            <p style={{ margin: "1rem 0 0", color: "#a1a1aa", lineHeight: 1.75 }}>
              再試行しても解決しない場合は、トップページからもう一度始めてください。
            </p>

            <div style={{ display: "grid", gap: "0.75rem", marginTop: "2rem" }}>
              <button
                type="button"
                onClick={reset}
                style={{ ...buttonStyle, border: "1px solid #bef264", color: "#18181b", background: "#bef264" }}
              >
                もう一度試す
              </button>
              <a
                href="/"
                style={{
                  ...buttonStyle,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid rgba(255, 255, 255, 0.14)",
                  color: "#fafafa",
                  background: "rgba(255, 255, 255, 0.05)",
                  textDecoration: "none",
                }}
              >
                トップページへ戻る
              </a>
            </div>
          </section>
        </main>
      </body>
    </html>
  );
}
