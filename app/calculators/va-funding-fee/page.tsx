"use client";

import { useState, useMemo, type ReactNode } from "react";
import { Header } from "../../components/Header";

// ─── VA Funding Fee Rates — 38 U.S.C. § 3729 ─────────────────────────────────
// Effective Jan 1, 2020 (Blue Water Navy Vietnam Veterans Act)
// Rates are a percentage of the loan amount; may be financed into the loan.

type LoanType = "purchase" | "cashout" | "irrrl" | "mfghome" | "assumption";
type Usage    = "first" | "subsequent";
type DownTier = "none"  | "5"    | "10";

function getRate(loanType: LoanType, usage: Usage, downTier: DownTier): number {
  if (loanType === "irrrl" || loanType === "assumption") return 0.005;
  if (loanType === "mfghome") return 0.01;
  if (loanType === "cashout") return usage === "first" ? 0.0215 : 0.033;
  // Purchase
  if (downTier === "10") return 0.0125;
  if (downTier === "5")  return 0.015;
  return usage === "first" ? 0.0215 : 0.033;
}

const fmt = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

const fmtPct = (n: number) => (n * 100).toFixed(2) + "%";

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

function TogglePill({
  options,
  value,
  onChange,
  grid,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
  grid?: boolean;
}) {
  const oddCount = grid && options.length % 2 !== 0;
  return (
    <div className={grid ? "grid grid-cols-2 gap-2" : "flex gap-2"}>
      {options.map((o, i) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={`py-2.5 px-3 rounded-xl text-sm font-semibold border transition-colors text-center${
            !grid ? " flex-1" : ""
          }${
            oddCount && i === options.length - 1 ? " col-span-2" : ""
          } ${
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

function RRow({
  label, value, sub, highlight, large, topBorder,
}: {
  label: string; value: string; sub?: string;
  highlight?: boolean; large?: boolean; topBorder?: boolean;
}) {
  return (
    <div className={`flex items-start justify-between gap-4 py-2.5 ${topBorder ? "border-t border-zinc-100 dark:border-zinc-800" : ""}`}>
      <span className={`leading-snug font-medium text-zinc-600 dark:text-zinc-300 ${large ? "text-base" : "text-sm"}`}>
        {label}
        {sub && <span className="block text-xs text-zinc-400 dark:text-zinc-500 font-normal mt-0.5">{sub}</span>}
      </span>
      <span className={`font-bold whitespace-nowrap shrink-0 ${large ? "text-xl" : "text-base"} ${
        highlight ? "text-emerald-600 dark:text-emerald-400" : "text-zinc-900 dark:text-white"
      }`}>
        {value}
      </span>
    </div>
  );
}

// ─── Rate reference data ───────────────────────────────────────────────────────

const RATE_TABLE = [
  { label: "Purchase · < 5% down",    first: "2.15%", sub: "3.30%" },
  { label: "Purchase · 5–9.99% down", first: "1.50%", sub: "1.50%" },
  { label: "Purchase · 10%+ down",    first: "1.25%", sub: "1.25%" },
  { label: "Cash-Out Refinance",       first: "2.15%", sub: "3.30%" },
  { label: "IRRRL",                    first: "0.50%", sub: "0.50%" },
  { label: "Manufactured Home",        first: "1.00%", sub: "1.00%" },
  { label: "Assumption",               first: "0.50%", sub: "0.50%" },
];

// ─── Main ──────────────────────────────────────────────────────────────────────

export default function VAFundingFeePage() {
  const [exempt,   setExempt]   = useState<"no" | "yes">("no");
  const [loanType, setLoanType] = useState<LoanType>("purchase");
  const [usage,    setUsage]    = useState<Usage>("first");
  const [downTier, setDownTier] = useState<DownTier>("none");
  const [loanAmt,  setLoanAmt]  = useState("");

  const showUsage = loanType !== "irrrl" && loanType !== "assumption";
  const showDown  = loanType === "purchase";

  const result = useMemo(() => {
    const base = parseFloat(loanAmt.replace(/,/g, "")) || 0;
    if (exempt === "yes") return { rate: 0, fee: 0, financed: base, base };
    const rate = getRate(loanType, usage, showDown ? downTier : "none");
    const fee  = base * rate;
    return { rate, fee, financed: base + fee, base };
  }, [exempt, loanType, usage, downTier, showDown, loanAmt]);

  const hasAmount = result.base > 0;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Header />
      <main className="max-w-lg mx-auto px-4 py-10 flex flex-col gap-8">

        {/* Title */}
        <div>
          <a
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 mb-4 transition-colors"
          >
            ← Back to Calculators
          </a>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">VA Funding Fee</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Determine the funding fee based on loan type, usage, and down payment.
          </p>
        </div>

        {/* Inputs */}
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 flex flex-col gap-5">

          {/* Exempt */}
          <Field
            label="Funding Fee Exemption?"
            hint="Veterans receiving VA disability compensation, surviving spouses of veterans who died in service or from a service-connected disability, and active-duty Purple Heart recipients pay no funding fee."
          >
            <TogglePill
              options={[
                { value: "no",  label: "Not Exempt" },
                { value: "yes", label: "Exempt" },
              ]}
              value={exempt}
              onChange={v => setExempt(v as "no" | "yes")}
            />
          </Field>

          {exempt === "no" && (
            <>
              {/* Loan Type */}
              <Field label="Loan Type">
                <TogglePill
                  grid
                  options={[
                    { value: "purchase",   label: "Purchase" },
                    { value: "cashout",    label: "Cash-Out Refinance" },
                    { value: "irrrl",      label: "IRRRL" },
                    { value: "mfghome",    label: "Manufactured Home" },
                    { value: "assumption", label: "Assumption" },
                  ]}
                  value={loanType}
                  onChange={v => setLoanType(v as LoanType)}
                />
              </Field>

              {/* First / Subsequent Use */}
              {showUsage && (
                <Field label="VA Loan Usage">
                  <TogglePill
                    options={[
                      { value: "first",      label: "First Use" },
                      { value: "subsequent", label: "Subsequent Use" },
                    ]}
                    value={usage}
                    onChange={v => setUsage(v as Usage)}
                  />
                </Field>
              )}

              {/* Down Payment Tier */}
              {showDown && (
                <Field label="Down Payment">
                  <TogglePill
                    options={[
                      { value: "none", label: "< 5%" },
                      { value: "5",    label: "5–9.99%" },
                      { value: "10",   label: "10%+" },
                    ]}
                    value={downTier}
                    onChange={v => setDownTier(v as DownTier)}
                  />
                </Field>
              )}
            </>
          )}

          {/* Loan Amount */}
          <Field label="Loan Amount">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base text-zinc-400 pointer-events-none">$</span>
              <input
                type="text"
                inputMode="numeric"
                className={INPUT_CLS + " pl-7"}
                value={loanAmt}
                onChange={e => setLoanAmt(e.target.value.replace(/[^0-9.]/g, ""))}
                placeholder="300,000"
              />
            </div>
          </Field>
        </div>

        {/* Result */}
        <div className={`rounded-2xl border p-6 ${
          exempt === "yes"
            ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-950/20"
            : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-zinc-900 dark:text-white text-base">Result</h2>
            {exempt === "yes" && (
              <span className="text-xs font-bold bg-emerald-600 text-white px-3 py-1 rounded-full">
                Exempt — $0
              </span>
            )}
          </div>

          {exempt === "yes" ? (
            <p className="text-sm text-emerald-700 dark:text-emerald-400 leading-relaxed">
              This borrower qualifies for a funding fee exemption under 38 U.S.C. § 3729(c). No funding fee is due at closing or financed into the loan.
            </p>
          ) : (
            <div className="flex flex-col">
              <RRow label="Funding Fee Rate" value={fmtPct(result.rate)} large />
              <RRow label="Funding Fee"      value={hasAmount ? fmt(result.fee)      : "—"} highlight large topBorder />
              <RRow
                label="Total Loan (fee financed)"
                value={hasAmount ? fmt(result.financed) : "—"}
                sub="Fee rolled into loan balance"
                topBorder
              />
            </div>
          )}

          <p className="mt-4 text-xs text-zinc-400 dark:text-zinc-500 italic border-t border-zinc-100 dark:border-zinc-800 pt-3">
            38 U.S.C. § 3729 — Rates effective Jan 1, 2020 (Blue Water Navy Vietnam Veterans Act). The funding fee may be financed in full for all loan types.
          </p>
        </div>

        {/* Rate Reference Table */}
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
          <h3 className="font-semibold text-zinc-900 dark:text-white mb-4">Rate Reference</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-100 dark:border-zinc-800">
                  <th className="text-left py-2 px-1 text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">Loan Type</th>
                  <th className="text-right py-2 px-1 text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">First Use</th>
                  <th className="text-right py-2 px-1 text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">Subsequent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/60">
                {RATE_TABLE.map(row => (
                  <tr key={row.label}>
                    <td className="py-2.5 px-1 text-sm text-zinc-600 dark:text-zinc-300">{row.label}</td>
                    <td className="py-2.5 px-1 text-right text-sm font-semibold text-zinc-900 dark:text-white tabular-nums">{row.first}</td>
                    <td className="py-2.5 px-1 text-right text-sm font-semibold text-zinc-900 dark:text-white tabular-nums">{row.sub}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}
