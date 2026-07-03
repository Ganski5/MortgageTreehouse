"use client";

import { useState, useMemo, type ReactNode } from "react";
import { Header } from "../../components/Header";

// ─── Self-Employment Income Analysis ──────────────────────────────────────────
// Fannie Mae B3-3.4-01 → B3-3.4-05
// FHA ML 2014-02 · VA Circular 26-23-07 · USDA HB-1-3555 Ch.9
// Government loans require a full 2-year history; 1-year not permitted.
// Conventional 1-year: allowed only if business ≥ 5 years old (B3-3.2-01).

type FilingType  = "schedule-c" | "1065" | "1120s" | "1120";
type LoanProgram = "conventional" | "government";

// IRS per-mile depreciation component of the standard mileage rate by tax year
const MILEAGE_DEPR_RATE: Record<string, number> = {
  "2025": 0.33,
  "2024": 0.30,
  "2023": 0.28,
  "2022": 0.26,
  "2021": 0.26,
  "2020": 0.27,
  "2019": 0.26,
  "2018": 0.25,
  "2017": 0.25,
};

const TAX_YEARS = ["2025", "2024", "2023"];

interface YearFields {
  taxYear:             string;
  // Schedule C
  netProfit:           string;
  depreciation:        string;
  depletion:           string;
  businessUseHome:     string;
  mileageMiles:        string;
  mileageRate:         string; // auto-filled from taxYear, overridable
  // 1065
  ordinaryIncome:      string;
  guaranteedPayments:  string;
  amortization:        string;
  // 1120S / 1120
  w2Wages:             string;
  // 1120
  pretaxIncome:        string;
  corporateTaxes:      string;
  // All types
  nonRecurringIncome:  string;
  nonRecurringLoss:    string;
}

const EMPTY_YEAR: YearFields = {
  taxYear: "", netProfit: "", depreciation: "", depletion: "", businessUseHome: "",
  mileageMiles: "", mileageRate: "",
  ordinaryIncome: "", guaranteedPayments: "", amortization: "",
  w2Wages: "", pretaxIncome: "", corporateTaxes: "",
  nonRecurringIncome: "", nonRecurringLoss: "",
};

const pn = (s: string) => parseFloat(s.replace(/[^0-9.-]/g, "")) || 0;

function calcAnnual(y: YearFields, filing: FilingType, own: number): number {
  const o = own / 100;
  switch (filing) {
    case "schedule-c":
      return  pn(y.netProfit)
            + pn(y.depreciation)
            + pn(y.depletion)
            + pn(y.businessUseHome)
            + pn(y.mileageMiles) * pn(y.mileageRate)
            - pn(y.nonRecurringLoss)   // Meals & Entertainment deduction
            - pn(y.nonRecurringIncome);
    case "1065":
      // Guaranteed payments are K-1 Box 4 — full amount, not prorated by ownership %
      return  pn(y.guaranteedPayments)
            + (  pn(y.ordinaryIncome)
               + pn(y.depreciation)
               + pn(y.amortization)
               + pn(y.depletion)
               - pn(y.nonRecurringIncome)
               + pn(y.nonRecurringLoss)) * o;
    case "1120s":
      return  pn(y.w2Wages)
            + (  pn(y.ordinaryIncome)
               + pn(y.depreciation)
               + pn(y.amortization)
               + pn(y.depletion)
               - pn(y.nonRecurringIncome)
               + pn(y.nonRecurringLoss)) * o;
    case "1120":
      return  pn(y.w2Wages)
            + (  pn(y.pretaxIncome)
               + pn(y.depreciation)
               + pn(y.amortization)
               - pn(y.corporateTaxes)
               - pn(y.nonRecurringIncome)
               + pn(y.nonRecurringLoss)) * o;
  }
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
        inputMode="decimal"
        className={INPUT_CLS + " pl-7"}
        value={value}
        onChange={e => onChange(e.target.value.replace(/[^0-9.-]/g, ""))}
        placeholder={placeholder ?? "0"}
      />
    </div>
  );
}

function PctInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="relative">
      <input
        type="text"
        inputMode="decimal"
        className={INPUT_CLS + " pr-7"}
        value={value}
        onChange={e => onChange(e.target.value.replace(/[^0-9.]/g, ""))}
        placeholder="100"
      />
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-base text-zinc-400 pointer-events-none">%</span>
    </div>
  );
}

function TogglePill({ options, value, onChange }: {
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

function RRow({ label, value, sub, highlight, topBorder, indent, muted }: {
  label: string; value: string; sub?: string;
  highlight?: boolean; topBorder?: boolean; indent?: boolean; muted?: boolean;
}) {
  return (
    <div className={`flex items-start justify-between gap-4 py-2.5 ${topBorder ? "border-t border-zinc-100 dark:border-zinc-800" : ""}`}>
      <span className={`text-sm leading-snug font-medium ${indent ? "pl-3" : ""} ${muted ? "text-zinc-400 dark:text-zinc-500" : "text-zinc-600 dark:text-zinc-300"}`}>
        {label}
        {sub && <span className="block text-xs text-zinc-400 dark:text-zinc-500 font-normal mt-0.5">{sub}</span>}
      </span>
      <span className={`text-base font-bold whitespace-nowrap shrink-0 ${
        highlight ? "text-emerald-600 dark:text-emerald-400" : muted ? "text-zinc-400 dark:text-zinc-500" : "text-zinc-900 dark:text-white"
      }`}>{value}</span>
    </div>
  );
}

// ─── Math Breakdown ────────────────────────────────────────────────────────────

function BRow({ label, value, op, muted }: {
  label: string; value: number; op: "" | "+" | "−" | "="; muted?: boolean;
}) {
  return (
    <div className={`flex items-baseline justify-between gap-3 py-0.5 ${muted ? "opacity-40" : ""}`}>
      <div className="flex items-baseline gap-2 min-w-0">
        <span className="w-3 text-center text-xs text-zinc-400 dark:text-zinc-500 flex-shrink-0 select-none">{op}</span>
        <span className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{label}</span>
      </div>
      <span className={`text-xs font-semibold tabular-nums flex-shrink-0 ${
        op === "="
          ? "text-emerald-600 dark:text-emerald-400 text-sm"
          : op === "−"
          ? "text-red-500 dark:text-red-400"
          : "text-zinc-700 dark:text-zinc-300"
      }`}>
        {op === "−" ? `(${fmt(Math.abs(value))})` : fmt(value)}
      </span>
    </div>
  );
}

function BreakdownYear({ label, y, filing, own }: {
  label: string; y: YearFields; filing: FilingType; own: number;
}) {
  const o = own / 100;
  const mileAmt = pn(y.mileageMiles) * pn(y.mileageRate);
  const annual = calcAnnual(y, filing, own);

  const lines: { lbl: string; val: number; op: "" | "+" | "−" | "=" }[] = [];

  switch (filing) {
    case "schedule-c":
      lines.push({ lbl: "Net Profit / (Loss) — Line 31", val: pn(y.netProfit), op: "" });
      if (pn(y.depreciation))    lines.push({ lbl: "Depreciation — Line 13",                                                     val: pn(y.depreciation),    op: "+" });
      if (pn(y.depletion))       lines.push({ lbl: "Depletion — Line 12",                                                        val: pn(y.depletion),       op: "+" });
      if (pn(y.businessUseHome)) lines.push({ lbl: "Business Use of Home — Line 30",                                             val: pn(y.businessUseHome), op: "+" });
      if (mileAmt)               lines.push({ lbl: `Mileage Add-Back — ${Number(pn(y.mileageMiles)).toLocaleString()} mi × $${pn(y.mileageRate).toFixed(2)}/mi`, val: mileAmt, op: "+" });
      if (pn(y.nonRecurringLoss))    lines.push({ lbl: "Meals & Entertainment — Line 24b",                                       val: pn(y.nonRecurringLoss),    op: "−" });
      if (pn(y.nonRecurringIncome))  lines.push({ lbl: "Non-Recurring Income",                                                   val: pn(y.nonRecurringIncome),  op: "−" });
      break;
    case "1065": {
      const hasGP = pn(y.guaranteedPayments) > 0;
      if (hasGP) lines.push({ lbl: "Guaranteed Payments — K-1, Box 4 (full amount)", val: pn(y.guaranteedPayments), op: "" });
      lines.push({ lbl: `Ordinary Income — K-1, Box 1 × ${own}%`,             val: pn(y.ordinaryIncome) * o,    op: hasGP ? "+" : "" });
      if (pn(y.depreciation))   lines.push({ lbl: `Depreciation — Form 4562 × ${own}%`,         val: pn(y.depreciation) * o,   op: "+" });
      if (pn(y.amortization))   lines.push({ lbl: `Amortization — K-1, Box 13W × ${own}%`,      val: pn(y.amortization) * o,   op: "+" });
      if (pn(y.depletion))      lines.push({ lbl: `Depletion — K-1, Box 17 × ${own}%`,          val: pn(y.depletion) * o,      op: "+" });
      if (pn(y.nonRecurringLoss))   lines.push({ lbl: `Non-Recurring Loss × ${own}%`,            val: pn(y.nonRecurringLoss) * o,   op: "+" });
      if (pn(y.nonRecurringIncome)) lines.push({ lbl: `Non-Recurring Income × ${own}%`,          val: pn(y.nonRecurringIncome) * o, op: "−" });
      break;
    }
    case "1120s":
      lines.push({ lbl: "W-2 Wages — W-2, Box 1",                                   val: pn(y.w2Wages),             op: "" });
      lines.push({ lbl: `Ordinary Income — K-1, Box 1 × ${own}%`,                   val: pn(y.ordinaryIncome) * o,  op: "+" });
      if (pn(y.depreciation))   lines.push({ lbl: `Depreciation — Form 4562 × ${own}%`,      val: pn(y.depreciation) * o,   op: "+" });
      if (pn(y.amortization))   lines.push({ lbl: `Amortization — K-1, Box 12 × ${own}%`,    val: pn(y.amortization) * o,   op: "+" });
      if (pn(y.depletion))      lines.push({ lbl: `Depletion — K-1, Box 15 × ${own}%`,       val: pn(y.depletion) * o,      op: "+" });
      if (pn(y.nonRecurringLoss))   lines.push({ lbl: `Non-Recurring Loss × ${own}%`,         val: pn(y.nonRecurringLoss) * o,   op: "+" });
      if (pn(y.nonRecurringIncome)) lines.push({ lbl: `Non-Recurring Income × ${own}%`,       val: pn(y.nonRecurringIncome) * o, op: "−" });
      break;
    case "1120":
      lines.push({ lbl: "W-2 Wages — W-2, Box 1",                                    val: pn(y.w2Wages),             op: "" });
      lines.push({ lbl: `Taxable Income — Line 28 × ${own}%`,                         val: pn(y.pretaxIncome) * o,    op: "+" });
      if (pn(y.depreciation))    lines.push({ lbl: `Depreciation — Line 20 / Form 4562 × ${own}%`, val: pn(y.depreciation) * o,   op: "+" });
      if (pn(y.amortization))    lines.push({ lbl: `Amortization — Line 26 × ${own}%`,             val: pn(y.amortization) * o,   op: "+" });
      if (pn(y.corporateTaxes))  lines.push({ lbl: `Corporate Taxes — Line 31 × ${own}%`,          val: pn(y.corporateTaxes) * o, op: "−" });
      if (pn(y.nonRecurringLoss))    lines.push({ lbl: `Non-Recurring Loss × ${own}%`,              val: pn(y.nonRecurringLoss) * o,   op: "+" });
      if (pn(y.nonRecurringIncome))  lines.push({ lbl: `Non-Recurring Income × ${own}%`,            val: pn(y.nonRecurringIncome) * o, op: "−" });
      break;
  }

  return (
    <div>
      <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-2">{label}</p>
      <div className="flex flex-col">
        {lines.map((l, i) => <BRow key={i} label={l.lbl} value={l.val} op={l.op} />)}
        <div className="border-t border-zinc-200 dark:border-zinc-700 mt-1.5 pt-1.5">
          <BRow label="Annual Qualifying Income" value={annual} op="=" />
        </div>
      </div>
    </div>
  );
}

// ─── YearPanel — renders filing-specific line items for one tax year ───────────
// Defined at module scope to prevent remounting on each render.

function YearPanel({ label, filing, fields, onChange }: {
  label: string;
  filing: FilingType;
  fields: YearFields;
  onChange: (key: keyof YearFields, val: string) => void;
}) {
  const f = (key: keyof YearFields) => (val: string) => onChange(key, val);

  function handleYearChange(year: string) {
    onChange("taxYear", year);
    const rate = MILEAGE_DEPR_RATE[year];
    if (rate !== undefined) onChange("mileageRate", String(rate));
  }

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 flex flex-col gap-5">
      <div className="flex items-center justify-between gap-4">
        <h3 className="font-semibold text-zinc-900 dark:text-white">{label}</h3>
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide whitespace-nowrap">Tax Year</label>
          <select
            value={fields.taxYear}
            onChange={e => handleYearChange(e.target.value)}
            className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm font-semibold text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">Select year</option>
            {TAX_YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      {/* ── Schedule C ─────────────────────────────────────────────────────── */}
      {filing === "schedule-c" && (
        <>
          <Field label="Net Profit / (Loss)" hint="Schedule C (Form 1040), Line 31 — enter as negative if a loss">
            <DollarInput value={fields.netProfit} onChange={f("netProfit")} placeholder="80,000" />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Depreciation" hint="Schedule C (Form 1040), Line 13 — add back">
              <DollarInput value={fields.depreciation} onChange={f("depreciation")} />
            </Field>
            <Field label="Depletion" hint="Schedule C (Form 1040), Line 12 — add back">
              <DollarInput value={fields.depletion} onChange={f("depletion")} />
            </Field>
          </div>
          <Field label="Business Use of Home" hint="Schedule C (Form 1040), Line 30 — add back">
            <DollarInput value={fields.businessUseHome} onChange={f("businessUseHome")} />
          </Field>
          <Field label="Business Miles" hint="Schedule C, Part IV, Line 44a — total business miles driven">
            <input
              type="text"
              inputMode="numeric"
              className={INPUT_CLS}
              value={fields.mileageMiles}
              onChange={e => f("mileageMiles")(e.target.value.replace(/[^0-9]/g, ""))}
              placeholder="12,000"
            />
            {pn(fields.mileageMiles) > 0 && pn(fields.mileageRate) > 0 && (
              <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mt-1">
                = {fmt(pn(fields.mileageMiles) * pn(fields.mileageRate))} add-back
                <span className="text-zinc-400 dark:text-zinc-500 font-normal">
                  {" "}({Number(pn(fields.mileageMiles)).toLocaleString()} mi × ${pn(fields.mileageRate).toFixed(2)}/mi · {fields.taxYear} IRS rate)
                </span>
              </p>
            )}
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Meals & Entertainment" hint="Schedule C (Form 1040), Line 24b — deducted from qualifying income">
              <DollarInput value={fields.nonRecurringLoss} onChange={f("nonRecurringLoss")} />
            </Field>
            <Field label="Non-Recurring Income" hint="Schedule C, Line 6 (Other Income) or gross receipts — subtract one-time income not expected to repeat">
              <DollarInput value={fields.nonRecurringIncome} onChange={f("nonRecurringIncome")} />
            </Field>
          </div>
        </>
      )}

      {/* ── Form 1065 — Partnership ────────────────────────────────────────── */}
      {filing === "1065" && (
        <>
          <Field label="Ordinary Business Income / (Loss)" hint="Form 1065, Line 22  ·  Schedule K-1 (Form 1065), Box 1 — enter as negative if a loss">
            <DollarInput value={fields.ordinaryIncome} onChange={f("ordinaryIncome")} placeholder="120,000" />
          </Field>
          <Field label="Guaranteed Payments to Partner" hint="Schedule K-1 (Form 1065), Box 4 — enter in full; not prorated by ownership %">
            <DollarInput value={fields.guaranteedPayments} onChange={f("guaranteedPayments")} />
          </Field>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Depreciation" hint="Form 4562 attached to Form 1065 — add back; prorate by ownership %">
              <DollarInput value={fields.depreciation} onChange={f("depreciation")} />
            </Field>
            <Field label="Amortization" hint="Schedule K-1 (Form 1065), Box 13, Code W — add back; prorate by ownership %">
              <DollarInput value={fields.amortization} onChange={f("amortization")} />
            </Field>
            <Field label="Depletion" hint="Schedule K-1 (Form 1065), Box 17 — add back; prorate by ownership %">
              <DollarInput value={fields.depletion} onChange={f("depletion")} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Non-Recurring Loss" hint="Form 1065, supporting schedules — add back one-time, documented losses (prorate by ownership %)">
              <DollarInput value={fields.nonRecurringLoss} onChange={f("nonRecurringLoss")} />
            </Field>
            <Field label="Non-Recurring Income" hint="Form 1065, supporting schedules — subtract one-time income not expected to repeat (prorate by ownership %)">
              <DollarInput value={fields.nonRecurringIncome} onChange={f("nonRecurringIncome")} />
            </Field>
          </div>
        </>
      )}

      {/* ── Form 1120-S — S-Corporation ───────────────────────────────────── */}
      {filing === "1120s" && (
        <>
          <Field label="W-2 Wages from S-Corporation" hint="W-2 (issued by the S-Corporation), Box 1 — Wages, Tips, Other Compensation">
            <DollarInput value={fields.w2Wages} onChange={f("w2Wages")} placeholder="60,000" />
          </Field>
          <Field label="Ordinary Business Income / (Loss)" hint="Form 1120-S, Line 21  ·  Schedule K-1 (Form 1120-S), Box 1 — enter as negative if a loss">
            <DollarInput value={fields.ordinaryIncome} onChange={f("ordinaryIncome")} placeholder="40,000" />
          </Field>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Depreciation" hint="Form 4562 attached to Form 1120-S — add back; prorate by ownership %">
              <DollarInput value={fields.depreciation} onChange={f("depreciation")} />
            </Field>
            <Field label="Amortization" hint="Schedule K-1 (Form 1120-S), Box 12 — add back; prorate by ownership %">
              <DollarInput value={fields.amortization} onChange={f("amortization")} />
            </Field>
            <Field label="Depletion" hint="Schedule K-1 (Form 1120-S), Box 15 — add back; prorate by ownership %">
              <DollarInput value={fields.depletion} onChange={f("depletion")} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Non-Recurring Loss" hint="Form 1120-S, supporting schedules — add back one-time, documented losses (prorate by ownership %)">
              <DollarInput value={fields.nonRecurringLoss} onChange={f("nonRecurringLoss")} />
            </Field>
            <Field label="Non-Recurring Income" hint="Form 1120-S, supporting schedules — subtract one-time income not expected to repeat (prorate by ownership %)">
              <DollarInput value={fields.nonRecurringIncome} onChange={f("nonRecurringIncome")} />
            </Field>
          </div>
        </>
      )}

      {/* ── Form 1120 — C-Corporation ─────────────────────────────────────── */}
      {filing === "1120" && (
        <>
          <Field label="W-2 Wages from Corporation" hint="W-2 (issued by the C-Corporation), Box 1 — Wages, Tips, Other Compensation">
            <DollarInput value={fields.w2Wages} onChange={f("w2Wages")} placeholder="80,000" />
          </Field>
          <Field label="Taxable Income (Pre-Tax)" hint="Form 1120, Line 28 — Taxable income before net operating loss deduction. Enter as negative if a loss.">
            <DollarInput value={fields.pretaxIncome} onChange={f("pretaxIncome")} />
          </Field>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Depreciation" hint="Form 1120, Line 20  ·  Form 4562 (attached) — add back; prorate by ownership %">
              <DollarInput value={fields.depreciation} onChange={f("depreciation")} />
            </Field>
            <Field label="Amortization" hint="Form 1120, Line 26 (Other Deductions supporting schedule) — add back; prorate by ownership %">
              <DollarInput value={fields.amortization} onChange={f("amortization")} />
            </Field>
            <Field label="Corporate Taxes" hint="Form 1120, Line 31 — Total Tax. Subtracted from income; prorate by ownership %.">
              <DollarInput value={fields.corporateTaxes} onChange={f("corporateTaxes")} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Non-Recurring Loss" hint="Form 1120, supporting schedules — add back one-time, documented losses (prorate by ownership %)">
              <DollarInput value={fields.nonRecurringLoss} onChange={f("nonRecurringLoss")} />
            </Field>
            <Field label="Non-Recurring Income" hint="Form 1120, supporting schedules — subtract one-time income not expected to repeat (prorate by ownership %)">
              <DollarInput value={fields.nonRecurringIncome} onChange={f("nonRecurringIncome")} />
            </Field>
          </div>
        </>
      )}

    </div>
  );
}

// ─── Citation text per filing type ─────────────────────────────────────────────

const CITE: Record<FilingType, string> = {
  "schedule-c": "Fannie Mae B3-3.4-02 — Schedule C net profit plus non-cash add-backs (depreciation, depletion, business-use-of-home). Mileage depreciation component is added back when the standard mileage rate is used.",
  "1065":       "Fannie Mae B3-3.4-04 — Borrower's ownership share of partnership ordinary income plus guaranteed payments (K-1, Box 4). Non-cash charges (depreciation, amortization, depletion) are added back proportionally.",
  "1120s":      "Fannie Mae B3-3.4-03 — W-2 wages from the S-corporation plus the borrower's ownership share of ordinary business income with non-cash add-backs. Business must demonstrate sufficient liquidity to support the income distribution.",
  "1120":       "Fannie Mae B3-3.4-05 — W-2 wages plus the borrower's share of after-tax corporate earnings (taxable income + non-cash add-backs − corporate taxes). Borrower must document access to corporate funds and 25%+ ownership.",
};

// ─── Main ──────────────────────────────────────────────────────────────────────

export default function SelfEmploymentPage() {
  const [filing,    setFiling]    = useState<FilingType>("schedule-c");
  const [loanProg,  setLoanProg]  = useState<LoanProgram>("conventional");
  const [yearCount, setYearCount] = useState<1 | 2>(2);
  const [ownerPct,  setOwnerPct]  = useState("100");
  const [year1,     setYear1]     = useState<YearFields>({ ...EMPTY_YEAR });
  const [year2,     setYear2]     = useState<YearFields>({ ...EMPTY_YEAR });
  const [showBreakdown, setShowBreakdown] = useState(false);

  const effectiveYears: 1 | 2 = loanProg === "government" ? 2 : yearCount;
  const needsOwnership = filing !== "schedule-c";

  function handleFilingChange(f: FilingType) {
    setFiling(f);
    setYear1({ ...EMPTY_YEAR });
    setYear2({ ...EMPTY_YEAR });
  }

  function updateYear(
    setter: React.Dispatch<React.SetStateAction<YearFields>>,
    key: keyof YearFields,
    val: string,
  ) {
    setter(prev => ({ ...prev, [key]: val }));
  }

  const result = useMemo(() => {
    const own  = pn(ownerPct) || 100;
    const y1   = calcAnnual(year1, filing, own);
    const y2   = effectiveYears === 2 ? calcAnnual(year2, filing, own) : null;

    const hasInput = Object.values(year1).some(v => v !== "");

    // Declining = most recent year (year1) is lower than prior year (year2)
    const declining = y2 !== null && y1 < y2;

    let qualifying: number;
    let method: string;

    if (effectiveYears === 1) {
      qualifying = y1 / 12;
      method     = "Most recent year only";
    } else if (declining) {
      qualifying = y1 / 12;
      method     = "Declining income — most recent (lower) year used";
    } else {
      qualifying = ((y1 + (y2 ?? 0)) / 2) / 12;
      method     = "2-year average";
    }

    return { y1, y2, qualifying, method, declining, hasInput };
  }, [filing, ownerPct, year1, year2, effectiveYears]);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-10 flex flex-col gap-8">

        {/* Title */}
        <div>
          <a href="/" className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 mb-4 transition-colors">
            ← Back to Calculators
          </a>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Self-Employment Income</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Analyze qualifying income from tax returns — Schedule C, partnerships, S-corps, and C-corps.
          </p>
        </div>

        {/* ── Setup ─────────────────────────────────────────────────────────────── */}
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 flex flex-col gap-5">
          <h3 className="font-semibold text-zinc-900 dark:text-white">Setup</h3>

          {/* Filing type */}
          <Field label="Filing / Entity Type">
            <select
              value={filing}
              onChange={e => handleFilingChange(e.target.value as FilingType)}
              className={INPUT_CLS}
            >
              <option value="schedule-c">Schedule C — Sole Proprietor / Single-Member LLC</option>
              <option value="1065" disabled>Form 1065 — Partnership / Multi-Member LLC (Coming Soon)</option>
              <option value="1120s" disabled>Form 1120-S — S-Corporation (Coming Soon)</option>
              <option value="1120" disabled>Form 1120 — C-Corporation (Coming Soon)</option>
            </select>
          </Field>

          {/* Loan program */}
          <Field label="Loan Program">
            <TogglePill
              options={[
                { value: "conventional", label: "Conventional" },
                { value: "government",   label: "FHA / VA / USDA" },
              ]}
              value={loanProg}
              onChange={v => setLoanProg(v as LoanProgram)}
            />
          </Field>

          {/* Analysis period */}
          <Field label="Analysis Period">
            {loanProg === "government" ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                  <span className="text-blue-500 text-base mt-0.5">🏛</span>
                  <p className="text-xs text-blue-700 dark:text-blue-400 font-medium leading-relaxed">
                    FHA, VA, and USDA require a 2-year self-employment history. A 1-year analysis is not permitted for government loans (FHA ML 2014-02 · VA Circular 26-23-07 · USDA HB-1-3555).
                  </p>
                </div>
                <div className="flex items-center justify-between px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50">
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">Locked at 2 years</span>
                  <span className="text-sm font-bold text-zinc-900 dark:text-white">2 Years Required</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <TogglePill
                  options={[
                    { value: "1", label: "1 Year" },
                    { value: "2", label: "2 Years" },
                  ]}
                  value={String(yearCount)}
                  onChange={v => setYearCount(Number(v) as 1 | 2)}
                />
                {yearCount === 1 ? (
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                    <span className="text-amber-500 text-base mt-0.5">⚠</span>
                    <p className="text-xs text-amber-700 dark:text-amber-400 font-medium leading-relaxed">
                      <strong>5-Year Rule (Fannie Mae B3-3.2-01):</strong> A 1-year analysis is acceptable only if the business has been operating for 5 or more consecutive years AND the borrower was previously employed in the same field. Document with a business license, CPA letter, or other evidence of continuity.
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 leading-relaxed">
                    Enter the most recent tax year as Year 1. Income is averaged over both years unless declining — a lower Year 1 triggers use of the most recent (lower) year only.
                  </p>
                )}
              </div>
            )}
          </Field>

          {/* Ownership % — not applicable for Schedule C (100% by definition) */}
          {needsOwnership && (
            <Field
              label="Borrower's Ownership Percentage"
              hint="Borrower's share in the partnership or corporation. Required for Schedule K-1 income proration."
            >
              <PctInput value={ownerPct} onChange={setOwnerPct} />
            </Field>
          )}
        </div>

        {/* ── Year 1 — Most Recent ─────────────────────────────────────────────── */}
        <YearPanel
          label="Most Recent Year (Year 1)"
          filing={filing}
          fields={year1}
          onChange={(key, val) => updateYear(setYear1, key, val)}
        />

        {/* ── Year 2 — Prior Year ──────────────────────────────────────────────── */}
        {effectiveYears === 2 && (
          <YearPanel
            label="Prior Year (Year 2)"
            filing={filing}
            fields={year2}
            onChange={(key, val) => updateYear(setYear2, key, val)}
          />
        )}

        {/* ── Result ───────────────────────────────────────────────────────────── */}
        <div className={`rounded-2xl border p-6 ${
          result.hasInput
            ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-950/20"
            : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
        }`}>
          <h2 className="font-semibold text-zinc-900 dark:text-white text-base mb-4">Qualifying Income</h2>

          {/* Declining income warning */}
          {result.declining && (
            <div className="mb-4 flex items-start gap-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
              <span className="text-amber-500 text-base mt-0.5 flex-shrink-0">⚠</span>
              <p className="text-xs text-amber-700 dark:text-amber-400 font-medium leading-relaxed">
                Declining income: Year 1 ({fmt(result.y1)}) is lower than Year 2 ({fmt(result.y2 ?? 0)}). Per Fannie Mae B3-3.1-09, averaging is not permitted when income is declining. The most recent (lower) year is used.
              </p>
            </div>
          )}

          {/* Prominent qualifying figure */}
          <div className="flex flex-col items-center text-center py-5 mb-2">
            <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide mb-2">
              Qualifying Monthly Income
            </span>
            <span className="text-5xl font-bold text-emerald-600 dark:text-emerald-400">
              {result.hasInput ? fmt(result.qualifying) : "—"}
            </span>
            {result.hasInput && (
              <span className="text-xs text-zinc-400 dark:text-zinc-500 mt-2">{result.method}</span>
            )}
          </div>

          {/* Summary rows */}
          <div className="flex flex-col border-t border-emerald-100 dark:border-emerald-900/50">
            <RRow
              label="Year 1 Annual Income"
              value={result.hasInput ? fmt(result.y1) : "—"}
              sub="Most recent tax year"
            />
            {result.y2 !== null && (
              <RRow
                label="Year 2 Annual Income"
                value={fmt(result.y2)}
                sub={result.declining ? "Prior year — not used (income declined)" : "Prior tax year"}
                muted={result.declining}
                topBorder
              />
            )}
            <RRow
              label="Qualifying Annual Income"
              value={result.hasInput ? fmt(result.qualifying * 12) : "—"}
              topBorder
              indent
            />
          </div>

          {/* Breakdown toggle */}
          {result.hasInput && (
            <button
              onClick={() => setShowBreakdown(v => !v)}
              className="mt-3 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline text-left"
            >
              {showBreakdown ? "− Hide calculation breakdown" : "+ Show calculation breakdown"}
            </button>
          )}

          {/* Expandable breakdown detail */}
          {showBreakdown && result.hasInput && (
            <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex flex-col gap-6">

              {/* Per-year line items */}
              <BreakdownYear
                label={`Year 1 — ${year1.taxYear || "Most Recent"}`}
                y={year1}
                filing={filing}
                own={pn(ownerPct) || 100}
              />
              {effectiveYears === 2 && (
                <BreakdownYear
                  label={`Year 2 — ${year2.taxYear || "Prior Year"}`}
                  y={year2}
                  filing={filing}
                  own={pn(ownerPct) || 100}
                />
              )}

              {/* Final averaging / division */}
              <div>
                <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-2">Final Calculation</p>
                <div className="flex flex-col">
                  {effectiveYears === 2 ? (
                    <>
                      <BRow label={`Year 1 Annual (${year1.taxYear || "Most Recent"})`} value={result.y1} op="" />
                      {result.declining ? (
                        <BRow label={`Year 2 Annual (${year2.taxYear || "Prior"}) — not used, income declined`} value={result.y2 ?? 0} op="" muted />
                      ) : (
                        <BRow label={`Year 2 Annual (${year2.taxYear || "Prior Year"})`} value={result.y2 ?? 0} op="+" />
                      )}
                      {!result.declining && (
                        <BRow label="2-Year Average (÷ 2)" value={(result.y1 + (result.y2 ?? 0)) / 2} op="=" />
                      )}
                    </>
                  ) : (
                    <BRow label={`Year 1 Annual (${year1.taxYear || "Most Recent"})`} value={result.y1} op="" />
                  )}
                  <div className="border-t border-zinc-200 dark:border-zinc-700 mt-1.5 pt-1.5">
                    <BRow label="Monthly Qualifying Income (÷ 12)" value={result.qualifying} op="=" />
                  </div>
                </div>
              </div>

            </div>
          )}

          <p className="mt-4 text-xs text-zinc-400 dark:text-zinc-500 italic border-t border-zinc-100 dark:border-zinc-800 pt-3">
            {CITE[filing]}
          </p>
        </div>

      </main>
    </div>
  );
}
