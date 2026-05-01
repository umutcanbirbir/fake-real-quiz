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

        {/* Hero */}
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

          {/* Game mode selector */}
          <div className="mt-10 w-full sm:max-w-3xl">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-zinc-600">
              Choose a mode
            </p>

            {/*
              Mobile  → stacked compact rows; entire Today's Test row is a tap target.
              Desktop → 3-column card grid; Today's Test gets a ring + glow.
            */}
            <div className="flex flex-col gap-2 sm:grid sm:grid-cols-3 sm:gap-5">

              {/* ── Today's Test ── full row is a link on mobile for large tap target */}
              <Link
                href="/quiz"
                className="group flex items-center gap-3 border-l-2 border-cyan-400 bg-cyan-400/[0.06] py-3 pl-3.5 pr-4 backdrop-blur transition hover:bg-cyan-400/[0.12]
                           sm:flex-col sm:items-start sm:gap-0 sm:rounded-2xl sm:border sm:border-cyan-400/35 sm:bg-cyan-400/[0.06] sm:p-5
                           sm:ring-1 sm:ring-cyan-400/20 sm:shadow-[0_0_32px_rgba(56,189,248,0.08)] sm:hover:border-cyan-300/60 sm:hover:ring-cyan-400/30"
              >
                {/* Mobile: glowing status dot */}
                <div className="h-2 w-2 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_7px_rgba(52,211,153,0.9)] sm:hidden" />

                {/* Desktop: status badge */}
                <span className="hidden sm:mb-3 sm:inline-flex w-fit rounded-full border border-emerald-400/40 bg-emerald-400/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-emerald-300">
                  Available
                </span>

                {/* Text */}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-white sm:text-base sm:font-black">
                    Today&apos;s Test
                  </p>
                  <p className="mt-0.5 truncate text-xs text-zinc-400 sm:mt-2 sm:whitespace-normal sm:text-sm sm:leading-relaxed">
                    10 quick questions. New daily challenge.
                  </p>
                </div>

                {/* Mobile: arrow indicator */}
                <span className="shrink-0 text-sm font-bold text-cyan-300 sm:hidden">→</span>

                {/* Desktop: gradient button */}
                <span className="mt-4 hidden w-full rounded-xl bg-gradient-to-r from-cyan-300 via-sky-300 to-violet-300 px-4 py-2.5 text-center text-sm font-extrabold text-zinc-950 shadow-[0_8px_28px_rgba(56,189,248,0.28)] transition group-hover:brightness-105 sm:block">
                  Start Today&apos;s Test
                </span>
              </Link>

              {/* ── Hardcore Mode ── locked */}
              <div className="flex items-center gap-3 border-l-2 border-zinc-700/60 bg-white/[0.015] py-3 pl-3.5 pr-4 opacity-50
                              sm:flex-col sm:items-start sm:gap-0 sm:rounded-2xl sm:border sm:border-white/[0.07] sm:bg-white/[0.02] sm:p-5">

                <div className="h-2 w-2 shrink-0 rounded-full bg-zinc-600 sm:hidden" />
                <span className="hidden sm:mb-3 sm:inline-flex w-fit rounded-full border border-zinc-600/40 bg-zinc-700/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  Coming Soon
                </span>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-zinc-300 sm:text-base sm:font-black">
                    Hardcore Mode
                  </p>
                  <p className="mt-0.5 truncate text-xs text-zinc-500 sm:mt-2 sm:whitespace-normal sm:text-sm sm:leading-relaxed">
                    Keep playing until your first wrong answer.
                  </p>
                </div>

                <span className="shrink-0 text-xs font-bold text-zinc-600 sm:hidden">Soon</span>

                <button
                  disabled
                  className="mt-4 hidden w-full cursor-not-allowed rounded-xl border border-white/[0.07] bg-white/[0.04] px-4 py-2.5 text-sm font-bold text-zinc-600 sm:block"
                >
                  Coming Soon
                </button>
              </div>

              {/* ── Online Mode ── locked */}
              <div className="flex items-center gap-3 border-l-2 border-zinc-700/60 bg-white/[0.015] py-3 pl-3.5 pr-4 opacity-50
                              sm:flex-col sm:items-start sm:gap-0 sm:rounded-2xl sm:border sm:border-white/[0.07] sm:bg-white/[0.02] sm:p-5">

                <div className="h-2 w-2 shrink-0 rounded-full bg-zinc-600 sm:hidden" />
                <span className="hidden sm:mb-3 sm:inline-flex w-fit rounded-full border border-zinc-600/40 bg-zinc-700/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  Coming Soon
                </span>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-zinc-300 sm:text-base sm:font-black">
                    Online Mode
                  </p>
                  <p className="mt-0.5 truncate text-xs text-zinc-500 sm:mt-2 sm:whitespace-normal sm:text-sm sm:leading-relaxed">
                    Compete live with friends in a real-time quiz room.
                  </p>
                </div>

                <span className="shrink-0 text-xs font-bold text-zinc-600 sm:hidden">Soon</span>

                <button
                  disabled
                  className="mt-4 hidden w-full cursor-not-allowed rounded-xl border border-white/[0.07] bg-white/[0.04] px-4 py-2.5 text-sm font-bold text-zinc-600 sm:block"
                >
                  Coming Soon
                </button>
              </div>

            </div>
          </div>
        </section>

        {/* Category grid */}
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

        {/* How it works */}
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

        {/* Bottom CTA */}
        <section className="rounded-3xl border border-cyan-300/20 bg-gradient-to-r from-cyan-500/10 via-sky-500/10 to-violet-500/10 p-7 text-center sm:p-10">
          <h2 className="text-3xl font-black text-white sm:text-4xl">
            Ready to test your instincts?
          </h2>
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
