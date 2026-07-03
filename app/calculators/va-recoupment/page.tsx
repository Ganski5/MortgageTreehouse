"use client";

import { useState, useMemo, type ReactNode } from "react";
import { Header } from "../../components/Header";

// ─── VA IRRRL Recoupment Test — VA Circular 26-18-13 ─────────────────────────
// All fees and charges must be recouped within 36 months of loan closing.
// Net Tangible Benefit thresholds vary by loan type transition.

type LoanTransition = "fixed-fixed" | "arm-fixed" | "fixed-arm";

const NTB_THRESHOLD: Record<LoanTransition, number | null> = {
  "fixed-fixed": -0.005,  // new rate ≥ 0.50% lower
  "arm-fixed":   null,    // always satisfies NTB
  "fixed-arm":   -0.02,   // new rate ≥ 2.00% lower
};

const NTB_LABEL: Record<LoanTransition, string> = {
  "fixed-fixed": "New rate must be ≥ 0.50% lower",
  "arm-fixed":   "Always satisfies NTB (ARM → Fixed)",
  "fixed-arm":   "New rate must be ≥ 2.00% lower",
};

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

function PctInput({ value, onChange, placeholder }: {
  value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div className="relative">
      <input
        type="text"
        inputMode="decimal"
        className={INPUT_CLS + " pr-7"}
        value={value}
        onChange={e => onChange(e.target.value.replace(/[^0-9.]/g, ""))}
        placeholder={placeholder ?? "0.000"}
      />
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-base text-zinc-400 pointer-events-none">%</span>
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

function RRow({ label, value, sub, highlight, topBorder }: {
  label: string; value: string; sub?: string; highlight?: boolean; topBorder?: boolean;
}) {
  return (
    <div className={`flex items-start justify-between gap-4 py-2.5 ${topBorder ? "border-t border-zinc-100 dark:border-zinc-800" : ""}`}>
      <span className="text-sm leading-snug font-medium text-zinc-600 dark:text-zinc-300">
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

function ResultCard({ title, pass, ready, children, cite }: {
  title: string; pass: boolean; ready: boolean; children: ReactNode; cite?: string;
}) {
  return (
    <div className={`rounded-2xl border p-6 ${
      !ready
        ? "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
        : pass
          ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-950/20"
          : "border-red-200 dark:border-red-900 bg-red-50/60 dark:bg-red-950/20"
    }`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-zinc-900 dark:text-white text-base">{title}</h2>
        {ready && (
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${
            pass ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
          }`}>
            {pass ? "✓ Pass" : "✗ Fail"}
          </span>
        )}
      </div>
      <div className="flex flex-col">{children}</div>
      {cite && (
        <p className="mt-4 text-xs text-zinc-400 dark:text-zinc-500 italic border-t border-zinc-100 dark:border-zinc-800 pt-3">
          {cite}
        </p>
      )}
    </div>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────

export default function VARecoupmentPage() {
  const [oldPI,       setOldPI]       = useState("");
  const [newPI,       setNewPI]       = useState("");
  const [costs,       setCosts]       = useState("");
  const [loanTrans,   setLoanTrans]   = useState<LoanTransition>("fixed-fixed");
  const [currentRate, setCurrentRate] = useState("");
  const [newRate,     setNewRate]     = useState("");

  const recoup = useMemo(() => {
    const oldN   = parseFloat(oldPI.replace(/,/g, ""))  || 0;
    const newN   = parseFloat(newPI.replace(/,/g, ""))  || 0;
    const costsN = parseFloat(costs.replace(/,/g, "")) || 0;
    const savings = Math.max(0, oldN - newN);
    if (savings === 0 || costsN === 0) return { savings, months: null, pass: false, costsN, ready: false };
    const months = costsN / savings;
    return { savings, months, pass: months <= 36, costsN, ready: true };
  }, [oldPI, newPI, costs]);

  const ntb = useMemo(() => {
    const currR = parseFloat(currentRate) || 0;
    const newR  = parseFloat(newRate)     || 0;
    if (loanTrans === "arm-fixed") return { pass: true, delta: null, ready: currR > 0 && newR > 0 };
    if (currR === 0 || newR === 0) return { pass: false, delta: null, ready: false };
    const delta = newR - currR;
    const threshold = NTB_THRESHOLD[loanTrans]!;
    return { pass: delta <= threshold, delta, ready: true };
  }, [currentRate, newRate, loanTrans]);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Header />
      <main className="max-w-lg mx-auto px-4 py-10 flex flex-col gap-8">

        {/* Title */}
        <div>
          <a href="/" className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 mb-4 transition-colors">
            ← Back to Calculators
          </a>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">VA Recoupment Test</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Verify an IRRRL meets the 36-month recoupment requirement and net tangible benefit test.
          </p>
        </div>

        {/* Recoupment Inputs */}
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 flex flex-col gap-5">
          <h3 className="font-semibold text-zinc-900 dark:text-white">Recoupment</h3>
          <Field label="Current P&I Payment">
            <DollarInput value={oldPI} onChange={setOldPI} placeholder="2,100" />
          </Field>
          <Field label="New P&I Payment">
            <DollarInput value={newPI} onChange={setNewPI} placeholder="1,940" />
          </Field>
          <Field
            label="Total Closing Costs"
            hint="Include lender fees, title, and recording. Exclude taxes, insurance, escrow prepaids, and the VA funding fee when financed into the loan."
          >
            <DollarInput value={costs} onChange={setCosts} placeholder="3,500" />
          </Field>
        </div>

        {/* NTB Inputs */}
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 flex flex-col gap-5">
          <h3 className="font-semibold text-zinc-900 dark:text-white">Net Tangible Benefit</h3>
          <Field label="Loan Type Transition">
            <TogglePill
              options={[
                { value: "fixed-fixed", label: "Fixed → Fixed" },
                { value: "arm-fixed",   label: "ARM → Fixed" },
                { value: "fixed-arm",   label: "Fixed → ARM" },
              ]}
              value={loanTrans}
              onChange={v => setLoanTrans(v as LoanTransition)}
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Current Rate">
              <PctInput value={currentRate} onChange={setCurrentRate} placeholder="7.250" />
            </Field>
            <Field label="New Rate">
              <PctInput value={newRate} onChange={setNewRate} placeholder="6.500" />
            </Field>
          </div>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 -mt-1">{NTB_LABEL[loanTrans]}</p>
        </div>

        {/* Recoupment Result */}
        <ResultCard
          title="Recoupment Result"
          pass={recoup.pass}
          ready={recoup.ready}
          cite="VA Circular 26-18-13 — All fees and charges must be recouped within 36 months of loan closing."
        >
          <RRow label="Monthly Savings"    value={recoup.ready ? fmt(recoup.savings)  : "—"} highlight />
          <RRow label="Recoupment Costs"   value={recoup.ready ? fmt(recoup.costsN)   : "—"} topBorder />
          <RRow
            label="Recoupment Period"
            value={recoup.ready && recoup.months !== null ? `${recoup.months.toFixed(1)} months` : "—"}
            sub="Must be ≤ 36 months"
            topBorder
          />
        </ResultCard>

        {/* NTB Result */}
        <ResultCard
          title="Net Tangible Benefit"
          pass={ntb.pass}
          ready={ntb.ready}
          cite="VA Circular 26-18-13 — The refinance must provide a net tangible benefit to the veteran."
        >
          {loanTrans === "arm-fixed" ? (
            <p className="text-sm text-zinc-600 dark:text-zinc-300 py-1">
              ARM-to-Fixed transitions automatically satisfy the net tangible benefit requirement regardless of rate change.
            </p>
          ) : (
            <>
              <RRow label="Current Rate" value={currentRate ? `${parseFloat(currentRate).toFixed(3)}%` : "—"} />
              <RRow label="New Rate"     value={newRate     ? `${parseFloat(newRate).toFixed(3)}%`     : "—"} topBorder />
              <RRow
                label="Rate Reduction"
                value={ntb.ready && ntb.delta !== null ? `${(ntb.delta * -1).toFixed(3)}%` : "—"}
                sub={loanTrans === "fixed-fixed" ? "Must be ≥ 0.500%" : "Must be ≥ 2.000%"}
                highlight={ntb.pass}
                topBorder
              />
            </>
          )}
        </ResultCard>

      </main>
    </div>
  );
}
