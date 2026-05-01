"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { QuizAnswer, QuizQuestion } from "@/lib/types";

const answerStyles: Record<QuizAnswer, string> = {
  real: "border-emerald-400/60 bg-emerald-500/15 text-emerald-200 hover:border-emerald-300 hover:bg-emerald-500/25",
  fake: "border-rose-400/60 bg-rose-500/15 text-rose-200 hover:border-rose-300 hover:bg-rose-500/25",
};

function getPerformanceLabel(score: number) {
  if (score <= 3) return "Easy to Fool";
  if (score <= 6) return "Getting Sharper";
  if (score <= 8) return "Sharp Eye";
  return "Internet Survivor";
}

function getPerformanceDescription(score: number) {
  if (score <= 3) return "Scams and fake content can sneak through quickly. Slow down and inspect details before trusting what you see.";
  if (score <= 6) return "You are building stronger instincts. Keep checking sources and visual clues to level up your online judgment.";
  if (score <= 8) return "Strong pattern recognition. You consistently catch deceptive signals across images, headlines, and messages.";
  return "Elite detection mode. You spot manipulation fast and verify before sharing. That is true internet survival behavior.";
}

function getContentTypeLabel(question: QuizQuestion) {
  if (question.question_type === "image") return "AI Image";
  if (question.question_type === "news") return "News Check";
  return "Text Check";
}

function getQuestionImageAlt(question: QuizQuestion) {
  if (question.question_type === "news") {
    return question.headline
      ? `News question image: ${question.headline}`
      : "News question image";
  }

  if (question.question_type === "image") {
    return question.content
      ? `Image question prompt: ${question.content}`
      : "Image question prompt";
  }

  return question.content
    ? `Question reference image: ${question.content}`
    : "Question reference image";
}

export default function QuizGame({ questions }: { questions: QuizQuestion[] }) {
  const [hasStarted, setHasStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<QuizAnswer | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [copied, setCopied] = useState(false);

  const questionCount = questions.length;
  const scorePercent = useMemo(
    () => Math.round((correctCount / Math.max(questionCount, 1)) * 100),
    [correctCount, questionCount],
  );

  if (!questionCount) {
    return (
      <section className="w-full max-w-3xl rounded-3xl border border-zinc-700/80 bg-zinc-900/70 p-8 text-zinc-200 shadow-2xl shadow-black/30 backdrop-blur">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-400">No Active Quiz</p>
        <h2 className="mt-3 text-2xl font-bold text-zinc-100">Today&apos;s test is not ready yet.</h2>
        <p className="mt-2 text-zinc-400">Come back soon for the next Internet Survival Test challenge.</p>
        <Link href="/" className="mt-6 inline-flex min-h-12 items-center rounded-xl border border-zinc-600 px-5 py-2 text-sm font-semibold text-zinc-100 transition hover:border-violet-300 hover:text-violet-200">
          Back Home
        </Link>
      </section>
    );
  }

  if (!hasStarted) {
    return (
      <section className="w-full max-w-3xl rounded-3xl border border-violet-400/25 bg-zinc-900/80 p-5 shadow-2xl shadow-black/45 backdrop-blur sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-300/80">Internet Survival Test</p>
        <h1 className="mt-3 text-3xl font-black text-zinc-100 sm:text-4xl">Today&apos;s Internet Survival Test</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-300 sm:text-base">
          10 quick questions. AI images, fake news, scam messages, and suspicious online content.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            "No account needed",
            "Instant feedback",
            "Learn the signals",
          ].map((stat) => (
            <div key={stat} className="rounded-2xl border border-zinc-700/70 bg-zinc-950/40 p-4 text-sm font-semibold text-zinc-100">
              {stat}
            </div>
          ))}
        </div>

        <button
          onClick={() => setHasStarted(true)}
          className="mt-7 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-gradient-to-r from-cyan-300 via-sky-300 to-violet-300 px-6 py-3 text-base font-extrabold text-zinc-950 shadow-[0_10px_35px_rgba(56,189,248,0.28)] transition hover:brightness-105 sm:w-auto"
        >
          Start Test
        </button>
      </section>
    );
  }

  const isFinished = currentIndex >= questionCount;

  if (isFinished) {
    const performanceLabel = getPerformanceLabel(correctCount);
    const performanceDescription = getPerformanceDescription(correctCount);
    const shareText = `I scored ${correctCount}/10 on the Internet Survival Test. Can you beat me? https://fake-real-quiz.vercel.app/`;

    return (
      <section className="w-full max-w-3xl rounded-3xl border border-cyan-400/30 bg-zinc-900/80 p-6 shadow-2xl shadow-cyan-950/30 backdrop-blur sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-300/80">Final Result</p>
        <h2 className="mt-3 text-4xl font-black text-zinc-100 sm:text-5xl">Score {correctCount}/{questionCount}</h2>
        <p className="mt-2 text-xl font-semibold text-zinc-300">{scorePercent}% · {performanceLabel}</p>
        <p className="mt-4 rounded-2xl border border-zinc-700/80 bg-zinc-950/50 p-4 text-sm leading-relaxed text-zinc-300 sm:text-base">
          {performanceDescription}
        </p>

        <div className="mt-7 grid gap-3 sm:grid-cols-3">
          <button
            onClick={async () => {
              await navigator.clipboard.writeText(shareText);
              setCopied(true);
              setTimeout(() => setCopied(false), 1600);
            }}
            className="min-h-12 rounded-xl border border-cyan-300/60 bg-cyan-400/90 px-4 py-3 font-bold text-zinc-950 transition hover:bg-cyan-300"
          >
            {copied ? "Copied!" : "Copy Share Text"}
          </button>
          <button
            onClick={() => {
              setHasStarted(false);
              setCurrentIndex(0);
              setSelectedAnswer(null);
              setCorrectCount(0);
              setCopied(false);
            }}
            className="min-h-12 rounded-xl border border-violet-300/50 bg-violet-500/90 px-4 py-3 font-bold text-white transition hover:bg-violet-400"
          >
            Play Again
          </button>
          <Link
            href="/"
            className="inline-flex min-h-12 items-center justify-center rounded-xl border border-zinc-600 bg-zinc-800/80 px-4 py-3 font-bold text-zinc-100 transition hover:border-zinc-500 hover:bg-zinc-700"
          >
            Back Home
          </Link>
        </div>
      </section>
    );
  }

  const currentQuestion = questions[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / questionCount) * 100);
  const isCorrect = selectedAnswer === currentQuestion.answer;

  const renderQuestionCard = () => {
    if (currentQuestion.question_type === "image") {
      return (
        <div className="rounded-2xl border border-zinc-700/70 bg-zinc-950/45 p-3 sm:p-4">
          <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400 sm:text-xs">Inspect carefully</p>
          {currentQuestion.image_url ? (
            <Image
              src={currentQuestion.image_url}
              alt={getQuestionImageAlt(currentQuestion)}
              width={1200}
              height={800}
              className="h-[220px] w-full rounded-2xl border border-zinc-700/80 object-cover shadow-xl shadow-black/40 md:h-[280px] lg:h-[320px]"
              priority
            />
          ) : null}
          <p className="mt-2 text-sm leading-snug text-zinc-300">{currentQuestion.content}</p>
        </div>
      );
    }

    if (currentQuestion.question_type === "news") {
      return (
        <article className="overflow-hidden rounded-2xl border border-zinc-700/80 bg-zinc-950/50">
          {currentQuestion.image_url ? (
            <Image
              src={currentQuestion.image_url}
              alt={getQuestionImageAlt(currentQuestion)}
              width={1200}
              height={700}
              className="h-[220px] w-full border-b border-zinc-700/80 object-cover md:h-[280px] lg:h-[320px]"
            />
          ) : null}
          <div className="p-3 sm:p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500 sm:text-xs">{currentQuestion.source_name ?? "Unknown Source"}</p>
            <h3 className="mt-1.5 line-clamp-2 text-base font-bold leading-snug text-zinc-100 sm:text-lg">{currentQuestion.headline ?? currentQuestion.content}</h3>
            <p className="mt-2 line-clamp-3 text-sm leading-snug text-zinc-300 sm:leading-relaxed">{currentQuestion.excerpt ?? currentQuestion.content}</p>
          </div>
        </article>
      );
    }

    return (
      <div className="rounded-2xl border border-zinc-700/80 bg-zinc-950/45 p-3.5 sm:p-4">
        {currentQuestion.image_url ? (
          <Image
            src={currentQuestion.image_url}
            alt={getQuestionImageAlt(currentQuestion)}
            width={1200}
            height={700}
            className="mb-3 h-[180px] w-full rounded-2xl border border-zinc-700/80 object-cover shadow-lg shadow-black/35 sm:h-[200px] md:h-[220px]"
          />
        ) : null}
        <p className="text-sm leading-relaxed text-zinc-100 sm:text-base">{currentQuestion.content}</p>
      </div>
    );
  };

    return (
      <section className="w-full max-w-3xl overflow-hidden rounded-3xl border border-violet-400/20 bg-zinc-900/80 p-3 shadow-2xl shadow-black/40 backdrop-blur sm:p-4">
      <div className="rounded-2xl border border-zinc-700/70 bg-zinc-950/50 p-3 sm:p-3.5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-violet-300/60 bg-violet-400/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-violet-200 sm:text-xs">{currentQuestion.category}</span>
          <span className="rounded-full border border-zinc-500/80 bg-zinc-800/90 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-zinc-200 sm:text-xs">{getContentTypeLabel(currentQuestion)}</span>
        </div>
        <div className="mt-2.5 flex items-center justify-between text-xs text-zinc-300 sm:text-sm">
          <span className="font-semibold">Question {currentIndex + 1}/{questionCount}</span>
          <span>{progressPercent}% Complete</span>
        </div>
        <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-zinc-800">
          <div className="h-full rounded-full bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-300 transition-all duration-500" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      <div className="mt-3">{renderQuestionCard()}</div>

      <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {(["real", "fake"] as const).map((choice) => {
          const isSelected = selectedAnswer === choice;
          const isAnswer = currentQuestion.answer === choice;
          const resolvedState = selectedAnswer
            ? isAnswer
              ? "border-emerald-300 bg-emerald-500/25 text-emerald-100"
              : isSelected
                ? "border-rose-300 bg-rose-500/20 text-rose-100"
                : "border-zinc-700 bg-zinc-900 text-zinc-500"
            : answerStyles[choice];

          return (
            <button
              key={choice}
              onClick={() => handleAnswer(choice)}
              disabled={Boolean(selectedAnswer)}
              className={`min-h-12 rounded-2xl border px-4 py-3 text-sm font-extrabold uppercase tracking-wide transition-all duration-200 sm:min-h-14 sm:text-base ${resolvedState} ${!selectedAnswer ? "hover:-translate-y-0.5" : ""}`}
            >
              {choice}
            </button>
          );
        })}
      </div>

      {selectedAnswer && (
        <div className={`mt-3 rounded-2xl border p-3 sm:p-4 ${isCorrect ? "border-emerald-300/60 bg-emerald-500/10" : "border-rose-300/60 bg-rose-500/10"}`}>
          <p className={`text-sm font-bold uppercase tracking-[0.15em] ${isCorrect ? "text-emerald-300" : "text-rose-300"}`}>
            {isCorrect ? "Correct" : "Wrong"}
          </p>
          <p className="mt-2 text-sm text-zinc-300">Correct answer: <span className="font-bold uppercase text-zinc-100">{currentQuestion.answer}</span></p>
          <p className="mt-2 text-sm text-zinc-100 sm:text-base">{currentQuestion.explanation}</p>
          <button onClick={handleNext} className="mt-3 min-h-10 rounded-xl bg-violet-500 px-4 py-2 font-semibold text-white transition hover:bg-violet-400">
            {currentIndex === questionCount - 1 ? "See Results" : "Next"}
          </button>
        </div>
      )}
    </section>
  );

  function handleAnswer(answer: QuizAnswer) {
    if (selectedAnswer) return;
    setSelectedAnswer(answer);
    if (answer === currentQuestion.answer) setCorrectCount((prev) => prev + 1);
  }

  function handleNext() {
    if (!selectedAnswer) return;
    setCurrentIndex((prev) => prev + 1);
    setSelectedAnswer(null);
  }
}
