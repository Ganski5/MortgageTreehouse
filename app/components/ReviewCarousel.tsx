"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface Review {
  name: string;
  role: string;
  company: string;
  rating: number;
  body: string;
}

export function ReviewCarousel({ reviews }: { reviews: Review[] }) {
  const [idx, setIdx]     = useState(0);
  const [paused, setPaused] = useState(false);
  const [animDir, setAnimDir] = useState<"left" | "right">("left");
  const [visible, setVisible] = useState(true);

  const go = useCallback(
    (next: number, dir: "left" | "right") => {
      setAnimDir(dir);
      setVisible(false);
      setTimeout(() => {
        setIdx((next + reviews.length) % reviews.length);
        setVisible(true);
      }, 200);
    },
    [reviews.length],
  );

  const advance = useCallback(() => go(idx + 1, "left"), [go, idx]);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(advance, 5000);
    return () => clearInterval(id);
  }, [paused, advance]);

  const review = reviews[idx];

  return (
    <div
      className="flex flex-col gap-8"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Card */}
      <div
        className="relative bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm p-8 flex flex-col gap-6 transition-all duration-200"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible
            ? "translateY(0)"
            : animDir === "left"
            ? "translateY(8px)"
            : "translateY(-8px)",
          transition: "opacity 200ms ease, transform 200ms ease",
        }}
      >
        {/* Stars */}
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, s) => (
            <span
              key={s}
              className={`text-xl ${s < review.rating ? "text-amber-400" : "text-zinc-200 dark:text-zinc-700"}`}
            >
              ★
            </span>
          ))}
        </div>

        {/* Quote */}
        <blockquote className="text-zinc-700 dark:text-zinc-300 text-lg leading-relaxed">
          &ldquo;{review.body}&rdquo;
        </blockquote>

        {/* Reviewer */}
        <div className="flex items-center gap-4 pt-2 border-t border-zinc-100 dark:border-zinc-800">
          <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-bold text-sm flex-shrink-0">
            {review.name[0]}
          </div>
          <div>
            <p className="font-semibold text-zinc-900 dark:text-white text-sm">{review.name}</p>
            <p className="text-xs text-zinc-400">{review.role} · {review.company}</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        {/* Dots */}
        <div className="flex gap-2">
          {reviews.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i, i > idx ? "left" : "right")}
              aria-label={`Go to review ${i + 1}`}
              className={`rounded-full transition-all duration-300 ${
                i === idx
                  ? "w-6 h-2 bg-emerald-600 dark:bg-emerald-500"
                  : "w-2 h-2 bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600"
              }`}
            />
          ))}
        </div>

        {/* Prev / Next */}
        <div className="flex gap-2">
          <button
            onClick={() => go(idx - 1, "right")}
            aria-label="Previous review"
            className="w-9 h-9 rounded-full border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-400 dark:text-zinc-500 hover:border-emerald-400 dark:hover:border-emerald-600 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all duration-150 active:scale-95"
          >
            ←
          </button>
          <button
            onClick={() => go(idx + 1, "left")}
            aria-label="Next review"
            className="w-9 h-9 rounded-full border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-400 dark:text-zinc-500 hover:border-emerald-400 dark:hover:border-emerald-600 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all duration-150 active:scale-95"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}
