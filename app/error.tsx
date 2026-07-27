"use client";

type ErrorPageProps = Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>;

export default function ErrorPage({ reset }: ErrorPageProps) {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <section className="w-full max-w-lg rounded-[2rem] border border-white/10 bg-zinc-950/80 p-6 text-center sm:p-10">
        <p className="text-sm font-medium tracking-[0.22em] text-lime-300">UNEXPECTED ERROR</p>
        <h1 className="mt-4 text-3xl font-black sm:text-4xl">問題を読み込めませんでした</h1>
        <p className="mt-4 leading-7 text-zinc-400">
          一時的な問題が発生した可能性があります。再試行しても解決しない場合は、ページを開き直してください。
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <button type="button" className="primary-button" onClick={reset}>
            もう一度試す
          </button>
          <button
            type="button"
            className="secondary-button"
            onClick={() => window.location.assign("/")}
          >
            最初からやり直す
          </button>
        </div>
      </section>
    </main>
  );
}
