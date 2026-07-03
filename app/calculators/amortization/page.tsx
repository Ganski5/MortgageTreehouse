"use client";

import { useState, useMemo, Fragment } from "react";
import { Header } from "../../components/Header";
import { DownloadPDFButton } from "../../components/DownloadPDFButton";
import { AmortizationPDF } from "../../components/pdf/AmortizationPDF";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Inputs {
  label: string;
  loanAmount: string;
  rate: string;
  termYears: string;
  extraPayment: string;
}

interface AmortRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
  cumInterest: number;
}

interface YearSummary {
  year: number;
  principal: number;
  interest: number;
  endBalance: number;
  cumInterest: number;
  rows: AmortRow[];
}

interface Result {
  monthlyPayment: number;
  schedule: AmortRow[];
  totalInterest: number;
  totalPaid: number;
  payoffMonths: number;
  years: YearSummary[];
}

// ── Amortization Engine ───────────────────────────────────────────────────────

function compute(inputs: Inputs): Result | null {
  const p = parseFloat(inputs.loanAmount.replace(/[^0-9.]/g, ""));
  const annualRate = parseFloat(inputs.rate);
  const term = parseInt(inputs.termYears);
  const extra = parseFloat(inputs.extraPayment) || 0;

  if (!p || p <= 0 || !annualRate || annualRate <= 0 || !term || term <= 0) return null;

  const r = annualRate / 100 / 12;
  const n = term * 12;
  const basePayment = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

  const schedule: AmortRow[] = [];
  let balance = p;
  let cumInterest = 0;

  while (balance > 0.005 && schedule.length < 600) {
    const interest = balance * r;
    const principal = Math.min(basePayment + extra - interest, balance);
    balance = Math.max(0, balance - principal);
    cumInterest += interest;
    schedule.push({
      month: schedule.length + 1,
      payment: principal + interest,
      principal,
      interest,
      balance,
      cumInterest,
    });
  }

  const years: YearSummary[] = [];
  for (let i = 0; i < schedule.length; i += 12) {
    const chunk = schedule.slice(i, i + 12);
    years.push({
      year: Math.floor(i / 12) + 1,
      principal: chunk.reduce((s, row) => s + row.principal, 0),
      interest: chunk.reduce((s, row) => s + row.interest, 0),
      endBalance: chunk[chunk.length - 1].balance,
      cumInterest: chunk[chunk.length - 1].cumInterest,
      rows: chunk,
    });
  }

  return {
    monthlyPayment: basePayment,
    schedule,
    totalInterest: cumInterest,
    totalPaid: schedule.reduce((s, row) => s + row.payment, 0),
    payoffMonths: schedule.length,
    years,
  };
}

// ── Formatters ────────────────────────────────────────────────────────────────

function curr(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}
function currCents(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function fmtMonths(months: number) {
  const y = Math.floor(months / 12);
  const m = months % 12;
  return y === 0 ? `${m}mo` : m === 0 ? `${y}yr` : `${y}yr ${m}mo`;
}

// ── Input Panel ───────────────────────────────────────────────────────────────

function InputPanel({
  inputs,
  onChange,
  variant,
}: {
  inputs: Inputs;
  onChange: (v: Inputs) => void;
  variant: "a" | "b";
}) {
  const isA = variant === "a";

  const panelBorder = isA
    ? "border-emerald-200 dark:border-emerald-800"
    : "border-sky-200 dark:border-sky-800";
  const panelBg = isA
    ? "bg-emerald-50/40 dark:bg-emerald-950/20"
    : "bg-sky-50/40 dark:bg-sky-950/20";
  const badge = isA ? "bg-emerald-600 text-white" : "bg-sky-600 text-white";
  const ring = isA ? "focus:ring-emerald-500" : "focus:ring-sky-500";
  const termActive = isA
    ? "bg-emerald-600 border-emerald-600 text-white"
    : "bg-sky-600 border-sky-600 text-white";

  function set(k: keyof Inputs, v: string) {
    onChange({ ...inputs, [k]: v });
  }

  const fieldCls = `w-full py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white text-base outline-none focus:ring-2 ${ring} transition`;

  return (
    <div className={`flex flex-col gap-4 p-6 rounded-2xl border ${panelBorder} ${panelBg}`}>
      <div className="flex items-center justify-between">
        <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full ${badge}`}>
          Scenario {isA ? "A" : "B"}
        </span>
        <input
          value={inputs.label}
          onChange={(e) => set("label", e.target.value)}
          placeholder="Nickname (optional)"
          className="text-xs text-zinc-400 bg-transparent border-none outline-none text-right placeholder:text-zinc-300 dark:placeholder:text-zinc-600 w-36"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Loan Amount</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm select-none">$</span>
          <input
            type="text"
            inputMode="numeric"
            value={inputs.loanAmount}
            onChange={(e) => set("loanAmount", e.target.value)}
            placeholder="400,000"
            className={`${fieldCls} pl-7 pr-4`}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Interest Rate</label>
        <div className="relative">
          <input
            type="text"
            inputMode="decimal"
            value={inputs.rate}
            onChange={(e) => set("rate", e.target.value)}
            placeholder="6.875"
            className={`${fieldCls} pl-4 pr-8`}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm select-none">%</span>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Loan Term</label>
        <div className="flex gap-1.5 flex-wrap">
          {[10, 15, 20, 25, 30].map((yr) => (
            <button
              key={yr}
              onClick={() => set("termYears", String(yr))}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all duration-150 ${
                inputs.termYears === String(yr)
                  ? termActive
                  : "border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-600"
              }`}
            >
              {yr}yr
            </button>
          ))}
          <button
            onClick={() => {
              const custom = ![10,15,20,25,30].includes(Number(inputs.termYears));
              if (!custom) set("termYears", "");
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all duration-150 ${
              ![10,15,20,25,30].includes(Number(inputs.termYears)) && inputs.termYears !== ""
                ? termActive
                : "border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-600"
            }`}
          >
            Custom
          </button>
        </div>
        {![10,15,20,25,30].includes(Number(inputs.termYears)) && (
          <div className="relative mt-1">
            <input
              type="text"
              inputMode="numeric"
              value={inputs.termYears}
              onChange={(e) => set("termYears", e.target.value)}
              placeholder="e.g. 29"
              autoFocus
              className={`${fieldCls} pl-4 pr-12`}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 text-xs select-none">years</span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
          Extra Monthly Payment{" "}
          <span className="font-normal text-zinc-400">(optional)</span>
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm select-none">$</span>
          <input
            type="text"
            inputMode="numeric"
            value={inputs.extraPayment}
            onChange={(e) => set("extraPayment", e.target.value)}
            placeholder="0"
            className={`${fieldCls} pl-7 pr-4`}
          />
        </div>
        {(() => {
          const p = parseFloat(inputs.loanAmount.replace(/[^0-9.]/g, ""));
          const r = parseFloat(inputs.rate) / 100 / 12;
          const n = parseInt(inputs.termYears) * 12;
          if (!p || !r || !n) return null;
          const mp = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
          const extra = mp / 12;
          const isActive = Math.abs(parseFloat(inputs.extraPayment) - extra) < 0.01;
          return (
            <button
              onClick={() => set("extraPayment", isActive ? "" : extra.toFixed(2))}
              className={`self-start mt-1 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all duration-150 ${
                isActive
                  ? isA
                    ? "bg-emerald-600 border-emerald-600 text-white"
                    : "bg-sky-600 border-sky-600 text-white"
                  : isA
                  ? "border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                  : "border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-950/40"
              }`}
            >
              {isActive ? "✓ " : "+ "}1 extra payment/yr{!isActive && ` (${currCents(extra)}/mo)`}
            </button>
          );
        })()}
      </div>
    </div>
  );
}

// ── Comparison Banner ─────────────────────────────────────────────────────────

function ComparisonBanner({ a, b }: { a: Result; b: Result }) {
  const interestSavedByB = a.totalInterest - b.totalInterest;
  const monthsSavedByB   = a.payoffMonths - b.payoffMonths;
  const paymentDiff      = b.monthlyPayment - a.monthlyPayment;
  const better           = interestSavedByB >= 0 ? "B" : "A";
  const absSaved         = Math.abs(interestSavedByB);
  const absMonths        = Math.abs(monthsSavedByB);

  return (
    <div className="rounded-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden shadow-sm">
      {absSaved > 1 && (
        <div
          className={`px-6 py-3 text-sm font-semibold flex flex-wrap items-center gap-x-3 gap-y-1 ${
            better === "B" ? "bg-sky-600 text-white" : "bg-emerald-600 text-white"
          }`}
        >
          <span>Scenario {better} saves {curr(absSaved)} in total interest</span>
          {absMonths > 0 && (
            <span className="opacity-75 font-normal">
              · pays off {fmtMonths(absMonths)} sooner
            </span>
          )}
          {Math.abs(paymentDiff) > 0.5 && (
            <span className="opacity-75 font-normal">
              · {paymentDiff > 0 ? "B costs" : "B saves"} {currCents(Math.abs(paymentDiff))}/mo more
            </span>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-zinc-100 dark:divide-zinc-800">
        {[
          { label: "Monthly Payment", va: currCents(a.monthlyPayment), vb: currCents(b.monthlyPayment) },
          { label: "Total Interest",  va: curr(a.totalInterest),       vb: curr(b.totalInterest) },
          { label: "Total Paid",      va: curr(a.totalPaid),           vb: curr(b.totalPaid) },
          { label: "Payoff",          va: fmtMonths(a.payoffMonths),   vb: fmtMonths(b.payoffMonths) },
        ].map(({ label, va, vb }) => (
          <div key={label} className="flex flex-col gap-2 p-5 bg-white dark:bg-zinc-950">
            <span className="text-xs font-medium text-zinc-400 uppercase tracking-wide">{label}</span>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                <span className="text-sm font-semibold text-zinc-900 dark:text-white">{va}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sky-500 flex-shrink-0" />
                <span className="text-sm font-semibold text-zinc-900 dark:text-white">{vb}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Schedule Table (single scenario) ─────────────────────────────────────────

function ScheduleTable({ result, variant }: { result: Result; variant: "a" | "b" }) {
  const [monthly, setMonthly]         = useState(false);
  const [expandedYear, setExpandedYear] = useState<number | null>(null);
  const isA = variant === "a";

  const headerCls = isA
    ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400"
    : "bg-sky-50 dark:bg-sky-950/30 text-sky-700 dark:text-sky-400";
  const rowHover = isA
    ? "hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20"
    : "hover:bg-sky-50/50 dark:hover:bg-sky-950/20";
  const subRowBg = isA
    ? "bg-emerald-50/30 dark:bg-emerald-950/10"
    : "bg-sky-50/30 dark:bg-sky-950/10";

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-end">
        <div className="inline-flex rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 p-0.5 gap-0.5">
          {(["yearly", "monthly"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMonthly(m === "monthly")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150 ${
                (m === "monthly") === monthly
                  ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm border border-zinc-200 dark:border-zinc-700"
                  : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
              }`}
            >
              {m === "yearly" ? "By Year" : "Monthly"}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden">
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 z-10">
              <tr className={headerCls}>
                {monthly ? (
                  <>
                    <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wide">#</th>
                    <th className="text-right px-4 py-3 font-semibold text-xs uppercase tracking-wide">Payment</th>
                    <th className="text-right px-4 py-3 font-semibold text-xs uppercase tracking-wide">Principal</th>
                    <th className="text-right px-4 py-3 font-semibold text-xs uppercase tracking-wide">Interest</th>
                    <th className="text-right px-4 py-3 font-semibold text-xs uppercase tracking-wide">Balance</th>
                  </>
                ) : (
                  <>
                    <th className="w-8 px-4 py-3" />
                    <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wide">Year</th>
                    <th className="text-right px-4 py-3 font-semibold text-xs uppercase tracking-wide">Principal</th>
                    <th className="text-right px-4 py-3 font-semibold text-xs uppercase tracking-wide">Interest</th>
                    <th className="text-right px-4 py-3 font-semibold text-xs uppercase tracking-wide">Cum. Interest</th>
                    <th className="text-right px-4 py-3 font-semibold text-xs uppercase tracking-wide">Balance</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
              {monthly
                ? result.schedule.map((row) => (
                    <tr key={row.month} className={`${rowHover} transition-colors`}>
                      <td className="px-4 py-2.5 text-zinc-500 dark:text-zinc-400">{row.month}</td>
                      <td className="px-4 py-2.5 text-right tabular-nums text-zinc-700 dark:text-zinc-300">{currCents(row.payment)}</td>
                      <td className="px-4 py-2.5 text-right tabular-nums text-zinc-700 dark:text-zinc-300">{curr(row.principal)}</td>
                      <td className="px-4 py-2.5 text-right tabular-nums text-zinc-500 dark:text-zinc-400">{curr(row.interest)}</td>
                      <td className="px-4 py-2.5 text-right tabular-nums font-medium text-zinc-900 dark:text-white">{curr(row.balance)}</td>
                    </tr>
                  ))
                : result.years.map((yr) => (
                    <Fragment key={yr.year}>
                      <tr
                        onClick={() => setExpandedYear(expandedYear === yr.year ? null : yr.year)}
                        className={`cursor-pointer ${rowHover} transition-colors`}
                      >
                        <td className="px-4 py-3 text-zinc-400 text-xs w-8 select-none">
                          {expandedYear === yr.year ? "▾" : "▸"}
                        </td>
                        <td className="px-4 py-3 font-medium text-zinc-900 dark:text-white">Year {yr.year}</td>
                        <td className="px-4 py-3 text-right tabular-nums text-zinc-700 dark:text-zinc-300">{curr(yr.principal)}</td>
                        <td className="px-4 py-3 text-right tabular-nums text-zinc-500 dark:text-zinc-400">{curr(yr.interest)}</td>
                        <td className="px-4 py-3 text-right tabular-nums text-zinc-400 dark:text-zinc-500 text-xs">{curr(yr.cumInterest)}</td>
                        <td className="px-4 py-3 text-right tabular-nums font-medium text-zinc-900 dark:text-white">{curr(yr.endBalance)}</td>
                      </tr>
                      {expandedYear === yr.year &&
                        yr.rows.map((row) => (
                          <tr key={row.month} className={subRowBg}>
                            <td className="px-4 py-2 text-zinc-300 dark:text-zinc-600 text-xs pl-7 select-none">└</td>
                            <td className="px-4 py-2 text-xs text-zinc-500 dark:text-zinc-400">Month {row.month}</td>
                            <td className="px-4 py-2 text-right text-xs tabular-nums text-zinc-500 dark:text-zinc-400">{curr(row.principal)}</td>
                            <td className="px-4 py-2 text-right text-xs tabular-nums text-zinc-500 dark:text-zinc-400">{curr(row.interest)}</td>
                            <td className="px-4 py-2 text-right text-xs tabular-nums text-zinc-400 dark:text-zinc-500">{curr(row.cumInterest)}</td>
                            <td className="px-4 py-2 text-right text-xs tabular-nums text-zinc-500 dark:text-zinc-400">{curr(row.balance)}</td>
                          </tr>
                        ))}
                    </Fragment>
                  ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 sticky bottom-0">
                {monthly ? (
                  <>
                    <td className="px-4 py-3 font-bold text-zinc-900 dark:text-white text-xs uppercase">Total</td>
                    <td className="px-4 py-3 text-right tabular-nums font-bold text-zinc-900 dark:text-white">{curr(result.totalPaid)}</td>
                    <td className="px-4 py-3 text-right tabular-nums font-bold text-zinc-900 dark:text-white">{curr(result.totalPaid - result.totalInterest)}</td>
                    <td className="px-4 py-3 text-right tabular-nums font-bold text-zinc-900 dark:text-white">{curr(result.totalInterest)}</td>
                    <td className="px-4 py-3 text-right text-zinc-400">$0</td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-3" />
                    <td className="px-4 py-3 font-bold text-zinc-900 dark:text-white text-xs uppercase">Total</td>
                    <td className="px-4 py-3 text-right tabular-nums font-bold text-zinc-900 dark:text-white">{curr(result.totalPaid - result.totalInterest)}</td>
                    <td className="px-4 py-3 text-right tabular-nums font-bold text-zinc-900 dark:text-white">{curr(result.totalInterest)}</td>
                    <td className="px-4 py-3 text-right text-zinc-400">—</td>
                    <td className="px-4 py-3 text-right text-zinc-400">$0</td>
                  </>
                )}
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Compare Table (year-by-year side-by-side) ─────────────────────────────────

function CompareTable({
  a,
  b,
  labelA,
  labelB,
}: {
  a: Result;
  b: Result;
  labelA: string;
  labelB: string;
}) {
  const [expandedYear, setExpandedYear] = useState<number | null>(null);
  const maxYears = Math.max(a.years.length, b.years.length);

  return (
    <div className="rounded-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden">
      <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-10 bg-zinc-50 dark:bg-zinc-900">
            {/* Scenario label row */}
            <tr className="border-b border-zinc-100 dark:border-zinc-800">
              <th className="px-4 py-2" colSpan={2} />
              <th
                className="px-4 py-2 text-center text-xs font-bold uppercase tracking-wide text-emerald-600 dark:text-emerald-400 border-l border-zinc-100 dark:border-zinc-800"
                colSpan={3}
              >
                {labelA}
              </th>
              <th
                className="px-4 py-2 text-center text-xs font-bold uppercase tracking-wide text-sky-600 dark:text-sky-400 border-l border-zinc-100 dark:border-zinc-800"
                colSpan={3}
              >
                {labelB}
              </th>
              <th className="px-4 py-2 border-l border-zinc-100 dark:border-zinc-800" />
            </tr>
            {/* Column label row */}
            <tr>
              <th className="w-8 px-4 py-2" />
              <th className="text-left px-4 py-2 font-semibold text-xs uppercase tracking-wide text-zinc-500">Year</th>
              <th className="text-right px-4 py-2 font-semibold text-xs uppercase tracking-wide text-emerald-600 dark:text-emerald-400 border-l border-zinc-100 dark:border-zinc-800">
                Principal
              </th>
              <th className="text-right px-4 py-2 font-semibold text-xs uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
                Interest
              </th>
              <th className="text-right px-4 py-2 font-semibold text-xs uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
                Balance
              </th>
              <th className="text-right px-4 py-2 font-semibold text-xs uppercase tracking-wide text-sky-600 dark:text-sky-400 border-l border-zinc-100 dark:border-zinc-800">
                Principal
              </th>
              <th className="text-right px-4 py-2 font-semibold text-xs uppercase tracking-wide text-sky-600 dark:text-sky-400">
                Interest
              </th>
              <th className="text-right px-4 py-2 font-semibold text-xs uppercase tracking-wide text-sky-600 dark:text-sky-400">
                Balance
              </th>
              <th className="text-right px-4 py-2 font-semibold text-xs uppercase tracking-wide text-zinc-400 border-l border-zinc-100 dark:border-zinc-800">
                Cum. Saved
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
            {Array.from({ length: maxYears }, (_, i) => {
              const ya = a.years[i];
              const yb = b.years[i];
              const yearNum = i + 1;
              const cumSaved = (ya?.cumInterest ?? a.totalInterest) - (yb?.cumInterest ?? b.totalInterest);
              const isExpanded = expandedYear === yearNum;
              const monthsA = ya?.rows ?? [];
              const monthsB = yb?.rows ?? [];
              const monthCount = Math.max(monthsA.length, monthsB.length);

              const paidOffCell = <span className="text-zinc-300 dark:text-zinc-600 italic text-xs">paid off</span>;
              const dashCell    = <span className="text-zinc-300 dark:text-zinc-600">—</span>;

              return (
                <Fragment key={yearNum}>
                  <tr
                    onClick={() => setExpandedYear(isExpanded ? null : yearNum)}
                    className="cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-zinc-400 text-xs select-none">{isExpanded ? "▾" : "▸"}</td>
                    <td className="px-4 py-3 font-medium text-zinc-900 dark:text-white">Year {yearNum}</td>
                    {/* Scenario A */}
                    <td className="px-4 py-3 text-right tabular-nums text-zinc-700 dark:text-zinc-300 border-l border-zinc-100 dark:border-zinc-800">
                      {ya ? curr(ya.principal) : dashCell}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-zinc-500 dark:text-zinc-400">
                      {ya ? curr(ya.interest) : paidOffCell}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-zinc-700 dark:text-zinc-300">
                      {ya ? curr(ya.endBalance) : dashCell}
                    </td>
                    {/* Scenario B */}
                    <td className="px-4 py-3 text-right tabular-nums text-zinc-700 dark:text-zinc-300 border-l border-zinc-100 dark:border-zinc-800">
                      {yb ? curr(yb.principal) : dashCell}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-zinc-500 dark:text-zinc-400">
                      {yb ? curr(yb.interest) : paidOffCell}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-zinc-700 dark:text-zinc-300">
                      {yb ? curr(yb.endBalance) : dashCell}
                    </td>
                    {/* Cum. saved */}
                    <td
                      className={`px-4 py-3 text-right tabular-nums font-semibold border-l border-zinc-100 dark:border-zinc-800 ${
                        cumSaved > 0
                          ? "text-sky-600 dark:text-sky-400"
                          : cumSaved < 0
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-zinc-400"
                      }`}
                    >
                      {cumSaved > 0 && "B +"}{cumSaved < 0 && "A +"}{curr(Math.abs(cumSaved))}
                    </td>
                  </tr>
                  {isExpanded &&
                    Array.from({ length: monthCount }, (_, mi) => {
                      const ra = monthsA[mi];
                      const rb = monthsB[mi];
                      return (
                        <tr key={`${yearNum}-${mi}`} className="bg-zinc-50/50 dark:bg-zinc-800/20">
                          <td className="px-4 py-2 text-zinc-300 dark:text-zinc-600 text-xs pl-7 select-none">└</td>
                          <td className="px-4 py-2 text-xs text-zinc-400">Month {i * 12 + mi + 1}</td>
                          <td className="px-4 py-2 text-right text-xs tabular-nums text-zinc-500 dark:text-zinc-400 border-l border-zinc-100 dark:border-zinc-800">
                            {ra ? curr(ra.principal) : "—"}
                          </td>
                          <td className="px-4 py-2 text-right text-xs tabular-nums text-zinc-500 dark:text-zinc-400">
                            {ra ? curr(ra.interest) : "—"}
                          </td>
                          <td className="px-4 py-2 text-right text-xs tabular-nums text-zinc-500 dark:text-zinc-400">
                            {ra ? curr(ra.balance) : "—"}
                          </td>
                          <td className="px-4 py-2 text-right text-xs tabular-nums text-zinc-500 dark:text-zinc-400 border-l border-zinc-100 dark:border-zinc-800">
                            {rb ? curr(rb.principal) : "—"}
                          </td>
                          <td className="px-4 py-2 text-right text-xs tabular-nums text-zinc-500 dark:text-zinc-400">
                            {rb ? curr(rb.interest) : "—"}
                          </td>
                          <td className="px-4 py-2 text-right text-xs tabular-nums text-zinc-500 dark:text-zinc-400">
                            {rb ? curr(rb.balance) : "—"}
                          </td>
                          <td className="px-4 py-2 text-right text-xs text-zinc-400 border-l border-zinc-100 dark:border-zinc-800">—</td>
                        </tr>
                      );
                    })}
                </Fragment>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 sticky bottom-0">
              <td className="px-4 py-3" />
              <td className="px-4 py-3 font-bold text-zinc-900 dark:text-white text-xs uppercase">Total</td>
              {/* Scenario A totals */}
              <td className="px-4 py-3 text-right tabular-nums font-bold text-emerald-600 dark:text-emerald-400 border-l border-zinc-200 dark:border-zinc-700">
                {curr(a.totalPaid - a.totalInterest)}
              </td>
              <td className="px-4 py-3 text-right tabular-nums font-bold text-emerald-600 dark:text-emerald-400">
                {curr(a.totalInterest)}
              </td>
              <td className="px-4 py-3 text-right text-zinc-400">$0</td>
              {/* Scenario B totals */}
              <td className="px-4 py-3 text-right tabular-nums font-bold text-sky-600 dark:text-sky-400 border-l border-zinc-200 dark:border-zinc-700">
                {curr(b.totalPaid - b.totalInterest)}
              </td>
              <td className="px-4 py-3 text-right tabular-nums font-bold text-sky-600 dark:text-sky-400">
                {curr(b.totalInterest)}
              </td>
              <td className="px-4 py-3 text-right text-zinc-400">$0</td>
              {/* Savings */}
              <td
                className={`px-4 py-3 text-right tabular-nums font-bold border-l border-zinc-200 dark:border-zinc-700 ${
                  a.totalInterest > b.totalInterest
                    ? "text-sky-600 dark:text-sky-400"
                    : "text-emerald-600 dark:text-emerald-400"
                }`}
              >
                {curr(Math.abs(a.totalInterest - b.totalInterest))} saved
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

type TableTab = "compare" | "a" | "b";
const BLANK: Inputs = { label: "", loanAmount: "", rate: "", termYears: "30", extraPayment: "" };

export default function AmortizationPage() {
  const [a, setA] = useState<Inputs>(BLANK);
  const [b, setB] = useState<Inputs>({ ...BLANK });
  const [tab, setTab] = useState<TableTab>("compare");

  const ra = useMemo(() => compute(a), [a]);
  const rb = useMemo(() => compute(b), [b]);
  const hasBoth = !!ra && !!rb;
  const hasAny  = !!ra || !!rb;

  const labelA = a.label || "Scenario A";
  const labelB = b.label || "Scenario B";

  const tabs = [
    ...(hasBoth ? [{ id: "compare" as TableTab, label: "Year-by-Year" }] : []),
    ...(ra       ? [{ id: "a"       as TableTab, label: labelA         }] : []),
    ...(rb       ? [{ id: "b"       as TableTab, label: labelB         }] : []),
  ];

  return (
    <div className="flex flex-col min-h-full bg-white dark:bg-zinc-950 font-[family-name:var(--font-geist-sans)]">
      <Header backLink={{ href: "/#calculators", label: "All Calculators" }} />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-10 flex flex-col gap-10">

        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Amortization Comparison</h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1.5">
            Build two loan scenarios side by side — compare interest costs, payoff timelines, and month-by-month breakdowns.
          </p>
        </div>

        {/* Input panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <InputPanel inputs={a} onChange={setA} variant="a" />
          <InputPanel inputs={b} onChange={setB} variant="b" />
        </div>

        {/* Both scenarios — comparison banner */}
        {hasBoth && <ComparisonBanner a={ra!} b={rb!} />}

        {/* Single scenario summary strip */}
        {ra && !rb && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20">
            {[
              { label: "Monthly Payment", value: currCents(ra.monthlyPayment) },
              { label: "Total Interest",  value: curr(ra.totalInterest) },
              { label: "Total Paid",      value: curr(ra.totalPaid) },
              { label: "Payoff",          value: fmtMonths(ra.payoffMonths) },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide mb-1">{label}</p>
                <p className="text-lg font-bold text-emerald-700 dark:text-emerald-400">{value}</p>
              </div>
            ))}
          </div>
        )}
        {rb && !ra && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 rounded-2xl border border-sky-200 dark:border-sky-800 bg-sky-50/40 dark:bg-sky-950/20">
            {[
              { label: "Monthly Payment", value: currCents(rb.monthlyPayment) },
              { label: "Total Interest",  value: curr(rb.totalInterest) },
              { label: "Total Paid",      value: curr(rb.totalPaid) },
              { label: "Payoff",          value: fmtMonths(rb.payoffMonths) },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide mb-1">{label}</p>
                <p className="text-lg font-bold text-sky-700 dark:text-sky-400">{value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Table section */}
        {hasAny && (
          <div className="flex flex-col gap-4">
            <div className="inline-flex rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 p-1 gap-1 self-start flex-wrap">
              {tabs.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-150 ${
                    tab === id
                      ? id === "b"
                        ? "bg-sky-600 text-white shadow-sm"
                        : "bg-emerald-600 text-white shadow-sm"
                      : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {tab === "compare" && hasBoth && (
              <CompareTable a={ra!} b={rb!} labelA={labelA} labelB={labelB} />
            )}
            {tab === "a" && ra && <ScheduleTable result={ra} variant="a" />}
            {tab === "b" && rb && <ScheduleTable result={rb} variant="b" />}
          </div>
        )}

        {/* Download */}
        {hasAny && (
          <div className="flex flex-col items-center gap-2 pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <p className="text-xs text-zinc-400 dark:text-zinc-500">
              Save a clean PDF to share with your client or underwriter.
            </p>
            <DownloadPDFButton
              filename="amortization-comparison.pdf"
              document={
                <AmortizationPDF
                  inputsA={a}
                  resultA={ra ? { monthlyPayment: ra.monthlyPayment, totalInterest: ra.totalInterest, totalPaid: ra.totalPaid, payoffMonths: ra.payoffMonths, years: ra.years } : null}
                  inputsB={b}
                  resultB={rb ? { monthlyPayment: rb.monthlyPayment, totalInterest: rb.totalInterest, totalPaid: rb.totalPaid, payoffMonths: rb.payoffMonths, years: rb.years } : null}
                  logoSrc={typeof window !== "undefined" ? `${window.location.origin}/logo.png` : ""}
                />
              }
            />
          </div>
        )}

      </main>
    </div>
  );
}
