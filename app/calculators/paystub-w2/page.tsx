"use client";

import { useState, useMemo, type ReactNode } from "react";
import { Header } from "../../components/Header";

// ─── Paystub / W2 — Full-Time Income — Fannie Mae B3-3.1-01 ──────────────────
// Qualifying income = current pay rate (base).
// YTD annualization verifies the rate is supported; use the lower if it's not.
// W2 Box 1 serves as a prior-year history cross-reference.

type PayType = "salary" | "hourly";
type PayFreq = "weekly" | "biweekly" | "semimonthly" | "monthly";

const PERIODS_PER_YEAR: Record<PayFreq, number> = {
  weekly:      52,
  biweekly:    26,
  semimonthly: 24,
  monthly:     12,
};

const FREQ_LABEL: Record<PayFreq, string> = {
  weekly:      "Weekly",
  biweekly:    "Bi-weekly",
  semimonthly: "Semi-monthly",
  monthly:     "Monthly",
};

const SALARY_LABEL: Record<PayFreq, string> = {
  weekly:      "Weekly Rate",
  biweekly:    "Bi-weekly Rate",
  semimonthly: "Semi-monthly Rate",
  monthly:     "Monthly Rate",
};

const fmt = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

const fmtD = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 });

const pn = (s: string) => parseFloat(s.replace(/[^0-9.]/g, "")) || 0;

function calcPeriodsElapsed(endDateStr: string, freq: PayFreq): number {
  if (!endDateStr) return 0;
  const end  = new Date(endDateStr + "T00:00:00");
  const jan1 = new Date(end.getFullYear(), 0, 1);
  const dayOfYear = Math.floor((end.getTime() - jan1.getTime()) / 86400000) + 1;
  switch (freq) {
    case "weekly":      return Math.round(dayOfYear / 7);
    case "biweekly":    return Math.round(dayOfYear / 14);
    case "semimonthly": return end.getMonth() * 2 + (end.getDate() >= 15 ? 2 : 1);
    case "monthly":     return end.getMonth() + 1;
  }
}

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
        inputMode="decimal"
        className={INPUT_CLS + " pl-7"}
        value={value}
        onChange={e => onChange(e.target.value.replace(/[^0-9.]/g, ""))}
        placeholder={placeholder ?? "0"}
      />
    </div>
  );
}

function NumberInput({ value, onChange, placeholder, suffix }: {
  value: string; onChange: (v: string) => void; placeholder?: string; suffix?: string;
}) {
  return (
    <div className="relative">
      <input
        type="text"
        inputMode="decimal"
        className={INPUT_CLS + (suffix ? " pr-10" : "")}
        value={value}
        onChange={e => onChange(e.target.value.replace(/[^0-9.]/g, ""))}
        placeholder={placeholder ?? "0"}
      />
      {suffix && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-base text-zinc-400 pointer-events-none">{suffix}</span>
      )}
    </div>
  );
}

function TogglePill({
  options, value, onChange,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex gap-2">
      {options.map(o => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={`flex-1 py-2.5 px-3 rounded-xl text-sm font-semibold border transition-colors text-center ${
            value === o.value
              ? "bg-emerald-600 text-white border-emerald-600"
              : "border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-emerald-400"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function RRow({ label, value, sub, highlight, topBorder, indent, warn }: {
  label: string; value: string; sub?: string;
  highlight?: boolean; topBorder?: boolean; indent?: boolean; warn?: boolean;
}) {
  return (
    <div className={`flex items-start justify-between gap-4 py-2.5 ${topBorder ? "border-t border-zinc-100 dark:border-zinc-800" : ""}`}>
      <span className={`text-sm leading-snug font-medium ${indent ? "pl-3 text-zinc-400 dark:text-zinc-500" : "text-zinc-600 dark:text-zinc-300"}`}>
        {label}
        {sub && <span className="block text-xs text-zinc-400 dark:text-zinc-500 font-normal mt-0.5">{sub}</span>}
      </span>
      <span className={`text-base font-bold whitespace-nowrap shrink-0 ${
        warn      ? "text-amber-600 dark:text-amber-400" :
        highlight ? "text-emerald-600 dark:text-emerald-400" :
                    "text-zinc-900 dark:text-white"
      }`}>
        {value}
      </span>
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 flex flex-col gap-5">
      <h3 className="font-semibold text-zinc-900 dark:text-white">{title}</h3>
      {children}
    </div>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────

export default function PaystubW2Page() {
  // Pay rate
  const [payType,    setPayType]    = useState<PayType>("salary");
  const [salaryAmt,  setSalaryAmt]  = useState("");
  const [hourly,   setHourly]   = useState("");
  const [hours,    setHours]    = useState("40");
  const [payFreq,  setPayFreq]  = useState<PayFreq>("biweekly");

  // YTD
  const [ytdGross,     setYtdGross]     = useState("");
  const [payPeriodEnd, setPayPeriodEnd] = useState("");

  // W2
  const [showW2,   setShowW2]   = useState(false);
  const [w2Curr,   setW2Curr]   = useState("");
  const [w2Prior,  setW2Prior]  = useState("");

  const result = useMemo(() => {
    const periodsPerYear = PERIODS_PER_YEAR[payFreq];

    // Base from pay rate
    const annualBase =
      payType === "salary"
        ? pn(salaryAmt) * periodsPerYear
        : pn(hourly) * pn(hours) * 52;
    const monthlyBase     = annualBase / 12;
    const perPayPeriod    = annualBase / periodsPerYear;

    // YTD annualization
    const ytdN         = pn(ytdGross);
    const periodsN     = calcPeriodsElapsed(payPeriodEnd, payFreq);
    const annualYTD    = periodsN > 0 ? (ytdN / periodsN) * periodsPerYear : 0;
    const monthlyYTD   = annualYTD / 12;
    const hasYTD       = ytdN > 0 && periodsN > 0;

    // YTD vs base variance
    const variance     = hasYTD && annualBase > 0 ? (annualYTD - annualBase) / annualBase : 0;
    const ytdLower     = hasYTD && monthlyYTD < monthlyBase;
    const bigVariance  = hasYTD && Math.abs(variance) > 0.10;

    // Qualifying
    const qualifying   = hasYTD ? Math.min(monthlyBase, monthlyYTD) : monthlyBase;
    const qualifyingAnnual = qualifying * 12;

    // W2
    const w2CurrN  = pn(w2Curr);
    const w2PriorN = pn(w2Prior);
    const monthlyW2Curr  = w2CurrN  > 0 ? w2CurrN  / 12 : null;
    const monthlyW2Prior = w2PriorN > 0 ? w2PriorN / 12 : null;

    return {
      annualBase, monthlyBase, perPayPeriod, periodsPerYear,
      annualYTD, monthlyYTD, hasYTD, periodsN,
      variance, ytdLower, bigVariance,
      qualifying, qualifyingAnnual,
      monthlyW2Curr, monthlyW2Prior, w2CurrN, w2PriorN,
    };
  }, [payType, salaryAmt, hourly, hours, payFreq, ytdGross, payPeriodEnd, w2Curr, w2Prior]);

  const hasBase = result.annualBase > 0;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Header />
      <main className="max-w-xl mx-auto px-4 py-10 flex flex-col gap-8">

        {/* Title */}
        <div>
          <a href="/" className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 mb-4 transition-colors">
            ← Back to Calculators
          </a>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Paystub / W2</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Calculate qualifying income from base pay rate and verify against YTD earnings.
          </p>
        </div>

        {/* ── Pay Rate ───────────────────────────────────────────────────────── */}
        <SectionCard title="Pay Rate">
          <Field label="Employment Type">
            <TogglePill
              options={[
                { value: "salary", label: "Salaried" },
                { value: "hourly", label: "Hourly" },
              ]}
              value={payType}
              onChange={v => setPayType(v as PayType)}
            />
          </Field>

          {payType === "salary" ? (
            <Field label={SALARY_LABEL[payFreq]}>
              <DollarInput value={salaryAmt} onChange={setSalaryAmt} placeholder="2,500" />
            </Field>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <Field label="Hourly Rate">
                <DollarInput value={hourly} onChange={setHourly} placeholder="22.50" />
              </Field>
              <Field label="Hours / Week">
                <NumberInput value={hours} onChange={setHours} placeholder="40" suffix="hrs" />
              </Field>
            </div>
          )}

          <Field label="Pay Frequency">
            <TogglePill
              options={(Object.keys(PERIODS_PER_YEAR) as PayFreq[]).map(f => ({
                value: f, label: FREQ_LABEL[f],
              }))}
              value={payFreq}
              onChange={v => setPayFreq(v as PayFreq)}
            />
          </Field>

          {hasBase && (
            <div className="grid grid-cols-3 gap-3 pt-1 border-t border-zinc-100 dark:border-zinc-800">
              <div className="flex flex-col items-center text-center">
                <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500 mb-1">Per Pay Period</span>
                <span className="text-base font-bold text-zinc-900 dark:text-white">{fmtD(result.perPayPeriod)}</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500 mb-1">Monthly</span>
                <span className="text-base font-bold text-zinc-900 dark:text-white">{fmt(result.monthlyBase)}</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500 mb-1">Annual</span>
                <span className="text-base font-bold text-zinc-900 dark:text-white">{fmt(result.annualBase)}</span>
              </div>
            </div>
          )}
        </SectionCard>

        {/* ── YTD Verification ───────────────────────────────────────────────── */}
        <SectionCard title="YTD Verification">
          <div className="grid grid-cols-2 gap-4">
            <Field label="YTD Gross Earnings" hint="From current paystub">
              <DollarInput value={ytdGross} onChange={setYtdGross} placeholder="28,450" />
            </Field>
            <Field label="Pay Period End Date" hint="End date shown on the paystub">
              <input
                type="date"
                className={INPUT_CLS}
                value={payPeriodEnd}
                onChange={e => setPayPeriodEnd(e.target.value)}
              />
            </Field>
          </div>
          {payPeriodEnd && result.periodsN > 0 && (
            <p className="text-xs text-zinc-400 dark:text-zinc-500 -mt-1">
              {result.periodsN} {FREQ_LABEL[payFreq].toLowerCase()} pay periods elapsed
            </p>
          )}

          {result.hasYTD && (
            <div className="grid grid-cols-2 gap-3 pt-1 border-t border-zinc-100 dark:border-zinc-800">
              <div className="flex flex-col items-center text-center">
                <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500 mb-1">YTD Annualized</span>
                <span className="text-base font-bold text-zinc-900 dark:text-white">{fmt(result.annualYTD)}</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500 mb-1">Monthly</span>
                <span className={`text-base font-bold ${
                  result.bigVariance ? "text-amber-600 dark:text-amber-400" : "text-zinc-900 dark:text-white"
                }`}>{fmt(result.monthlyYTD)}</span>
              </div>
            </div>
          )}

          {result.hasYTD && result.bigVariance && (
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
              <p className="text-xs text-amber-700 dark:text-amber-400 font-medium leading-relaxed">
                YTD annualized is {Math.abs(result.variance * 100).toFixed(1)}% {result.variance > 0 ? "above" : "below"} the stated pay rate — verify with the employer or obtain a written VOE explaining the discrepancy.
              </p>
            </div>
          )}
        </SectionCard>

        {/* ── W2 Reference ───────────────────────────────────────────────────── */}
        <SectionCard title="W2 Reference">
          <button
            onClick={() => setShowW2(v => !v)}
            className="self-start text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:underline -mt-2"
          >
            {showW2 ? "− Hide W2 fields" : "+ Add W2 for history cross-reference"}
          </button>

          {showW2 && (
            <div className="grid grid-cols-2 gap-4">
              <Field label="Most Recent W2" hint="Box 1 — Wages, tips, other compensation">
                <DollarInput value={w2Curr} onChange={setW2Curr} placeholder="64,200" />
              </Field>
              <Field label="Prior Year W2" hint="Box 1 — optional">
                <DollarInput value={w2Prior} onChange={setW2Prior} placeholder="61,500" />
              </Field>
            </div>
          )}

          {!showW2 && (
            <p className="text-xs text-zinc-400 dark:text-zinc-500 -mt-2">
              W2 Box 1 from the prior tax year is used to verify employment history and income consistency, not as the primary qualifying figure for salaried borrowers.
            </p>
          )}
        </SectionCard>

        {/* ── Result ─────────────────────────────────────────────────────────── */}
        <div className={`rounded-2xl border p-6 ${
          hasBase
            ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-950/20"
            : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
        }`}>
          <h2 className="font-semibold text-zinc-900 dark:text-white text-base mb-4">Qualifying Income</h2>

          {/* Prominent qualifying figure */}
          <div className="flex flex-col items-center text-center py-5 mb-2">
            <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide mb-2">
              Qualifying Monthly Income
            </span>
            <span className="text-5xl font-bold text-emerald-600 dark:text-emerald-400">
              {hasBase ? fmt(result.qualifying) : "—"}
            </span>
            {hasBase && (
              <span className="text-xs text-zinc-400 dark:text-zinc-500 mt-2">
                {result.hasYTD && result.ytdLower
                  ? "YTD annualized is lower — using YTD per B3-3.1-01"
                  : result.hasYTD
                    ? "Pay rate supported by YTD"
                    : "Based on stated pay rate"}
              </span>
            )}
          </div>

          {/* Breakdown rows */}
          <div className="flex flex-col border-t border-emerald-100 dark:border-emerald-900/50">
            <RRow
              label="Base Monthly Income"
              value={hasBase ? fmt(result.monthlyBase) : "—"}
              sub={payType === "hourly"
                ? `${pn(hours)} hrs/wk × $${pn(hourly).toFixed(2)}/hr × 52 ÷ 12`
                : `${SALARY_LABEL[payFreq].toLowerCase()} × ${result.periodsPerYear} ÷ 12`}
            />

            {result.hasYTD && (
              <RRow
                label="YTD Annualized Monthly"
                value={fmt(result.monthlyYTD)}
                sub={`${fmt(pn(ytdGross))} YTD ÷ ${result.periodsN} periods × ${result.periodsPerYear} ÷ 12`}
                warn={result.bigVariance}
                topBorder
              />
            )}

            {result.monthlyW2Curr !== null && (
              <RRow
                label="W2 Monthly (most recent)"
                value={fmt(result.monthlyW2Curr)}
                sub={`${fmt(result.w2CurrN)} ÷ 12`}
                indent
                topBorder
              />
            )}

            {result.monthlyW2Prior !== null && (
              <RRow
                label="W2 Monthly (prior year)"
                value={fmt(result.monthlyW2Prior)}
                sub={`${fmt(result.w2PriorN)} ÷ 12`}
                indent
                topBorder
              />
            )}

            <RRow
              label="Qualifying Annual Income"
              value={hasBase ? fmt(result.qualifyingAnnual) : "—"}
              indent
              topBorder
            />
          </div>

          <p className="mt-4 text-xs text-zinc-400 dark:text-zinc-500 italic border-t border-zinc-100 dark:border-zinc-800 pt-3">
            Fannie Mae B3-3.1-01 — Base salary qualifying income is the current pay rate. If YTD earnings do not support the stated rate, use the lower annualized YTD figure. W2 is a history verification tool, not a primary qualifying source for salaried income.
          </p>
        </div>

      </main>
    </div>
  );
}
