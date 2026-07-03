"use client";

import { useState, useMemo, type ReactNode } from "react";
import { Header } from "../../components/Header";

// ─── UFMIP Refund Schedule — HUD 4000.1 §II.A.3.b ───────────────────────────
// Applies to FHA-to-FHA refinances only. Refund decreases 2% per month,
// starting at 80% in month 1 and ending at 10% in month 36. No refund after.

const UFMIP_RATE = 0.0175;

function getRefundPct(months: number): number {
  if (months < 1 || months > 36) return 0;
  return Math.max(0, (82 - months * 2) / 100);
}

function calcMonthsElapsed(closingDateStr: string): number {
  if (!closingDateStr) return 0;
  const closing = new Date(closingDateStr + "T00:00:00");
  const today   = new Date();
  const years   = today.getFullYear() - closing.getFullYear();
  const months  = today.getMonth()    - closing.getMonth();
  const total   = years * 12 + months;
  return Math.max(0, today.getDate() < closing.getDate() ? total - 1 : total);
}

const fmt = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

// ─── Sub-components ────────────────────────────────────────────────────────────

const INPUT_CLS =
  "w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2.5 text-base text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500";

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-zinc-400 dark:text-zinc-500 leading-relaxed">{hint}</p>}
    </div>
  );
}

function DollarInput({ value, onChange, placeholder }: {
  value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base text-zinc-400 pointer-events-none">$</span>
      <input
        type="text"
        inputMode="numeric"
        className={INPUT_CLS + " pl-7"}
        value={value}
        onChange={e => onChange(e.target.value.replace(/[^0-9.]/g, ""))}
        placeholder={placeholder ?? "0"}
      />
    </div>
  );
}

function RRow({ label, value, sub, highlight, topBorder, muted }: {
  label: string; value: string; sub?: string;
  highlight?: boolean; topBorder?: boolean; muted?: boolean;
}) {
  return (
    <div className={`flex items-start justify-between gap-4 py-2.5 ${topBorder ? "border-t border-zinc-100 dark:border-zinc-800" : ""}`}>
      <span className={`text-sm leading-snug font-medium ${muted ? "text-zinc-400 dark:text-zinc-500" : "text-zinc-600 dark:text-zinc-300"}`}>
        {label}
        {sub && <span className="block text-xs text-zinc-400 dark:text-zinc-500 font-normal mt-0.5">{sub}</span>}
      </span>
      <span className={`text-base font-bold whitespace-nowrap shrink-0 ${
        highlight ? "text-emerald-600 dark:text-emerald-400" : "text-zinc-900 dark:text-white"
      }`}>
        {value}
      </span>
    </div>
  );
}

// ─── Schedule reference — all 36 months ───────────────────────────────────────

const SCHEDULE_ROWS = Array.from({ length: 36 }, (_, i) => ({
  month: i + 1,
  pct:   getRefundPct(i + 1),
}));

// ─── Main ──────────────────────────────────────────────────────────────────────

export default function UFMIPRefundPage() {
  const [origLoan,    setOrigLoan]    = useState("");
  const [closingDate, setClosingDate] = useState("");
  const [newLoan,     setNewLoan]     = useState("");

  const result = useMemo(() => {
    const origN  = parseFloat(origLoan.replace(/,/g, "")) || 0;
    const newN   = parseFloat(newLoan.replace(/,/g, ""))  || 0;
    const months = calcMonthsElapsed(closingDate);

    const origUFMIP  = origN * UFMIP_RATE;
    const refundPct  = getRefundPct(months);
    const refundAmt  = origUFMIP * refundPct;
    const newUFMIP   = newN  * UFMIP_RATE;
    const netUFMIP   = Math.max(0, newUFMIP - refundAmt);

    return { months, origUFMIP, refundPct, refundAmt, newUFMIP, netUFMIP, hasNew: newN > 0 };
  }, [origLoan, closingDate, newLoan]);

  const hasOrig   = (parseFloat(origLoan.replace(/,/g, "")) || 0) > 0;
  const ready     = hasOrig && !!closingDate;
  const hasRefund = ready && result.refundPct > 0;


  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Header />
      <main className="max-w-lg mx-auto px-4 py-10 flex flex-col gap-8">

        {/* Title */}
        <div>
          <a href="/" className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 mb-4 transition-colors">
            ← Back to Calculators
          </a>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">UFMIP Refund</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Estimate the upfront MIP refund credit when refinancing into a new FHA loan.
          </p>
        </div>

        {/* Inputs */}
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 flex flex-col gap-5">
          <Field
            label="Original FHA Loan Amount"
            hint="Base loan amount on the existing FHA loan, excluding any financed UFMIP."
          >
            <DollarInput value={origLoan} onChange={setOrigLoan} placeholder="350,000" />
          </Field>

          <Field label="Original Closing Date">
            <input
              type="date"
              className={INPUT_CLS}
              value={closingDate}
              onChange={e => setClosingDate(e.target.value)}
            />
          </Field>

          <Field
            label="New FHA Loan Amount"
            hint="Optional — enter to calculate the net UFMIP due on the new loan after the refund credit."
          >
            <DollarInput value={newLoan} onChange={setNewLoan} placeholder="340,000" />
          </Field>
        </div>

        {/* Result */}
        <div className={`rounded-2xl border p-6 ${
          hasRefund
            ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-950/20"
            : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-zinc-900 dark:text-white text-base">Refund Estimate</h2>
            {ready && (
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                hasRefund
                  ? "bg-emerald-600 text-white"
                  : "bg-zinc-400 dark:bg-zinc-600 text-white"
              }`}>
                {hasRefund ? `Month ${result.months} — ${(result.refundPct * 100).toFixed(0)}%` : "No Refund"}
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <RRow label="Months Elapsed"     value={ready ? `${result.months}` : "—"} />
            <RRow label="Original UFMIP"     value={ready ? fmt(result.origUFMIP)  : "—"} topBorder />
            <RRow label="Refund Percentage"  value={ready ? `${(result.refundPct * 100).toFixed(0)}%` : "—"} topBorder />
            <RRow label="Refund Credit"      value={ready ? fmt(result.refundAmt)  : "—"} highlight topBorder />

            {result.hasNew && (
              <>
                <RRow label="New UFMIP (1.75%)" value={fmt(result.newUFMIP)} topBorder />
                <RRow
                  label="Net UFMIP Due"
                  value={ready ? fmt(result.netUFMIP) : "—"}
                  sub="New UFMIP minus refund credit"
                  highlight
                  topBorder
                />
              </>
            )}
          </div>

          <p className="mt-4 text-xs text-zinc-400 dark:text-zinc-500 italic border-t border-zinc-100 dark:border-zinc-800 pt-3">
            HUD 4000.1 §II.A.3.b — UFMIP refund applies to FHA-to-FHA refinances only. Refund is credited toward the new UFMIP and cannot exceed the new UFMIP amount.
          </p>
        </div>

        {/* Refund Schedule Reference — all 36 months */}
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
          <h3 className="font-semibold text-zinc-900 dark:text-white mb-4">Refund Schedule</h3>
          <div className="grid grid-cols-6 gap-1.5">
            {SCHEDULE_ROWS.map(row => {
              const isActive = ready && result.months === row.month;
              return (
                <div
                  key={row.month}
                  className={`flex flex-col items-center justify-center rounded-xl py-2.5 px-1 text-center transition-colors ${
                    isActive
                      ? "bg-emerald-500 dark:bg-emerald-600 ring-2 ring-emerald-500"
                      : "bg-zinc-50 dark:bg-zinc-800"
                  }`}
                >
                  <span className={`text-[10px] font-medium leading-none mb-1 ${isActive ? "text-emerald-100" : "text-zinc-400 dark:text-zinc-500"}`}>
                    Mo {row.month}
                  </span>
                  <span className={`text-sm font-bold tabular-nums leading-none ${isActive ? "text-white" : "text-zinc-800 dark:text-zinc-100"}`}>
                    {(row.pct * 100).toFixed(0)}%
                  </span>
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-xs text-zinc-400 dark:text-zinc-500">Decreases 2% per month · No refund after month 36</p>
        </div>

      </main>
    </div>
  );
}
