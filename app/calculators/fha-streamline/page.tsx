"use client";

import { useState, useMemo, type ReactNode } from "react";
import { Header } from "../../components/Header";

// ─── Pure helpers ─────────────────────────────────────────────────────────────

// HUD UFMIP refund schedule: 80% at month 1, −2%/month, 0% after month 36
function calcUFMIPRefundPct(months: number): number {
  if (months < 1 || months > 36) return 0;
  return (82 - months * 2) / 100;
}

// FHA annual MIP per HUD ML 2023-04
function calcNewMIPRate(ltv: number, baseLoan: number, term: number): number {
  const jumbo = baseLoan > 726200;
  if (term > 15) {
    if (!jumbo) return ltv > 95 ? 0.0055 : 0.005;
    return ltv > 95 ? 0.0075 : 0.007;
  }
  if (!jumbo) {
    if (ltv <= 78) return 0.0015;
    if (ltv <= 90) return 0.004;
    return 0.0065;
  }
  if (ltv <= 78) return 0.0015;
  if (ltv <= 90) return 0.0065;
  return 0.009;
}

type LoanTypeChange = "fixed-fixed" | "arm-fixed" | "fixed-arm" | "arm-arm";

// NTB: new combined rate must be ≤ (old combined rate + threshold)
// i.e. combinedDelta (new - old) must be ≤ threshold
const NTB_THRESHOLD: Record<LoanTypeChange, number> = {
  "fixed-fixed": -0.005,  // must decrease ≥ 0.50%
  "arm-fixed":    0.02,   // can increase up to 2.00%
  "fixed-arm":   -0.02,   // must decrease ≥ 2.00%
  "arm-arm":     -0.01,   // must decrease ≥ 1.00%
};

const NTB_REQUIREMENT: Record<LoanTypeChange, string> = {
  "fixed-fixed": "Must decrease ≥ 0.50%",
  "arm-fixed":   "Can increase up to 2.00%",
  "fixed-arm":   "Must decrease ≥ 2.00%",
  "arm-arm":     "Must decrease ≥ 1.00%",
};

const NTB_TYPE_LABEL: Record<LoanTypeChange, string> = {
  "fixed-fixed": "Fixed → Fixed",
  "arm-fixed":   "ARM → Fixed",
  "fixed-arm":   "Fixed → ARM",
  "arm-arm":     "ARM → ARM",
};

const fmt    = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const fmtPct = (n: number, d = 3) => (n * 100).toFixed(d) + "%";
const pn     = (s: string) => parseFloat(s.replace(/,/g, "")) || 0;

// ─── Sub-components (all at module scope to prevent remount-on-render) ────────

const CLS = "w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2.5 text-base text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500";

function DollarInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-zinc-400 pointer-events-none">$</span>
      <input
        type="text"
        inputMode="numeric"
        className={CLS + " pl-6"}
        value={value}
        onChange={e => onChange(e.target.value.replace(/[^0-9.]/g, ""))}
        placeholder={placeholder ?? "0"}
      />
    </div>
  );
}

function PctInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="relative">
      <input
        type="text"
        inputMode="decimal"
        className={CLS + " pr-6"}
        value={value}
        onChange={e => onChange(e.target.value.replace(/[^0-9.]/g, ""))}
        placeholder={placeholder ?? "0.000"}
      />
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-zinc-400 pointer-events-none">%</span>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-zinc-400 dark:text-zinc-500">{hint}</p>}
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
          className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
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
  label, value, sub, highlight, indent, topBorder,
}: {
  label: string; value: string; sub?: string;
  highlight?: boolean; indent?: boolean; topBorder?: boolean;
}) {
  return (
    <div className={`flex items-start justify-between gap-4 py-2 ${topBorder ? "border-t border-zinc-100 dark:border-zinc-800" : ""}`}>
      <span className={`text-sm leading-snug ${indent ? "pl-3 text-zinc-500 dark:text-zinc-400" : "font-medium text-zinc-700 dark:text-zinc-300"}`}>
        {label}
        {sub && <span className="block text-xs text-zinc-400 dark:text-zinc-500 font-normal mt-0.5">{sub}</span>}
      </span>
      <span className={`text-sm font-semibold whitespace-nowrap shrink-0 ${highlight ? "text-emerald-600 dark:text-emerald-400" : "text-zinc-900 dark:text-white"}`}>
        {value}
      </span>
    </div>
  );
}

function Card({ title, badge, cite, children }: {
  title: string; badge?: ReactNode; cite?: string; children: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-zinc-900 dark:text-white">{title}</h3>
        {badge}
      </div>
      {children}
      {cite && (
        <p className="mt-4 text-xs text-zinc-400 dark:text-zinc-500 italic border-t border-zinc-100 dark:border-zinc-800 pt-3">{cite}</p>
      )}
    </div>
  );
}

function StatusBadge({ pass }: { pass: boolean }) {
  return (
    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
      pass
        ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400"
        : "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400"
    }`}>
      {pass ? "✓ Pass" : "✗ Fail"}
    </span>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

const TERM_OPTIONS = [30, 25, 20, 15, 10] as const;
const LOAN_TYPE_OPTIONS = [
  { value: "fixed", label: "Fixed" },
  { value: "arm",   label: "ARM"   },
];

export default function FHAStreamlinePage() {
  // Existing loan
  const [origLoan,     setOrigLoan]     = useState("");
  const [origAppraisal,setOrigAppraisal]= useState("");
  const [closingDate,  setClosingDate]  = useState("");
  const [currBalance,  setCurrBalance]  = useState("");
  const [paymentsMade, setPaymentsMade] = useState("");
  const [currRate,     setCurrRate]     = useState("");
  const [currLoanType, setCurrLoanType] = useState<"fixed" | "arm">("fixed");
  const [currMIPRate,  setCurrMIPRate]  = useState("");
  // New loan
  const [newRate,      setNewRate]      = useState("");
  const [newTerm,      setNewTerm]      = useState<number>(30);
  const [newLoanType,  setNewLoanType]  = useState<"fixed" | "arm">("fixed");

  const r = useMemo(() => {
    const origLoanN  = pn(origLoan);
    const origAppN   = pn(origAppraisal);
    const currBalN   = pn(currBalance);
    const currRateN  = parseFloat(currRate)    / 100 || 0;
    const currMIPN   = parseFloat(currMIPRate) / 100 || 0;
    const newRateN   = parseFloat(newRate)     / 100 || 0;
    const pmtsMade   = parseInt(paymentsMade)  || 0;

    // Months elapsed & first payment date
    let monthsElapsed         = 0;
    let firstPaymentDate: Date | null = null;
    let daysSinceFirstPayment = 0;

    if (closingDate) {
      const closing = new Date(closingDate + "T12:00:00");
      const today   = new Date();
      monthsElapsed = (today.getFullYear() - closing.getFullYear()) * 12
                    + (today.getMonth()    - closing.getMonth());
      // First payment = 1st of the 2nd calendar month after closing
      // e.g. close April 15 → first payment June 1
      firstPaymentDate = new Date(closing.getFullYear(), closing.getMonth() + 2, 1);
      daysSinceFirstPayment = Math.floor(
        (today.getTime() - firstPaymentDate.getTime()) / 86400000,
      );
    }

    // UFMIP refund
    const origUFMIP      = origLoanN * 0.0175;
    const refundPct      = calcUFMIPRefundPct(monthsElapsed);
    const ufmipRefundRaw = origUFMIP * refundPct;

    // Max base loan
    const baseLimit = origLoanN > 0 && currBalN > 0
      ? Math.min(origLoanN, currBalN)
      : origLoanN || currBalN;
    const newUFMIP        = baseLimit * 0.0175;
    // Refund is applied as a credit toward the new UFMIP only; excess is not returned
    const effectiveRefund = Math.min(ufmipRefundRaw, newUFMIP);
    const netUFMIP        = Math.max(0, newUFMIP - effectiveRefund);
    const totalLoan       = baseLimit + netUFMIP;

    // LTV & new annual MIP rate
    const ltv        = origAppN > 0 && origLoanN > 0 ? (origLoanN / origAppN) * 100 : 0;
    const newMIPRate = ltv > 0 ? calcNewMIPRate(ltv, baseLimit, newTerm) : 0;

    // Seasoning
    const daysMet      = daysSinceFirstPayment >= 210;
    const paymentsMet  = pmtsMade >= 6;
    const seasoningPass = daysMet && paymentsMet;

    // Net Tangible Benefit
    const loanTypeChange: LoanTypeChange =
      currLoanType === "fixed" && newLoanType === "fixed" ? "fixed-fixed"
      : currLoanType === "arm" && newLoanType === "fixed" ? "arm-fixed"
      : currLoanType === "fixed" && newLoanType === "arm" ? "fixed-arm"
      : "arm-arm";

    const currCombined  = currRateN + currMIPN;
    const newCombined   = newRateN  + newMIPRate;
    const combinedDelta = newCombined - currCombined;
    const ntbThresh     = NTB_THRESHOLD[loanTypeChange];
    const ntbPass       = combinedDelta <= ntbThresh;

    return {
      origUFMIP, refundPct, ufmipRefundRaw, effectiveRefund,
      baseLimit, newUFMIP, netUFMIP, totalLoan,
      ltv, newMIPRate,
      monthsElapsed, firstPaymentDate, daysSinceFirstPayment,
      daysMet, paymentsMet, seasoningPass,
      loanTypeChange, currCombined, newCombined, combinedDelta, ntbThresh, ntbPass,
    };
  }, [origLoan, origAppraisal, closingDate, currBalance, paymentsMade,
      currRate, currLoanType, currMIPRate, newRate, newTerm, newLoanType]);

  const hasBase  = !!(pn(origLoan) || pn(currBalance));
  const hasRates = !!(currRate && currMIPRate && newRate);

  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-10">

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">FHA Streamline Refinance</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Max loan amount, UFMIP refund credit, seasoning eligibility, and net tangible benefit — all in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6 items-start">

          {/* ── Input panels ─────────────────────────────────────── */}
          <div className="flex flex-col gap-5">

            {/* Existing FHA Loan */}
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
              <h2 className="font-semibold text-zinc-900 dark:text-white mb-4">Existing FHA Loan</h2>
              <div className="flex flex-col gap-4">

                <Field label="Original Base Loan Amount">
                  <DollarInput value={origLoan} onChange={setOrigLoan} placeholder="350,000" />
                </Field>

                <Field label="Original Appraised Value" hint="Used to determine LTV for new MIP rate">
                  <DollarInput value={origAppraisal} onChange={setOrigAppraisal} placeholder="400,000" />
                </Field>

                <Field label="Original Closing Date">
                  <input
                    type="date"
                    className={CLS}
                    value={closingDate}
                    onChange={e => setClosingDate(e.target.value)}
                  />
                </Field>

                <Field label="Current Outstanding Balance">
                  <DollarInput value={currBalance} onChange={setCurrBalance} placeholder="342,000" />
                </Field>

                <Field label="Payments Made">
                  <input
                    type="number"
                    min="0"
                    className={CLS}
                    value={paymentsMade}
                    onChange={e => setPaymentsMade(e.target.value)}
                    placeholder="12"
                  />
                </Field>

                <Field label="Current Note Rate">
                  <PctInput value={currRate} onChange={setCurrRate} placeholder="7.250" />
                </Field>

                <Field label="Current Loan Type">
                  <TogglePill
                    options={LOAN_TYPE_OPTIONS}
                    value={currLoanType}
                    onChange={v => setCurrLoanType(v as "fixed" | "arm")}
                  />
                </Field>

                <Field label="Current Annual MIP Rate">
                  <PctInput value={currMIPRate} onChange={setCurrMIPRate} placeholder="0.550" />
                </Field>

              </div>
            </div>

            {/* New Loan */}
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
              <h2 className="font-semibold text-zinc-900 dark:text-white mb-4">New Loan</h2>
              <div className="flex flex-col gap-4">

                <Field label="New Interest Rate">
                  <PctInput value={newRate} onChange={setNewRate} placeholder="6.250" />
                </Field>

                <Field label="New Loan Term">
                  <div className="flex flex-wrap gap-2">
                    {TERM_OPTIONS.map(t => (
                      <button
                        key={t}
                        onClick={() => setNewTerm(t)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                          newTerm === t
                            ? "bg-emerald-600 text-white border-emerald-600"
                            : "border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-emerald-400"
                        }`}
                      >
                        {t}yr
                      </button>
                    ))}
                  </div>
                </Field>

                <Field label="New Loan Type">
                  <TogglePill
                    options={LOAN_TYPE_OPTIONS}
                    value={newLoanType}
                    onChange={v => setNewLoanType(v as "fixed" | "arm")}
                  />
                </Field>

                {r.newMIPRate > 0 && (
                  <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900 px-3 py-2.5">
                    <p className="text-xs text-emerald-700 dark:text-emerald-400">
                      New Annual MIP:{" "}
                      <span className="font-bold">{fmtPct(r.newMIPRate, 2)}</span>
                      <span className="text-emerald-600/70 dark:text-emerald-500/70 ml-1">
                        · HUD ML 2023-04, LTV {r.ltv.toFixed(1)}%
                      </span>
                    </p>
                  </div>
                )}

              </div>
            </div>

          </div>

          {/* ── Result cards ──────────────────────────────────────── */}
          <div className="flex flex-col gap-5">

            {/* 1. Max Base Loan Amount */}
            <Card
              title="Max Base Loan Amount"
              cite="HUD 4000.1 §II.A.3.b — new base loan may not exceed the lesser of the original loan amount or the outstanding balance. Only the net UFMIP may be added on top; no other closing costs can be rolled in."
            >
              <RRow
                label="Original Loan Amount"
                value={origLoan ? fmt(pn(origLoan)) : "—"}
              />
              <RRow
                label="Current Outstanding Balance"
                value={currBalance ? fmt(pn(currBalance)) : "—"}
              />
              <RRow
                label="Max Base Loan (lesser of above)"
                value={hasBase ? fmt(r.baseLimit) : "—"}
                indent
              />
              <RRow
                label="New UFMIP (1.75% of base)"
                value={hasBase ? fmt(r.newUFMIP) : "—"}
                indent
                topBorder
              />
              <RRow
                label="UFMIP Refund Applied"
                value={hasBase
                  ? r.effectiveRefund > 0
                    ? `– ${fmt(r.effectiveRefund)}`
                    : "$0"
                  : "—"}
                indent
              />
              <RRow
                label="Net UFMIP to Finance"
                value={hasBase ? fmt(r.netUFMIP) : "—"}
                indent
              />
              <RRow
                label="New Total Loan Amount"
                value={hasBase ? fmt(r.totalLoan) : "—"}
                highlight
                topBorder
              />
            </Card>

            {/* 2. UFMIP Refund */}
            <Card
              title="UFMIP Refund"
              cite="Refund schedule: 80% at month 1, −2%/month through month 36, then $0. Applied as a credit toward the new UFMIP only — any excess beyond the new UFMIP is not returned to the borrower."
            >
              <RRow
                label="Original UFMIP Paid (1.75%)"
                value={origLoan ? fmt(r.origUFMIP) : "—"}
              />
              <RRow
                label="Months Since Closing"
                value={closingDate
                  ? `${r.monthsElapsed > 0 ? r.monthsElapsed : "< 1"} month${r.monthsElapsed !== 1 ? "s" : ""}`
                  : "—"}
              />
              <RRow
                label="Refund Percentage"
                value={closingDate ? `${(r.refundPct * 100).toFixed(0)}%` : "—"}
              />
              <RRow
                label="Refund Amount"
                value={origLoan && closingDate ? fmt(r.ufmipRefundRaw) : "—"}
                topBorder
              />
              <RRow
                label="Applied to New UFMIP (capped)"
                value={hasBase && closingDate ? fmt(r.effectiveRefund) : "—"}
                highlight
                indent
              />

              {r.monthsElapsed > 36 && (
                <p className="mt-3 text-xs font-medium text-amber-600 dark:text-amber-400">
                  No refund — original loan is older than 36 months.
                </p>
              )}
              {r.refundPct > 0 && origLoan && r.effectiveRefund > 0 && r.effectiveRefund >= r.newUFMIP && (
                <p className="mt-3 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  Refund fully covers new UFMIP — no UFMIP to finance into the new loan.
                </p>
              )}
            </Card>

            {/* 3. Seasoning */}
            <Card
              title="Seasoning"
              badge={closingDate || paymentsMade
                ? <StatusBadge pass={r.seasoningPass} />
                : undefined}
              cite="HUD 4000.1 §II.A.3.b.ii(A) — both tests must be satisfied simultaneously. First payment date is calculated as the 1st of the 2nd calendar month following closing."
            >
              {/* 210-day test */}
              <div className="flex items-center justify-between gap-4 py-2">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    210 Days from First Payment
                  </p>
                  {r.firstPaymentDate && (
                    <p className="text-xs text-zinc-500 mt-0.5">
                      First payment:{" "}
                      {r.firstPaymentDate.toLocaleDateString("en-US", {
                        month: "short", day: "numeric", year: "numeric",
                      })}
                    </p>
                  )}
                </div>
                {closingDate ? (
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                      {Math.max(0, r.daysSinceFirstPayment)} / 210 days
                    </p>
                    <div className="mt-1">
                      <StatusBadge pass={r.daysMet} />
                    </div>
                  </div>
                ) : (
                  <span className="text-sm text-zinc-400 shrink-0">Enter closing date</span>
                )}
              </div>

              {/* 6-payment test */}
              <div className="flex items-center justify-between gap-4 py-2 border-t border-zinc-100 dark:border-zinc-800">
                <div>
                  <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    6 Monthly Payments Made
                  </p>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    At least 6 payments on the existing FHA loan
                  </p>
                </div>
                {paymentsMade ? (
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                      {paymentsMade} / 6
                    </p>
                    <div className="mt-1">
                      <StatusBadge pass={r.paymentsMet} />
                    </div>
                  </div>
                ) : (
                  <span className="text-sm text-zinc-400 shrink-0">—</span>
                )}
              </div>
            </Card>

            {/* 4. Net Tangible Benefit */}
            <Card
              title="Net Tangible Benefit"
              badge={hasRates ? <StatusBadge pass={r.ntbPass} /> : undefined}
              cite="HUD 4000.1 §II.A.3.b.ii(B) — combined rate = note rate + annual MIP. Thresholds vary by loan type change. New MIP rate is auto-calculated per HUD ML 2023-04 using original LTV."
            >
              {/* Loan type + requirement chip */}
              <div className="inline-flex items-center gap-2 rounded-full bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 text-xs mb-4">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                  {NTB_TYPE_LABEL[r.loanTypeChange]}
                </span>
                <span className="text-zinc-300 dark:text-zinc-600">·</span>
                <span className="text-zinc-500 dark:text-zinc-400">
                  {NTB_REQUIREMENT[r.loanTypeChange]}
                </span>
              </div>

              <RRow
                label="Current Combined Rate"
                sub={`${currRate || "—"}% note  +  ${currMIPRate || "—"}% annual MIP`}
                value={hasRates ? fmtPct(r.currCombined) : "—"}
              />
              <RRow
                label="New Combined Rate"
                sub={`${newRate || "—"}% note  +  ${r.newMIPRate > 0 ? fmtPct(r.newMIPRate, 2) : "—"} annual MIP (auto)`}
                value={newRate && r.newMIPRate > 0 ? fmtPct(r.newCombined) : "—"}
              />

              <div className="flex items-center justify-between gap-4 py-3 mt-1 border-t border-zinc-100 dark:border-zinc-800">
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Net Combined Rate Change
                </span>
                {hasRates ? (
                  <div className="text-right shrink-0">
                    <span className={`text-sm font-semibold ${r.ntbPass ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                      {r.combinedDelta > 0 ? "+" : ""}{fmtPct(r.combinedDelta)}
                    </span>
                    <span className="ml-2 text-xs text-zinc-400">
                      (need ≤ {r.loanTypeChange === "arm-fixed" ? "+2.000%" : `${(r.ntbThresh * 100).toFixed(3)}%`})
                    </span>
                  </div>
                ) : (
                  <span className="text-sm text-zinc-400">—</span>
                )}
              </div>

              {hasRates && !r.ntbPass && (
                <div className="rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900 px-3 py-2.5">
                  <p className="text-xs text-red-600 dark:text-red-400">
                    NTB test fails. The combined rate change of{" "}
                    {r.combinedDelta > 0 ? "+" : ""}{fmtPct(r.combinedDelta)} does not meet the{" "}
                    {NTB_REQUIREMENT[r.loanTypeChange].toLowerCase()} threshold required for{" "}
                    {NTB_TYPE_LABEL[r.loanTypeChange]} streamlines.
                  </p>
                </div>
              )}
              {hasRates && r.ntbPass && (
                <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900 px-3 py-2.5">
                  <p className="text-xs text-emerald-700 dark:text-emerald-400">
                    NTB satisfied. Combined rate drops by{" "}
                    {fmtPct(Math.abs(r.combinedDelta))}, exceeding the{" "}
                    {r.loanTypeChange === "arm-fixed"
                      ? "ARM-to-Fixed benefit threshold"
                      : `${fmtPct(Math.abs(r.ntbThresh))} minimum`}.
                  </p>
                </div>
              )}
            </Card>

          </div>
        </div>
      </main>
    </>
  );
}
