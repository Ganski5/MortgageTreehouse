"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

export function HeroCalculator() {
  const [amount, setAmount] = useState("400000");
  const [rate, setRate]     = useState("6.875");
  const [term, setTerm]     = useState("30");

  const payment = useMemo(() => {
    const p = parseFloat(amount.replace(/[^0-9.]/g, ""));
    const r = parseFloat(rate) / 100 / 12;
    const n = parseInt(term) * 12;
    if (!p || p <= 0 || !r || r <= 0 || !n) return null;
    return (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  }, [amount, rate, term]);

  const fmt = (n: number) =>
    n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });

  const field =
    "w-full py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition";

  return (
    <div className="w-full max-w-sm mx-auto mt-4 bg-white/85 dark:bg-zinc-900/85 backdrop-blur-md rounded-2xl border border-zinc-200/80 dark:border-zinc-700/60 shadow-xl p-5 flex flex-col gap-4 anim-fade-in-up">

      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">
          Quick P&amp;I Estimate
        </p>
        <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Live
        </span>
      </div>

      {/* Inputs row */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-zinc-400 dark:text-zinc-500">Loan Amount</label>
          <div className="relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400 text-xs select-none">$</span>
            <input
              type="text"
              inputMode="numeric"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={`${field} pl-5 pr-2`}
            />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-zinc-400 dark:text-zinc-500">Rate</label>
          <div className="relative">
            <input
              type="text"
              inputMode="decimal"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              className={`${field} pl-3 pr-6`}
            />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 text-xs select-none">%</span>
          </div>
        </div>
      </div>

      {/* Term pills */}
      <div className="flex gap-1.5">
        {[10, 15, 20, 30].map((yr) => (
          <button
            key={yr}
            onClick={() => setTerm(String(yr))}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-150 ${
              term === String(yr)
                ? "bg-emerald-600 border-emerald-600 text-white shadow-sm"
                : "border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 bg-white dark:bg-zinc-800 hover:border-emerald-300 dark:hover:border-emerald-700"
            }`}
          >
            {yr}yr
          </button>
        ))}
      </div>

      {/* Result */}
      <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800">
        <div>
          <p className="text-xs text-zinc-400 mb-0.5">Monthly P&amp;I Payment</p>
          <p
            className={`text-2xl font-bold tabular-nums transition-all duration-300 ${
              payment ? "text-emerald-600 dark:text-emerald-400" : "text-zinc-300 dark:text-zinc-600"
            }`}
          >
            {payment ? fmt(payment) : "—"}
          </p>
        </div>
        <Link
          href="/calculators/amortization"
          className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors duration-150 flex items-center gap-1 group"
        >
          Full breakdown
          <span className="group-hover:translate-x-0.5 transition-transform duration-150 inline-block">→</span>
        </Link>
      </div>
    </div>
  );
}
