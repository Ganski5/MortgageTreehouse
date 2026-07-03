"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Header } from "../../components/Header";
import { DownloadPDFButton } from "../../components/DownloadPDFButton";
import { VAResidualPDF } from "../../components/pdf/VAResidualPDF";

type Region = "Northeast" | "Midwest" | "South" | "West";

const STATE_TO_REGION: Record<string, Region> = {
  CT: "Northeast", ME: "Northeast", MA: "Northeast", NH: "Northeast",
  NJ: "Northeast", NY: "Northeast", PA: "Northeast", RI: "Northeast", VT: "Northeast",
  IL: "Midwest",  IN: "Midwest",  IA: "Midwest",  KS: "Midwest",
  MI: "Midwest",  MN: "Midwest",  MO: "Midwest",  NE: "Midwest",
  ND: "Midwest",  OH: "Midwest",  SD: "Midwest",  WI: "Midwest",
  AL: "South", AR: "South", DE: "South", DC: "South", FL: "South",
  GA: "South", KY: "South", LA: "South", MD: "South", MS: "South",
  NC: "South", OK: "South", SC: "South", TN: "South", TX: "South",
  VA: "South", WV: "South",
  AK: "West", AZ: "West", CA: "West", CO: "West", HI: "West",
  ID: "West",  MT: "West", NV: "West", NM: "West", OR: "West",
  UT: "West",  WA: "West", WY: "West",
};

const ALL_STATES = [
  { abbr: "AL", name: "Alabama" }, { abbr: "AK", name: "Alaska" },
  { abbr: "AZ", name: "Arizona" }, { abbr: "AR", name: "Arkansas" },
  { abbr: "CA", name: "California" }, { abbr: "CO", name: "Colorado" },
  { abbr: "CT", name: "Connecticut" }, { abbr: "DE", name: "Delaware" },
  { abbr: "DC", name: "D.C." }, { abbr: "FL", name: "Florida" },
  { abbr: "GA", name: "Georgia" }, { abbr: "HI", name: "Hawaii" },
  { abbr: "ID", name: "Idaho" }, { abbr: "IL", name: "Illinois" },
  { abbr: "IN", name: "Indiana" }, { abbr: "IA", name: "Iowa" },
  { abbr: "KS", name: "Kansas" }, { abbr: "KY", name: "Kentucky" },
  { abbr: "LA", name: "Louisiana" }, { abbr: "ME", name: "Maine" },
  { abbr: "MD", name: "Maryland" }, { abbr: "MA", name: "Massachusetts" },
  { abbr: "MI", name: "Michigan" }, { abbr: "MN", name: "Minnesota" },
  { abbr: "MS", name: "Mississippi" }, { abbr: "MO", name: "Missouri" },
  { abbr: "MT", name: "Montana" }, { abbr: "NE", name: "Nebraska" },
  { abbr: "NV", name: "Nevada" }, { abbr: "NH", name: "New Hampshire" },
  { abbr: "NJ", name: "New Jersey" }, { abbr: "NM", name: "New Mexico" },
  { abbr: "NY", name: "New York" }, { abbr: "NC", name: "North Carolina" },
  { abbr: "ND", name: "North Dakota" }, { abbr: "OH", name: "Ohio" },
  { abbr: "OK", name: "Oklahoma" }, { abbr: "OR", name: "Oregon" },
  { abbr: "PA", name: "Pennsylvania" }, { abbr: "RI", name: "Rhode Island" },
  { abbr: "SC", name: "South Carolina" }, { abbr: "SD", name: "South Dakota" },
  { abbr: "TN", name: "Tennessee" }, { abbr: "TX", name: "Texas" },
  { abbr: "UT", name: "Utah" }, { abbr: "VT", name: "Vermont" },
  { abbr: "VA", name: "Virginia" }, { abbr: "WA", name: "Washington" },
  { abbr: "WV", name: "West Virginia" }, { abbr: "WI", name: "Wisconsin" },
  { abbr: "WY", name: "Wyoming" },
];

// VA Lenders Handbook, Chapter 4 — indexed [familySize - 1] for sizes 1–5
const THRESHOLDS = {
  above80k: {
    Northeast: [450, 755, 909, 1025, 1062],
    Midwest:   [441, 738, 889, 1003, 1039],
    South:     [441, 738, 889, 1003, 1039],
    West:      [491, 823, 990, 1117, 1158],
  },
  below80k: {
    Northeast: [390, 654, 787, 888, 921],
    Midwest:   [382, 641, 770, 868, 902],
    South:     [382, 641, 770, 868, 902],
    West:      [425, 713, 858, 967, 1004],
  },
} as const;

const REGIONS: Region[] = ["Northeast", "Midwest", "South", "West"];
const DIAL_SIZES = [1, 2, 3, 4, 5, 6, 7]; // 7 represents "7+"

function getThreshold(above80k: boolean, familySize: number, region: Region): number {
  const table = above80k ? THRESHOLDS.above80k : THRESHOLDS.below80k;
  const col = table[region];
  if (familySize <= 5) return col[familySize - 1];
  // For loans ≥ $80k, +$80 per person beyond 5
  if (above80k) return col[4] + (familySize - 5) * 80;
  // For loans < $80k, VA doesn't define beyond 5 — use the 5-member value
  return col[4];
}

function fmt(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

function parseNum(s: string): number {
  const n = parseFloat(s.replace(/[^0-9.]/g, ""));
  return isNaN(n) ? 0 : n;
}

// ── Sub-components ────────────────────────────────────────────────

interface LineItemProps {
  label: string;
  sign: "+" | "−";
  value: string;
  onChange: (v: string) => void;
  hint?: string;
}

function LineItem({ label, sign, value, onChange, hint }: LineItemProps) {
  const isPositive = sign === "+";
  return (
    <div className="flex items-center gap-3 py-3 border-b border-zinc-100 dark:border-zinc-800 last:border-0">
      <span
        className={`w-6 text-center text-sm font-bold shrink-0 ${
          isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400"
        }`}
      >
        {sign}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-200">{label}</p>
        {hint && <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">{hint}</p>}
      </div>
      <div className="relative w-36 shrink-0">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm">$</span>
        <input
          type="number"
          min="0"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0"
          className="w-full pl-7 pr-3 py-2.5 text-base text-right rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow duration-150 hover:border-zinc-300 dark:hover:border-zinc-600"
        />
      </div>
    </div>
  );
}

interface ThresholdCellProps {
  value: number;
  highlighted: boolean;
}

function ThresholdCell({ value, highlighted }: ThresholdCellProps) {
  const dti41 = Math.round(value * 1.2);
  return (
    <td
      className={`px-4 py-3 text-center tabular-nums transition-colors ${
        highlighted
          ? "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 font-bold"
          : "text-zinc-600 dark:text-zinc-300 font-medium"
      }`}
    >
      <div className="relative group inline-block">
        <span>{fmt(value)}</span>
        {/* Tooltip */}
        <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 hidden group-hover:block z-20 w-52">
          <div className="bg-zinc-900 dark:bg-zinc-700 text-white text-xs rounded-xl px-3.5 py-2.5 shadow-xl text-left leading-relaxed">
            <p className="font-semibold text-zinc-200 mb-1">DTI &gt; 41% rule</p>
            <p className="text-zinc-300">
              Standard threshold: <span className="text-white font-semibold">{fmt(value)}</span>
            </p>
            <p className="text-zinc-300">
              If DTI exceeds 41%, residual must be at least{" "}
              <span className="text-amber-300 font-semibold">{fmt(dti41)}</span>{" "}
              (20% above threshold).
            </p>
          </div>
          {/* Arrow */}
          <div className="flex justify-center">
            <div className="w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-zinc-900 dark:border-t-zinc-700" />
          </div>
        </div>
      </div>
    </td>
  );
}

// ── Main Page ────────────────────────────────────────────────────

export default function VAResidualPage() {
  const [income, setIncome] = useState("");
  const [taxes, setTaxes] = useState("");
  const [liabilities, setLiabilities] = useState("");
  const [childcare, setChildcare] = useState("");
  const [sqFt, setSqFt] = useState("");
  const [pitia, setPitia] = useState("");

  const [loanAbove80k, setLoanAbove80k] = useState<boolean | null>(null);
  const [family, setFamily] = useState<number | null>(null);
  const [selectedState, setSelectedState] = useState("");

  const utilities = useMemo(() => {
    const sf = parseNum(sqFt);
    return sf > 0 ? Math.round(sf * 0.14) : 0;
  }, [sqFt]);

  const residual = useMemo(
    () =>
      parseNum(income) -
      parseNum(taxes) -
      parseNum(liabilities) -
      parseNum(childcare) -
      utilities -
      parseNum(pitia),
    [income, taxes, liabilities, childcare, utilities, pitia]
  );

  const hasAnyInput = [income, taxes, liabilities, childcare, sqFt, pitia].some((v) => v !== "");
  const region = selectedState ? STATE_TO_REGION[selectedState] : null;
  const unlocked = selectedState !== "" && family !== null && loanAbove80k !== null;

  const threshold = useMemo(() => {
    if (!region || family === null || loanAbove80k === null) return null;
    return getThreshold(loanAbove80k, family, region);
  }, [loanAbove80k, family, region]);

  const passes = threshold !== null ? residual >= threshold : null;

  // Table rows: above80k gets 6 and 7+ rows; below80k stops at 5
  const tableRows =
    loanAbove80k === true
      ? [1, 2, 3, 4, 5, 6, 7]
      : [1, 2, 3, 4, 5];

  // For highlighting: if family is 6/7 with below80k, we highlight row 5 instead
  function highlightRow(rowSize: number): boolean {
    if (!unlocked || region === null || family === null) return false;
    if (loanAbove80k === false && family > 5) return rowSize === 5;
    return rowSize === family;
  }

  return (
    <div className="min-h-full bg-white dark:bg-zinc-950 font-[family-name:var(--font-geist-sans)]">

      <Header backLink={{ href: "/#calculators", label: "All Calculators" }} />

      <main className="max-w-2xl mx-auto px-6 py-12 flex flex-col gap-10">

        {/* Title */}
        <div className="anim-fade-in-up">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2 text-balance">
            VA Residual Income
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
            Enter monthly figures to calculate estimated VA residual income, then unlock the
            threshold table with loan tier, family size, and state.
          </p>
        </div>

        {/* ── Calculator ── */}
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-6 py-2">
          <LineItem label="Qualifying Income" sign="+" value={income} onChange={setIncome} />
          <LineItem
            label="State / Federal / Social Security Taxes"
            sign="−"
            value={taxes}
            onChange={setTaxes}
          />
          <LineItem
            label="Credit Report Liabilities"
            sign="−"
            value={liabilities}
            onChange={setLiabilities}
          />
          <LineItem
            label="Childcare / Child Support"
            sign="−"
            value={childcare}
            onChange={setChildcare}
          />

          {/* Utilities — sq ft helper */}
          <div className="flex items-center gap-3 py-3 border-b border-zinc-100 dark:border-zinc-800">
            <span className="w-6 text-center text-sm font-bold shrink-0 text-red-500 dark:text-red-400">
              −
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
                Estimated Utilities
              </p>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">Sq ft × $0.14</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <input
                type="number"
                min="0"
                value={sqFt}
                onChange={(e) => setSqFt(e.target.value)}
                placeholder="sq ft"
                className="w-24 px-3 py-2.5 text-base text-right rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
              <span className="text-zinc-300 dark:text-zinc-600 text-sm">→</span>
              <span className="w-20 text-right text-sm font-semibold text-zinc-900 dark:text-white">
                {utilities > 0 ? fmt(utilities) : "—"}
              </span>
            </div>
          </div>

          <LineItem
            label="Future PITIA"
            sign="−"
            value={pitia}
            onChange={setPitia}
            hint="Principal · Interest · Taxes · Insurance · Association"
          />

          {/* Result */}
          <div
            className={`flex items-center justify-between pt-5 pb-3 mt-2 border-t-2 ${
              !hasAnyInput
                ? "border-zinc-200 dark:border-zinc-700"
                : residual >= 0
                ? "border-emerald-400 dark:border-emerald-600"
                : "border-red-400 dark:border-red-600"
            }`}
          >
            <span className="text-sm font-semibold text-zinc-600 dark:text-zinc-300 uppercase tracking-wide">
              Estimated Residual Income
            </span>
            <span
              className={`text-2xl font-bold ${
                !hasAnyInput
                  ? "text-zinc-400 dark:text-zinc-600"
                  : residual >= 0
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-red-500 dark:text-red-400"
              }`}
            >
              {hasAnyInput ? fmt(residual) : "—"}
            </span>
          </div>
        </div>

        {/* ── Threshold Unlock ── */}
        <div className="flex flex-col gap-6">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-1">
              Compare to VA Threshold
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Set the three options below to highlight your borrower&apos;s threshold in the table.
            </p>
          </div>

          {/* Loan tier toggle */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
              Loan Amount
            </label>
            <div className="inline-flex rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 p-1 gap-1">
              {[
                { label: "< $80,000", value: false },
                { label: "≥ $80,000", value: true },
              ].map(({ label, value }) => (
                <button
                  key={label}
                  onClick={() => setLoanAbove80k(value)}
                  className={`flex-1 px-5 py-2 text-sm font-medium rounded-lg transition-all ${
                    loanAbove80k === value
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Family size dial */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
              Family Size
            </label>
            <div className="flex gap-2">
              {DIAL_SIZES.map((size) => {
                const isSelected = family === size;
                return (
                  <button
                    key={size}
                    onClick={() => setFamily(size)}
                    className={`relative flex-1 flex flex-col items-center justify-center gap-1 py-3 rounded-xl text-sm font-bold transition-all duration-200 ease-out ${
                      isSelected
                        ? "bg-emerald-600 text-white shadow-lg scale-110 z-10 ring-2 ring-emerald-400/30"
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:scale-105 hover:text-zinc-700 dark:hover:text-zinc-200"
                    }`}
                  >
                    <span className="text-base leading-none">
                      {size === 1 ? "🧑" : size === 2 ? "👫" : size <= 4 ? "👨‍👩‍👦" : "👨‍👩‍👧‍👦"}
                    </span>
                    <span>{size === 7 ? "7+" : size}</span>
                  </button>
                );
              })}
            </div>
            {family !== null && family > 5 && loanAbove80k === true && (
              <p className="text-xs text-zinc-400 dark:text-zinc-500">
                +${(family - 5) * 80}/mo above the 5-member threshold applied.
              </p>
            )}
            {family !== null && family > 5 && loanAbove80k === false && (
              <p className="text-xs text-amber-500 dark:text-amber-400">
                VA doesn&apos;t define thresholds beyond family of 5 for loans under $80k. Using the 5-member threshold.
              </p>
            )}
          </div>

          {/* State select */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
              State
            </label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full px-3 py-2.5 text-base rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow duration-150 hover:border-zinc-300 dark:hover:border-zinc-600"
            >
              <option value="">Select state…</option>
              {ALL_STATES.map((s) => (
                <option key={s.abbr} value={s.abbr}>
                  {s.name} — {STATE_TO_REGION[s.abbr]}
                </option>
              ))}
            </select>
            {region && (
              <p className="text-xs text-zinc-400 dark:text-zinc-500">
                VA Region: <span className="font-semibold text-zinc-600 dark:text-zinc-300">{region}</span>
              </p>
            )}
          </div>
        </div>

        {/* ── Pass / Fail Banner ── */}
        {unlocked && threshold !== null && (
          <div
            className={`flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl px-6 py-5 anim-fade-in-up ${
              passes
                ? "bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800"
                : "bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800"
            }`}
          >
            <div className="flex flex-col gap-0.5 text-center sm:text-left">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                Residual Income
              </p>
              <p
                className={`text-2xl font-bold ${
                  passes ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400"
                }`}
              >
                {fmt(residual)}
              </p>
            </div>
            <div className="hidden sm:block text-2xl text-zinc-300 dark:text-zinc-600">vs.</div>
            <div className="flex flex-col gap-0.5 text-center sm:text-left">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                VA Threshold
              </p>
              <p className="text-2xl font-bold text-zinc-700 dark:text-zinc-200">{fmt(threshold)}</p>
            </div>
            <div
              className={`flex items-center gap-2 rounded-full px-5 py-2.5 font-bold text-sm ${
                passes ? "bg-emerald-600 text-white" : "bg-red-500 text-white"
              }`}
            >
              {passes ? "✓ PASS" : "✗ FAIL"}
              <span className="font-normal opacity-80">
                ({passes ? "+" : ""}
                {fmt(residual - threshold)})
              </span>
            </div>
          </div>
        )}

        {/* ── Threshold Table ── */}
        {loanAbove80k !== null && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
                VA Residual Income Table
              </h2>
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full">
                {loanAbove80k ? "Loans ≥ $80,000" : "Loans < $80,000"}
              </span>
            </div>

            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide w-24">
                        Family
                      </th>
                      {REGIONS.map((r) => (
                        <th
                          key={r}
                          className={`px-4 py-3 text-xs font-semibold uppercase tracking-wide text-center ${
                            region === r && unlocked
                              ? "text-emerald-700 dark:text-emerald-400"
                              : "text-zinc-500 dark:text-zinc-400"
                          }`}
                        >
                          {r}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tableRows.map((size) => {
                      const isHighlightedRow = highlightRow(size);
                      return (
                        <tr
                          key={size}
                          className={`border-t border-zinc-100 dark:border-zinc-800 ${
                            isHighlightedRow ? "bg-zinc-50/50 dark:bg-zinc-900/50" : ""
                          }`}
                        >
                          <td className="px-4 py-3 font-semibold text-zinc-700 dark:text-zinc-200">
                            {size === 7 ? "7+" : size}
                          </td>
                          {REGIONS.map((r) => {
                            const val = getThreshold(loanAbove80k, size, r);
                            const highlighted = isHighlightedRow && region === r && unlocked;
                            return (
                              <ThresholdCell
                                key={r}
                                value={val}
                                highlighted={highlighted}
                              />
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {loanAbove80k && (
                <div className="px-4 py-2.5 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 italic">
                    Rows 6 and 7+ computed per VA guidelines (+$80/person beyond 5). Hover any cell to see the DTI &gt; 41% threshold.
                  </p>
                </div>
              )}
              {!loanAbove80k && (
                <div className="px-4 py-2.5 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 italic">
                    VA does not define thresholds beyond family of 5 for loans under $80,000. Hover any cell to see the DTI &gt; 41% threshold.
                  </p>
                </div>
              )}
            </div>

            <p className="text-xs text-zinc-400 dark:text-zinc-500 leading-relaxed">
              Source: VA Lenders Handbook, Chapter 4. Always verify against current VA guidelines.
            </p>
          </div>
        )}

        {/* Prompt to unlock table */}
        {loanAbove80k === null && (
          <div className="rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-700 px-6 py-10 text-center">
            <p className="text-zinc-400 dark:text-zinc-500 text-sm">
              Select a loan tier above to display the VA threshold table.
            </p>
          </div>
        )}

        {/* Download */}
        {hasAnyInput && (
          <div className="flex flex-col items-center gap-2 pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <p className="text-xs text-zinc-400 dark:text-zinc-500">
              Save a clean PDF to share with your client or underwriter.
            </p>
            <DownloadPDFButton
              filename="va-residual-income.pdf"
              document={
                <VAResidualPDF
                  income={parseNum(income)}
                  taxes={parseNum(taxes)}
                  liabilities={parseNum(liabilities)}
                  childcare={parseNum(childcare)}
                  sqFt={parseNum(sqFt)}
                  utilities={utilities}
                  pitia={parseNum(pitia)}
                  residual={residual}
                  loanAbove80k={loanAbove80k}
                  family={family}
                  stateName={ALL_STATES.find(s => s.abbr === selectedState)?.name ?? ""}
                  stateAbbr={selectedState}
                  region={region}
                  threshold={threshold}
                  passes={passes}
                  logoSrc={typeof window !== "undefined" ? `${window.location.origin}/logo.png` : ""}
                />
              }
            />
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-100 dark:border-zinc-800 px-6 py-6 mt-12 transition-colors duration-300">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-zinc-400">
          <span className="flex items-center gap-2 font-medium text-emerald-700 dark:text-emerald-400">
            <Image src="/logo.png" alt="" width={20} height={20} className="dark:invert" />
            Mortgage Treehouse
          </span>
          <span className="text-xs text-center">For educational use. Not a guarantee of loan approval.</span>
        </div>
      </footer>

    </div>
  );
}
