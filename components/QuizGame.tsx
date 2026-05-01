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

function getContentTypeLabel(question: QuizQuestion) {
  if (question.question_type === "image") return "AI Image";
  if (question.question_type === "news") return "News Check";
  return "Text Check";
}

export default function QuizGame({ questions }: { questions: QuizQuestion[] }) {
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
        <h2 className="mt-3 text-2xl font-bold text-zinc-100">No published questions yet.</h2>
        <p className="mt-2 text-zinc-400">We are preparing the next Internet Survival Test batch. Please check back soon.</p>
        <Link href="/" className="mt-6 inline-flex rounded-xl border border-zinc-600 px-4 py-2 text-sm font-semibold text-zinc-100 transition hover:border-violet-300 hover:text-violet-200">
          Back Home
        </Link>
      </section>
    );
  }

  const isFinished = currentIndex >= questionCount;

  if (isFinished) {
    const performanceLabel = getPerformanceLabel(correctCount);
    const shareText = `I scored ${correctCount}/10 on the Internet Survival Test. Can you beat me?`;

    return (
      <section className="w-full max-w-3xl rounded-3xl border border-cyan-400/30 bg-zinc-900/80 p-6 shadow-2xl shadow-cyan-950/30 backdrop-blur sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-300/80">Final Result</p>
        <h2 className="mt-3 text-4xl font-black text-zinc-100 sm:text-5xl">{correctCount}/{questionCount}</h2>
        <p className="mt-2 text-xl font-semibold text-zinc-300">{scorePercent}% · {performanceLabel}</p>

        <div className="mt-7 grid gap-3 sm:grid-cols-3">
          <button
            onClick={async () => {
              await navigator.clipboard.writeText(shareText);
              setCopied(true);
              setTimeout(() => setCopied(false), 1600);
            }}
            className="rounded-xl border border-cyan-300/60 bg-cyan-400/90 px-4 py-3 font-bold text-zinc-950 transition hover:bg-cyan-300"
          >
            {copied ? "Copied!" : "Copy Share Text"}
          </button>
          <button
            onClick={() => {
              setCurrentIndex(0);
              setSelectedAnswer(null);
              setCorrectCount(0);
              setCopied(false);
            }}
            className="rounded-xl border border-violet-300/50 bg-violet-500/90 px-4 py-3 font-bold text-white transition hover:bg-violet-400"
          >
            Play Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl border border-zinc-600 bg-zinc-800/80 px-4 py-3 font-bold text-zinc-100 transition hover:border-zinc-500 hover:bg-zinc-700"
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
    if (currentQuestion.question_type === "image" && currentQuestion.image_url) {
      return (
        <div className="rounded-2xl border border-zinc-700/70 bg-zinc-950/40 p-3 sm:p-4">
          <p className="mb-3 text-sm text-zinc-300">{currentQuestion.content}</p>
          <Image
            src={currentQuestion.image_url}
            alt="Quiz prompt"
            width={1200}
            height={800}
            className="h-auto w-full rounded-2xl border border-zinc-700/80 object-cover shadow-lg shadow-black/35"
            priority
          />
        </div>
      );
    }

    if (currentQuestion.question_type === "news") {
      return (
        <article className="rounded-2xl border border-zinc-700/80 bg-zinc-950/40 p-4 sm:p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">{currentQuestion.source_name ?? "Unknown Source"}</p>
          <h3 className="mt-2 text-lg font-bold leading-snug text-zinc-100">{currentQuestion.headline ?? currentQuestion.content}</h3>
          <p className="mt-3 text-zinc-300">{currentQuestion.excerpt ?? currentQuestion.content}</p>
        </article>
      );
    }

    return (
      <div className="rounded-2xl border border-zinc-700/80 bg-zinc-950/40 p-5 sm:p-6">
        <p className="text-lg leading-relaxed text-zinc-100">{currentQuestion.content}</p>
      </div>
    );
  };

  return (
    <section className="w-full max-w-3xl rounded-3xl border border-violet-400/20 bg-zinc-900/80 p-4 shadow-2xl shadow-black/40 backdrop-blur sm:p-6">
      <div className="rounded-2xl border border-zinc-700/70 bg-zinc-950/50 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-violet-300/60 bg-violet-400/20 px-3 py-1 text-xs font-bold uppercase tracking-wide text-violet-200">{currentQuestion.category}</span>
          <span className="rounded-full border border-zinc-500/80 bg-zinc-800/90 px-3 py-1 text-xs font-bold uppercase tracking-wide text-zinc-200">{getContentTypeLabel(currentQuestion)}</span>
        </div>
        <div className="mt-4 flex items-center justify-between text-sm text-zinc-300">
          <span className="font-semibold">Question {currentIndex + 1}/{questionCount}</span>
          <span>{progressPercent}% Complete</span>
        </div>
        <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-zinc-800">
          <div className="h-full rounded-full bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-300 transition-all duration-500" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      <div className="mt-5">{renderQuestionCard()}</div>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
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
              className={`min-h-14 rounded-2xl border px-5 py-4 text-base font-extrabold uppercase tracking-wide transition-all duration-200 sm:min-h-16 ${resolvedState} ${!selectedAnswer ? "hover:-translate-y-0.5" : ""}`}
            >
              {choice}
            </button>
          );
        })}
      </div>

      {selectedAnswer && (
        <div className={`mt-5 rounded-2xl border p-4 ${isCorrect ? "border-emerald-300/60 bg-emerald-500/10" : "border-rose-300/60 bg-rose-500/10"}`}>
          <p className={`text-sm font-bold uppercase tracking-[0.15em] ${isCorrect ? "text-emerald-300" : "text-rose-300"}`}>
            {isCorrect ? "Correct" : "Wrong"}
          </p>
          <p className="mt-3 text-zinc-100">{currentQuestion.explanation}</p>
          <button onClick={handleNext} className="mt-4 rounded-xl bg-violet-500 px-4 py-2.5 font-semibold text-white transition hover:bg-violet-400">
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
