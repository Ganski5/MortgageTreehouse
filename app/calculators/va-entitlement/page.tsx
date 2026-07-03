"use client";

import { useState, useMemo, type ReactNode } from "react";
import { Header } from "../../components/Header";

// ─── 2026 FHFA Conforming Loan Limits — Fannie Mae 1-Unit ────────────────────
// Source: fhfa.gov/data/conforming-loan-limit-values  |  Effective Jan 1, 2026
// Baseline: $832,750  |  High-cost ceiling: $1,249,125 (150% of baseline)
// AK/HI statutory ceiling: $1,249,125
// NY/NJ NYC-metro counties held at $1,209,750 (FHFA hold-harmless provision)
// WA Seattle-area (King/Pierce/Snohomish): $1,063,750
// CT uses planning regions (2026); mapped to legacy county names below
// Always verify at fhfa.gov before quoting — limits are editable on this page

const STANDARD_LIMIT = 832750;
const CEILING = 1249125;

// States where ALL counties share one limit (no per-county selection needed)
const FLAT_STATE_LIMIT: Record<string, number> = {
  AK: CEILING,
  HI: CEILING,
};

// High-cost counties only — all others default to STANDARD_LIMIT
const HIGH_COST: Record<string, Record<string, number>> = {
  CA: {
    // At ceiling
    "Alameda": CEILING, "Contra Costa": CEILING, "Los Angeles": CEILING,
    "Marin": CEILING, "Orange": CEILING, "San Benito": CEILING,
    "San Francisco": CEILING, "San Mateo": CEILING,
    "Santa Clara": CEILING, "Santa Cruz": CEILING,
    // Intermediate
    "San Diego": 1104000, "Ventura": 1035000,
    "Napa": 1017750, "San Luis Obispo": 1000500,
    "Monterey": 994750, "Santa Barbara": 941850,
    "Sonoma": 897000,
  },
  CO: {
    // At ceiling
    "Eagle": CEILING,
    // Intermediate — confirmed from FHFA 2026 data
    "Garfield": 1209750, "Pitkin": 1209750,
    "Lake": 1092500, "Summit": 1092500,
    "Moffat": 1089050, "Routt": 1089050,
    "San Miguel": 994750,
    "Grand": 883200,
    "Boulder": 879750,
    "Adams": 862500, "Arapahoe": 862500, "Broomfield": 862500,
    "Clear Creek": 862500, "Denver": 862500, "Douglas": 862500,
    "Elbert": 862500, "Gilpin": 862500, "Jefferson": 862500, "Park": 862500,
  },
  // CT uses planning regions in 2026; Fairfield County area → $977,500
  CT: { "Fairfield": 977500 },
  DC: { "District of Columbia": CEILING },
  FL: { "Monroe": 990150 },
  // ID: Only Teton County is high-cost in 2026; Blaine/Camas dropped to standard
  ID: { "Teton": CEILING },
  MA: {
    "Dukes": CEILING, "Nantucket": CEILING,
    // Boston MSA counties
    "Essex": 962550, "Middlesex": 962550, "Norfolk": 962550,
    "Plymouth": 962550, "Suffolk": 962550,
  },
  // MD: 5 high-cost counties in DC metro (Bankrate / FHFA 2026)
  MD: {
    "Calvert": CEILING, "Charles": CEILING, "Frederick": CEILING,
    "Montgomery": CEILING, "Prince George's": CEILING,
  },
  NH: { "Rockingham": 962550, "Strafford": 962550 },
  // NJ NYC-metro held at $1,209,750 (hold-harmless; local prices didn't meet ceiling threshold)
  NJ: {
    "Bergen": 1209750, "Essex": 1209750, "Hudson": 1209750,
    "Hunterdon": 1209750, "Middlesex": 1209750, "Monmouth": 1209750,
    "Morris": 1209750, "Ocean": 1209750, "Passaic": 1209750,
    "Somerset": 1209750, "Sussex": 1209750, "Union": 1209750,
  },
  // NY NYC-metro held at $1,209,750 (hold-harmless)
  NY: {
    "Bronx": 1209750, "Kings": 1209750, "Nassau": 1209750,
    "New York": 1209750, "Putnam": 1209750, "Queens": 1209750,
    "Richmond": 1209750, "Rockland": 1209750, "Suffolk": 1209750,
    "Westchester": 1209750,
  },
  // TN Nashville MSA — 14 counties at $1,029,250
  TN: {
    "Cannon": 1029250, "Cheatham": 1029250, "Davidson": 1029250,
    "Dickson": 1029250, "Hickman": 1029250, "Macon": 1029250,
    "Maury": 1029250, "Robertson": 1029250, "Rutherford": 1029250,
    "Smith": 1029250, "Sumner": 1029250, "Trousdale": 1029250,
    "Williamson": 1029250, "Wilson": 1029250,
  },
  UT: { "Summit": CEILING, "Wasatch": CEILING },
  // VA DC metro — all confirmed at ceiling for 2026
  VA: {
    "Alexandria City": CEILING, "Arlington": CEILING, "Clarke": CEILING,
    "Culpeper": CEILING, "Fairfax": CEILING, "Fairfax City": CEILING,
    "Falls Church City": CEILING, "Fauquier": CEILING,
    "Fredericksburg City": CEILING, "Loudoun": CEILING,
    "Manassas City": CEILING, "Manassas Park City": CEILING,
    "Prince William": CEILING, "Rappahannock": CEILING,
    "Spotsylvania": CEILING, "Stafford": CEILING, "Warren": CEILING,
  },
  // WA Seattle MSA at $1,063,750; all other counties standard
  WA: { "King": 1063750, "Pierce": 1063750, "Snohomish": 1063750 },
  WY: { "Teton": CEILING },
};

function getLimit(stateAbbr: string, county: string): number {
  const flat = FLAT_STATE_LIMIT[stateAbbr];
  if (flat) return flat;
  return HIGH_COST[stateAbbr]?.[county] ?? STANDARD_LIMIT;
}

function getHighCostCounties(stateAbbr: string): string[] {
  return Object.keys(HIGH_COST[stateAbbr] ?? {}).sort();
}

// ─── States ───────────────────────────────────────────────────────────────────

const STATES = [
  { abbr: "AL", name: "Alabama" },       { abbr: "AK", name: "Alaska" },
  { abbr: "AZ", name: "Arizona" },       { abbr: "AR", name: "Arkansas" },
  { abbr: "CA", name: "California" },    { abbr: "CO", name: "Colorado" },
  { abbr: "CT", name: "Connecticut" },   { abbr: "DE", name: "Delaware" },
  { abbr: "DC", name: "Washington D.C." },{ abbr: "FL", name: "Florida" },
  { abbr: "GA", name: "Georgia" },       { abbr: "HI", name: "Hawaii" },
  { abbr: "ID", name: "Idaho" },         { abbr: "IL", name: "Illinois" },
  { abbr: "IN", name: "Indiana" },       { abbr: "IA", name: "Iowa" },
  { abbr: "KS", name: "Kansas" },        { abbr: "KY", name: "Kentucky" },
  { abbr: "LA", name: "Louisiana" },     { abbr: "ME", name: "Maine" },
  { abbr: "MD", name: "Maryland" },      { abbr: "MA", name: "Massachusetts" },
  { abbr: "MI", name: "Michigan" },      { abbr: "MN", name: "Minnesota" },
  { abbr: "MS", name: "Mississippi" },   { abbr: "MO", name: "Missouri" },
  { abbr: "MT", name: "Montana" },       { abbr: "NE", name: "Nebraska" },
  { abbr: "NV", name: "Nevada" },        { abbr: "NH", name: "New Hampshire" },
  { abbr: "NJ", name: "New Jersey" },    { abbr: "NM", name: "New Mexico" },
  { abbr: "NY", name: "New York" },      { abbr: "NC", name: "North Carolina" },
  { abbr: "ND", name: "North Dakota" },  { abbr: "OH", name: "Ohio" },
  { abbr: "OK", name: "Oklahoma" },      { abbr: "OR", name: "Oregon" },
  { abbr: "PA", name: "Pennsylvania" },  { abbr: "RI", name: "Rhode Island" },
  { abbr: "SC", name: "South Carolina" },{ abbr: "SD", name: "South Dakota" },
  { abbr: "TN", name: "Tennessee" },     { abbr: "TX", name: "Texas" },
  { abbr: "UT", name: "Utah" },          { abbr: "VT", name: "Vermont" },
  { abbr: "VA", name: "Virginia" },      { abbr: "WA", name: "Washington" },
  { abbr: "WV", name: "West Virginia" }, { abbr: "WI", name: "Wisconsin" },
  { abbr: "WY", name: "Wyoming" },
];

// ─── Formatting ───────────────────────────────────────────────────────────────

const fmt = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const pn = (s: string) => parseFloat(s.replace(/,/g, "")) || 0;

// ─── Sub-components (module scope — prevents remount on render) ───────────────

const INPUT_CLS =
  "w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2.5 text-base text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500";

function DollarInput({
  value, onChange, placeholder,
}: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-zinc-400 pointer-events-none">$</span>
      <input
        type="text"
        inputMode="numeric"
        className={INPUT_CLS + " pl-6"}
        value={value}
        onChange={e => onChange(e.target.value.replace(/[^0-9.]/g, ""))}
        placeholder={placeholder ?? "0"}
      />
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
  options, value, onChange, size = "sm",
}: {
  options: { value: string; label: string; sub?: string }[];
  value: string;
  onChange: (v: string) => void;
  size?: "sm" | "lg";
}) {
  return (
    <div className="flex gap-2">
      {options.map(o => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={`flex-1 rounded-xl font-medium border transition-colors text-center ${
            size === "lg" ? "py-3 px-4 text-sm" : "py-2 px-3 text-sm"
          } ${
            value === o.value
              ? "bg-emerald-600 text-white border-emerald-600"
              : "border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-emerald-400"
          }`}
        >
          {o.label}
          {o.sub && (
            <span className={`block text-xs font-normal mt-0.5 ${value === o.value ? "text-emerald-100" : "text-zinc-400"}`}>
              {o.sub}
            </span>
          )}
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

function Card({
  title, badge, green, children,
}: { title: string; badge?: ReactNode; green?: boolean; children: ReactNode }) {
  return (
    <div className={`rounded-2xl border p-5 ${
      green
        ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-950/20"
        : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
    }`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`font-semibold ${green ? "text-emerald-800 dark:text-emerald-300" : "text-zinc-900 dark:text-white"}`}>
          {title}
        </h3>
        {badge}
      </div>
      {children}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function VAEntitlementPage() {
  // Opening question
  const [hasActiveLoan,   setHasActiveLoan]   = useState<"no" | "yes">("no");
  // Sub-questions (only relevant when hasActiveLoan === "yes")
  const [payoffAtClosing, setPayoffAtClosing]  = useState<"no" | "yes">("no");
  const [entitlementSrc,  setEntitlementSrc]   = useState<"coe" | "loan">("coe");

  // Location
  const [state,         setState]         = useState("");
  const [county,        setCounty]        = useState("");
  const [limitOverride, setLimitOverride] = useState("");

  // Entitlement inputs
  const [entitlementCharged, setEntitlementCharged] = useState("");
  const [origVALoan,         setOrigVALoan]         = useState("");

  // Optional purchase price
  const [purchasePrice, setPurchasePrice] = useState("");

  // ── Derived location values ─────────────────────────────────────────────
  const isFlatState      = !!FLAT_STATE_LIMIT[state];
  const highCostCounties = state ? getHighCostCounties(state) : [];
  const autoLimit        = state ? getLimit(state, county) : STANDARD_LIMIT;
  const countyLimit      = limitOverride ? pn(limitOverride) : autoLimit;

  // Full entitlement: no active loan, OR active loan being paid off at closing
  const isFullEntitlement = hasActiveLoan === "no" || payoffAtClosing === "yes";

  // ── Calculation ─────────────────────────────────────────────────────────
  const r = useMemo(() => {
    const totalEntitlement = countyLimit * 0.25;

    const usedEntitlement =
      entitlementSrc === "coe"
        ? pn(entitlementCharged)
        : pn(origVALoan) * 0.25;

    const remainingEntitlement = Math.max(0, totalEntitlement - usedEntitlement);
    // Max loan the VA will fully guarantee with no down payment
    const maxZeroDownLoan = remainingEntitlement * 4;

    const ppNum = pn(purchasePrice);
    // Down payment: 25% of the gap above the max $0-down loan
    const dpNeeded = ppNum > 0 && ppNum > maxZeroDownLoan
      ? 0.25 * (ppNum - maxZeroDownLoan)
      : 0;
    const loanAmount = ppNum > 0 ? ppNum - dpNeeded : 0;

    const hasEntitlementInput =
      (entitlementSrc === "coe" && !!entitlementCharged) ||
      (entitlementSrc === "loan" && !!origVALoan);

    return {
      totalEntitlement, usedEntitlement, remainingEntitlement,
      maxZeroDownLoan, dpNeeded, loanAmount, hasEntitlementInput,
    };
  }, [countyLimit, entitlementSrc, entitlementCharged, origVALoan, purchasePrice]);

  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-10">

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">VA Entitlement Calculator</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Determine available entitlement and maximum zero-down purchase power for VA-eligible borrowers.
          </p>
        </div>

        {/* ── Opening question ──────────────────────────────────────────── */}
        <div className="mb-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
          <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100 mb-3">
            Is there an active VA loan showing on the COE?
          </p>
          <TogglePill
            size="lg"
            options={[
              { value: "no",  label: "No",  sub: "Full entitlement available" },
              { value: "yes", label: "Yes", sub: "Active loan — calculate remaining" },
            ]}
            value={hasActiveLoan}
            onChange={v => setHasActiveLoan(v as "no" | "yes")}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6 items-start">

          {/* ── Input panels ─────────────────────────────────────────── */}
          <div className="flex flex-col gap-5">

            {/* Property Location */}
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
              <h2 className="font-semibold text-zinc-900 dark:text-white mb-4">Property Location</h2>
              <div className="flex flex-col gap-4">

                <Field label="State">
                  <select
                    className={INPUT_CLS}
                    value={state}
                    onChange={e => {
                      setState(e.target.value);
                      setCounty("");
                      setLimitOverride("");
                    }}
                  >
                    <option value="">Select state…</option>
                    {STATES.map(s => (
                      <option key={s.abbr} value={s.abbr}>{s.name}</option>
                    ))}
                  </select>
                </Field>

                {state && !isFlatState && (
                  <Field
                    label="County"
                    hint={
                      highCostCounties.length > 0
                        ? "High-cost counties are listed — selecting any other county uses the standard limit."
                        : "All counties in this state use the standard limit."
                    }
                  >
                    <input
                      type="text"
                      list="va-county-list"
                      className={INPUT_CLS}
                      value={county}
                      placeholder="Type or select county…"
                      onChange={e => {
                        setCounty(e.target.value);
                        setLimitOverride(""); // reset override on county change
                      }}
                    />
                    {highCostCounties.length > 0 && (
                      <datalist id="va-county-list">
                        {highCostCounties.map(c => <option key={c} value={c} />)}
                        <option value="All other counties" />
                      </datalist>
                    )}
                  </Field>
                )}

                {state && isFlatState && (
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 -mt-1">
                    All counties in {STATES.find(s => s.abbr === state)?.name} use the same limit.
                  </p>
                )}

                <Field label="County Loan Limit (2025 FHFA)">
                  <DollarInput
                    value={limitOverride !== "" ? limitOverride : String(countyLimit)}
                    onChange={v => setLimitOverride(v)}
                    placeholder={String(STANDARD_LIMIT)}
                  />
                  {limitOverride !== "" && pn(limitOverride) !== autoLimit && (
                    <button
                      onClick={() => setLimitOverride("")}
                      className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline text-left"
                    >
                      Reset to auto ({fmt(autoLimit)})
                    </button>
                  )}
                  <p className="text-xs text-zinc-400 dark:text-zinc-500">
                    Auto-filled from state/county. Verify at{" "}
                    <a
                      href="https://www.fhfa.gov/data/conforming-loan-limit-values"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-600 dark:text-emerald-400 hover:underline"
                    >
                      fhfa.gov
                    </a>.
                  </p>
                </Field>

              </div>
            </div>

            {/* Active loan details */}
            {hasActiveLoan === "yes" && (
              <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
                <h2 className="font-semibold text-zinc-900 dark:text-white mb-4">Existing VA Loan</h2>
                <div className="flex flex-col gap-4">

                  <Field label="Will the existing loan be paid off at closing?">
                    <TogglePill
                      options={[
                        { value: "no",  label: "No — stays open" },
                        { value: "yes", label: "Yes — paid off"  },
                      ]}
                      value={payoffAtClosing}
                      onChange={v => setPayoffAtClosing(v as "no" | "yes")}
                    />
                  </Field>

                  {payoffAtClosing === "yes" && (
                    <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900 px-3 py-2.5">
                      <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                        Full entitlement is restored when the existing VA loan is paid off at closing.
                      </p>
                    </div>
                  )}

                  {payoffAtClosing === "no" && (
                    <>
                      <Field label="Entitlement information source">
                        <TogglePill
                          options={[
                            { value: "coe",  label: "From COE" },
                            { value: "loan", label: "From loan amount" },
                          ]}
                          value={entitlementSrc}
                          onChange={v => setEntitlementSrc(v as "coe" | "loan")}
                        />
                      </Field>

                      {entitlementSrc === "coe" && (
                        <Field
                          label="Entitlement Charged (from COE)"
                          hint="The dollar amount of entitlement used — shown directly on the Certificate of Eligibility."
                        >
                          <DollarInput
                            value={entitlementCharged}
                            onChange={setEntitlementCharged}
                            placeholder="201,625"
                          />
                        </Field>
                      )}

                      {entitlementSrc === "loan" && (
                        <Field
                          label="Original VA Loan Amount"
                          hint="Entitlement used = 25% of this amount, up to 25% of the county limit at origination."
                        >
                          <DollarInput
                            value={origVALoan}
                            onChange={setOrigVALoan}
                            placeholder="406,500"
                          />
                        </Field>
                      )}
                    </>
                  )}

                </div>
              </div>
            )}

            {/* Optional purchase price */}
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
              <h2 className="font-semibold text-zinc-900 dark:text-white mb-4">Purchase Price <span className="text-zinc-400 font-normal">(optional)</span></h2>
              <Field label="Target Purchase Price" hint="Calculate required down payment for a specific price.">
                <DollarInput value={purchasePrice} onChange={setPurchasePrice} placeholder="500,000" />
              </Field>
            </div>

          </div>

          {/* ── Result cards ─────────────────────────────────────────── */}
          <div className="flex flex-col gap-5">

            {/* Full entitlement */}
            {isFullEntitlement && (
              <Card
                title="VA Entitlement"
                green
                badge={
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-600 text-white">
                    Full
                  </span>
                }
              >
                <RRow label="Entitlement Status"  value="Full — 100% available"  highlight />
                <RRow label="County Loan Limit"    value={fmt(countyLimit)} />
                <RRow
                  label="Loan Limit Applies"
                  value="No"
                  sub="Blue Water Navy Vietnam Veterans Act (effective Jan 1, 2020)"
                />
                <RRow label="Minimum Down Payment" value="$0" highlight topBorder />
                <RRow
                  label="Max Loan Amount"
                  value="No limit"
                  sub="Income, credit, and debt determine the maximum"
                />

                {pn(purchasePrice) > 0 && (
                  <div className="mt-4 pt-4 border-t border-emerald-200 dark:border-emerald-800">
                    <p className="text-xs font-semibold text-emerald-600/70 dark:text-emerald-500/70 uppercase tracking-wide mb-2">
                      Purchase Scenario
                    </p>
                    <RRow label="Purchase Price" value={fmt(pn(purchasePrice))} />
                    <RRow label="Down Payment"   value="$0"                    highlight />
                    <RRow label="VA Loan Amount" value={fmt(pn(purchasePrice))} />
                  </div>
                )}
              </Card>
            )}

            {/* Remaining entitlement (active loan, not paying off) */}
            {!isFullEntitlement && (
              <>
                <Card title="Entitlement Summary">
                  <RRow
                    label="County Loan Limit"
                    value={fmt(countyLimit)}
                  />
                  <RRow
                    label="Total Entitlement Available (25% of limit)"
                    value={fmt(r.totalEntitlement)}
                    indent
                  />

                  <RRow
                    label={
                      entitlementSrc === "coe"
                        ? "Entitlement Charged (from COE)"
                        : `Entitlement Used (25% × ${origVALoan ? fmt(pn(origVALoan)) : "loan amount"})`
                    }
                    value={r.hasEntitlementInput ? fmt(r.usedEntitlement) : "—"}
                    topBorder
                  />
                  <RRow
                    label="Remaining Entitlement"
                    value={r.hasEntitlementInput ? fmt(r.remainingEntitlement) : "—"}
                    highlight
                  />
                  <RRow
                    label="Max $0-Down Loan (remaining × 4)"
                    value={r.hasEntitlementInput ? fmt(r.maxZeroDownLoan) : "—"}
                    highlight
                    topBorder
                  />

                  {r.hasEntitlementInput && r.remainingEntitlement > 0 && (
                    <p className="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800 text-xs text-zinc-400 dark:text-zinc-500 italic">
                      VA guarantees 25% of the loan. Remaining entitlement of {fmt(r.remainingEntitlement)} × 4 gives the maximum loan fully backed with zero down.
                    </p>
                  )}

                  {r.hasEntitlementInput && r.remainingEntitlement === 0 && (
                    <div className="mt-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-800 px-3 py-2.5">
                      <p className="text-xs text-amber-700 dark:text-amber-400">
                        No remaining entitlement. A new VA purchase would require a down payment equal to 25% of the full purchase price — or the existing loan must be paid off at closing to restore entitlement.
                      </p>
                    </div>
                  )}
                </Card>

                {/* Purchase price scenario */}
                {pn(purchasePrice) > 0 && r.hasEntitlementInput && (
                  <Card title="Purchase Scenario">
                    <RRow label="Purchase Price"   value={fmt(pn(purchasePrice))} />
                    <RRow label="Max $0-Down Loan" value={fmt(r.maxZeroDownLoan)} />

                    {r.dpNeeded > 0 ? (
                      <>
                        <RRow
                          label="Down Payment Required"
                          value={fmt(r.dpNeeded)}
                          sub={`25% × (${fmt(pn(purchasePrice))} − ${fmt(r.maxZeroDownLoan)})`}
                          topBorder
                        />
                        <RRow label="VA Loan Amount" value={fmt(r.loanAmount)} highlight />
                        <p className="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800 text-xs text-zinc-400 dark:text-zinc-500 italic">
                          Down payment bridges the gap so the remaining {fmt(r.remainingEntitlement)} in entitlement still covers 25% of the loan amount.
                        </p>
                      </>
                    ) : (
                      <>
                        <RRow label="Down Payment Required" value="$0" highlight topBorder />
                        <RRow label="VA Loan Amount" value={fmt(pn(purchasePrice))} />
                      </>
                    )}
                  </Card>
                )}
              </>
            )}

            {/* Contextual note */}
            <div className="rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-700 px-4 py-3">
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                <span className="font-semibold">Note:</span> County limits shown are 2025 FHFA estimates — confirm at{" "}
                <a
                  href="https://www.fhfa.gov/data/conforming-loan-limit-values"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  fhfa.gov
                </a>
                . Results reflect a single concurrent VA loan. Multiple active VA loans, prior foreclosures, or compromised entitlement require a full COE review.
              </p>
            </div>

          </div>
        </div>
      </main>
    </>
  );
}
