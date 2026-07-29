export default function LoadingPage() {
  return (
    <main
      id="main-content"
      className="min-h-screen px-4 py-6 sm:px-6 sm:py-10"
      aria-busy="true"
      tabIndex={-1}
    >
      <section className="mx-auto flex w-full max-w-2xl flex-col gap-6" role="status" aria-live="polite">
        <span className="sr-only">問題を読み込んでいます</span>

        <header className="flex items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="h-3 w-24 animate-pulse rounded-full bg-lime-300/20 motion-reduce:animate-none" />
            <div className="h-8 w-36 animate-pulse rounded-xl bg-white/10 motion-reduce:animate-none" />
          </div>
          <div className="h-10 w-20 animate-pulse rounded-full bg-white/8 motion-reduce:animate-none" />
        </header>

        <div className="h-2 animate-pulse rounded-full bg-white/8 motion-reduce:animate-none" />

        <article className="rounded-[2rem] border border-white/10 bg-zinc-950/75 p-5 sm:p-8">
          <div className="h-5 w-56 animate-pulse rounded-lg bg-white/8 motion-reduce:animate-none" />
          <div className="mt-4 h-10 w-full animate-pulse rounded-xl bg-white/10 motion-reduce:animate-none" />
          <div className="mt-3 h-10 w-4/5 animate-pulse rounded-xl bg-white/10 motion-reduce:animate-none" />

          <div className="mt-7 space-y-3">
            {Array.from({ length: 5 }, (_, index) => (
              <div
                key={index}
                className="h-[4.5rem] animate-pulse rounded-[1.25rem] border border-white/10 bg-white/[0.035] motion-reduce:animate-none"
              />
            ))}
          </div>

          <div className="mt-6 h-14 animate-pulse rounded-2xl bg-lime-300/20 motion-reduce:animate-none" />
        </article>
      </section>
    </main>
  );
}
