import Link from "next/link";

const categories = [
  {
    title: "AI Images",
    description: "Detect uncanny details, lighting mismatches, and generated artifacts.",
  },
  {
    title: "Fake News",
    description: "Separate manipulative headlines from credible reporting.",
  },
  {
    title: "Scam Messages",
    description: "Spot urgency tactics, impersonation, and social engineering cues.",
  },
  {
    title: "Bot Comments",
    description: "Identify synthetic engagement patterns and copy-paste behavior.",
  },
  {
    title: "Fake Reviews",
    description: "Catch suspicious tone, repetition, and credibility red flags.",
  },
];

const steps = [
  "Look at the content",
  "Choose Fake or Real",
  "Learn the signals",
];

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-zinc-950 text-zinc-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.22),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(168,85,247,0.25),transparent_45%),radial-gradient(circle_at_50%_100%,rgba(236,72,153,0.16),transparent_40%)]" />
      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-14 px-5 pb-16 pt-10 sm:px-8 sm:pt-14 lg:gap-20 lg:px-10 lg:pt-16">
        <section className="flex min-h-[85vh] flex-col items-start justify-center">
          <p className="rounded-full border border-cyan-400/35 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
            Internet Survival Test
          </p>
          <h1 className="mt-6 max-w-3xl text-5xl font-black leading-[0.95] text-white sm:text-6xl lg:text-7xl">
            Can You Spot What&apos;s Fake?
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-zinc-300 sm:text-lg">
            Test your instincts against AI images, fake news, scam messages, fake reviews, and
            suspicious online content.
          </p>
          <p className="mt-4 text-sm text-zinc-400 sm:text-base">
            Sharpen your digital judgment with a fast, daily challenge built for the modern web.
          </p>
          <div className="mt-10 grid w-full gap-4 lg:grid-cols-3">
            <article className="relative flex min-h-[250px] flex-col rounded-2xl border border-cyan-300/55 bg-cyan-300/[0.08] p-5 shadow-[0_18px_60px_rgba(56,189,248,0.2)] backdrop-blur">
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full border border-cyan-200/50 bg-cyan-300/15 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-cyan-100">
                  Available
                </span>
                <span className="h-2.5 w-2.5 rounded-full bg-cyan-200 shadow-[0_0_18px_rgba(103,232,249,0.9)]" />
              </div>
              <h2 className="mt-5 text-2xl font-black text-white">Today&rsquo;s Test</h2>
              <p className="mt-3 text-sm leading-relaxed text-zinc-300">
                10 quick questions. New daily challenge.
              </p>
              <Link
                href="/quiz"
                className="mt-auto inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-cyan-300 via-sky-300 to-violet-300 px-5 py-3 text-sm font-extrabold text-zinc-950 shadow-[0_10px_35px_rgba(56,189,248,0.35)] transition hover:scale-[1.01] hover:brightness-105"
              >
                Start Today&rsquo;s Test
              </Link>
            </article>

            <article className="flex min-h-[250px] flex-col rounded-2xl border border-white/10 bg-white/[0.045] p-5 opacity-80 backdrop-blur">
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full border border-violet-200/25 bg-violet-300/10 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-violet-100">
                  Coming Soon
                </span>
                <span className="rounded-full border border-white/10 px-2 py-1 text-xs font-semibold text-zinc-500">
                  Locked
                </span>
              </div>
              <h2 className="mt-5 text-2xl font-black text-zinc-100">Hardcore Mode</h2>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                Keep playing until your first wrong answer.
              </p>
              <button
                type="button"
                disabled
                className="mt-auto inline-flex cursor-not-allowed items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-extrabold text-zinc-500"
              >
                Coming Soon
              </button>
            </article>

            <article className="flex min-h-[250px] flex-col rounded-2xl border border-white/10 bg-white/[0.045] p-5 opacity-80 backdrop-blur">
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full border border-fuchsia-200/25 bg-fuchsia-300/10 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-fuchsia-100">
                  Coming Soon
                </span>
                <span className="rounded-full border border-white/10 px-2 py-1 text-xs font-semibold text-zinc-500">
                  Locked
                </span>
              </div>
              <h2 className="mt-5 text-2xl font-black text-zinc-100">Online Mode</h2>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                Play live with friends in a Kahoot-style room.
              </p>
              <button
                type="button"
                disabled
                className="mt-auto inline-flex cursor-not-allowed items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-extrabold text-zinc-500"
              >
                Coming Soon
              </button>
            </article>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map((category) => (
            <article
              key={category.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur transition hover:border-cyan-300/40 hover:bg-white/10"
            >
              <h2 className="text-sm font-bold uppercase tracking-wide text-cyan-200">
                {category.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-zinc-300">{category.description}</p>
            </article>
          ))}
        </section>

        <section className="rounded-3xl border border-white/10 bg-zinc-900/70 p-6 sm:p-8">
          <h2 className="text-2xl font-black text-white sm:text-3xl">How it works</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-200">
                  Step {index + 1}
                </p>
                <p className="mt-3 text-base font-semibold text-zinc-100">{step}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-cyan-300/20 bg-gradient-to-r from-cyan-500/10 via-sky-500/10 to-violet-500/10 p-7 text-center sm:p-10">
          <h2 className="text-3xl font-black text-white sm:text-4xl">Ready to challenge your feed instincts?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-zinc-300 sm:text-base">
            Build the habit of spotting deception before it spreads.
          </p>
          <Link
            href="/quiz"
            className="mt-7 inline-flex items-center justify-center rounded-xl bg-white px-7 py-3 text-base font-extrabold text-zinc-950 transition hover:bg-zinc-200"
          >
            Start Today&apos;s Test
          </Link>
        </section>
      </div>
    </main>
  );
}
