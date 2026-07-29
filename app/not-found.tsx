import Link from "next/link";

export default function NotFound() {
  return (
    <main
      id="main-content"
      className="flex min-h-screen items-center justify-center px-4 py-10"
      tabIndex={-1}
    >
      <section className="w-full max-w-lg text-center">
        <p className="text-sm font-medium tracking-[0.22em] text-lime-300">404</p>
        <h1 className="mt-4 text-4xl font-black">その選択肢は見つかりません</h1>
        <p className="mt-4 leading-7 text-zinc-400">URLが変更されたか、ページが削除された可能性があります。</p>
        <Link href="/" className="primary-button mt-8 inline-flex items-center justify-center">
          今日の問題へ戻る
        </Link>
      </section>
    </main>
  );
}
