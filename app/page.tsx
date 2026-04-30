import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#1b0f3f_0%,#09090b_48%,#020617_100%)] px-5 py-10">
      <section className="w-full max-w-2xl rounded-3xl border border-violet-500/30 bg-zinc-950/70 p-7 text-center shadow-[0_0_45px_rgba(124,58,237,0.25)] backdrop-blur sm:p-10">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Mind Challenge</p>
        <h1 className="mt-3 text-4xl font-black text-white sm:text-5xl">Fake or Real</h1>
        <p className="mt-5 text-base leading-relaxed text-zinc-300 sm:text-lg">
          Test your instinct with 10 tricky statements across science, history, space, and more.
          Pick <span className="font-semibold text-emerald-300">Real</span> or
          <span className="font-semibold text-rose-300"> Fake</span>, get instant feedback, and share your score.
        </p>

        <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4 text-left text-sm text-zinc-300">
          <p>• 10 hardcoded questions</p>
          <p>• Instant result + explanation per question</p>
          <p>• Mobile-first dark game UI</p>
        </div>

        <Link
          href="/quiz"
          className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-cyan-400 px-6 py-3 text-lg font-bold text-zinc-950 transition hover:bg-cyan-300 sm:w-auto"
        >
          Start Quiz
        </Link>
      </section>
    </main>
  );
}
