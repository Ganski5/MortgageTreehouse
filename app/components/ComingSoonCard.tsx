"use client";

import { useState } from "react";

interface ComingSoonCardProps {
  title: string;
  description: string;
  icon: string;
  onNotify: (title: string) => void;
}

export function ComingSoonCard({ title, description, icon, onNotify }: ComingSoonCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`relative flex flex-col gap-3 p-6 rounded-2xl border cursor-default transition-all duration-200 ${
        hovered
          ? "border-emerald-200 dark:border-emerald-800 bg-white dark:bg-zinc-900 shadow-sm"
          : "border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900"
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-start justify-between">
        <span
          className="text-3xl transition-all duration-300"
          style={{ opacity: hovered ? 0.8 : 0.4, transform: hovered ? "scale(1.1)" : "scale(1)" }}
        >
          {icon}
        </span>
        <span className="text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 px-2.5 py-1 rounded-full">
          Coming Soon
        </span>
      </div>

      <h3 className={`font-semibold transition-colors duration-150 ${
        hovered ? "text-zinc-700 dark:text-zinc-300" : "text-zinc-400 dark:text-zinc-500"
      }`}>
        {title}
      </h3>

      <p className={`text-sm leading-relaxed transition-colors duration-150 ${
        hovered ? "text-zinc-500 dark:text-zinc-400" : "text-zinc-400 dark:text-zinc-600"
      }`}>
        {description}
      </p>

      {/* Notify nudge — slides up on hover */}
      <div
        className="mt-auto overflow-hidden transition-all duration-300 ease-out"
        style={{ maxHeight: hovered ? "2rem" : "0", opacity: hovered ? 1 : 0 }}
      >
        <button
          onClick={(e) => { e.stopPropagation(); onNotify(title); }}
          className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 flex items-center gap-1.5 transition-colors duration-150"
        >
          <span>📬</span>
          <span>Notify me when this launches →</span>
        </button>
      </div>
    </div>
  );
}
