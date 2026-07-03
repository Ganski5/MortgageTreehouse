"use client";

import { useState, useMemo, type ReactNode } from "react";
import { Header } from "../../components/Header";

// ─── Rental Income — Fannie Mae B3-3.1-08 / Freddie Mac 5306.1 ───────────────
// Schedule E method: net income + add-backs, averaged over 1 or 2 years.
// Lease Agreement method: 75% of gross rent (vacancy/maintenance factor).
// Net method (VA/FHA): gross rent minus PITIA — positive = income, negative = liability.

type Method  = "schedule-e" | "lease";
type LeaseCalcType = "75pct" | "net";

const fmt = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

const pn = (s: string) => parseFloat(s.replace(/[^0-9.-]/g, "")) || 0;

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

function DollarInput({
  value, onChange, placeholder, allowNegative,
}: {
  value: string; onChange: (v: string) => void; placeholder?: string; allowNegative?: boolean;
}) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base text-zinc-400 pointer-events-none">$</span>
      <input
        type="text"
        inputMode="decimal"
        className={INPUT_CLS + " pl-7"}
        value={value}
        onChange={e => onChange(e.target.value.replace(allowNegative ? /[^0-9.-]/g : /[^0-9.]/g, ""))}
        placeholder={placeholder ?? "0"}
      />
    </div>
  );
}

function TogglePill({
  options, value, onChange,
}: {
  options: { value: string; label: string; sub?: string }[];
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

function RRow({ label, value, sub, highlight, topBorder, indent }: {
  label: string; value: string; sub?: string;
  highlight?: boolean; topBorder?: boolean; indent?: boolean;
}) {
  return (
    <div className={`flex items-start justify-between gap-4 py-2.5 ${topBorder ? "border-t border-zinc-100 dark:border-zinc-800" : ""}`}>
      <span className={`text-sm leading-snug font-medium ${indent ? "pl-3 text-zinc-400 dark:text-zinc-500" : "text-zinc-600 dark:text-zinc-300"}`}>
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

// ─── Schedule E year panel ────────────────────────────────────────────────────

interface YearFields {
  netIncome:    string;
  depreciation: string;
  mortgageInt:  string;
  taxes:        string;
  insurance:    string;
  hoa:          string;
}

const EMPTY_YEAR: YearFields = {
  netIncome: "", depreciation: "", mortgageInt: "", taxes: "", insurance: "", hoa: "",
};

function yearAdjusted(f: YearFields): number {
  return pn(f.netIncome) + pn(f.depreciation) + pn(f.mortgageInt) + pn(f.taxes) + pn(f.insurance) + pn(f.hoa);
}

function YearPanel({
  label, fields, onChange,
}: {
  label: string;
  fields: YearFields;
  onChange: (f: YearFields) => void;
}) {
  const set = (k: keyof YearFields) => (v: string) => onChange({ ...fields, [k]: v });
  return (
    <div className="flex flex-col gap-4 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30">
      <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{label}</p>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Net Income / Loss" hint="Schedule E, Line 21">
          <DollarInput value={fields.netIncome}    onChange={set("netIncome")}    placeholder="0" allowNegative />
        </Field>
        <Field label="Depreciation" hint="Line 18">
          <DollarInput value={fields.depreciation} onChange={set("depreciation")} placeholder="0" />
        </Field>
        <Field label="Mortgage Interest" hint="Line 12">
          <DollarInput value={fields.mortgageInt}  onChange={set("mortgageInt")}  placeholder="0" />
        </Field>
        <Field label="Taxes" hint="Line 16">
          <DollarInput value={fields.taxes}        onChange={set("taxes")}        placeholder="0" />
        </Field>
        <Field label="Insurance" hint="Line 9">
          <DollarInput value={fields.insurance}    onChange={set("insurance")}    placeholder="0" />
        </Field>
        <Field label="HOA / One-Time Expenses" hint="If applicable, Line 19">
          <DollarInput value={fields.hoa}          onChange={set("hoa")}          placeholder="0" />
        </Field>
      </div>
    </div>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────

export default function RentalIncomePage() {
  const [method,     setMethod]     = useState<Method>("schedule-e");
  const [useYear2,   setUseYear2]   = useState(false);
  const [year1,      setYear1]      = useState<YearFields>(EMPTY_YEAR);
  const [year2,      setYear2]      = useState<YearFields>(EMPTY_YEAR);

  // PITIA for the rental property
  const [pi,        setPi]        = useState("");  // monthly principal & interest
  const [escrowed,  setEscrowed]  = useState<"yes" | "no">("yes");
  const [tiMonthly, setTiMonthly] = useState("");  // monthly taxes + insurance (escrow or direct)
  const [hoaMonthly, setHoaMonthly] = useState(""); // monthly HOA

  const [rentSource, setRentSource] = useState<"lease" | "1007">("lease");
  const [grossRent,  setGrossRent]  = useState("");
  const [pitia,      setPitia]      = useState("");
  const [leaseCalc,  setLeaseCalc]  = useState<LeaseCalcType>("75pct");

  const monthlyPITIA = pn(pi) + pn(tiMonthly) + pn(hoaMonthly);

  const schedResult = useMemo(() => {
    const adj1 = yearAdjusted(year1);
    if (!useYear2) {
      const monthly = adj1 / 12;
      return { monthly, annual: adj1, avgMethod: "1-year", adj1, adj2: null, declining: false };
    }
    const adj2 = yearAdjusted(year2);
    const declining = adj2 < adj1;
    const annual = declining ? adj2 : (adj1 + adj2) / 2;
    return { monthly: annual / 12, annual, avgMethod: declining ? "Year 2 only (declining)" : "2-year average", adj1, adj2, declining };
  }, [year1, year2, useYear2]);

  const leaseResult = useMemo(() => {
    const rent  = pn(grossRent);
    const pitN  = pn(pitia);
    if (leaseCalc === "75pct") {
      const qualifying = rent * 0.75;
      return { qualifying, note: "75% of gross rent" };
    }
    const net = rent - pitN;
    return { qualifying: net, note: net >= 0 ? "Net income (rent − PITIA)" : "Net liability (rent − PITIA)" };
  }, [grossRent, pitia, leaseCalc]);

  const schedReady = pn(year1.netIncome) !== 0 || pn(year1.depreciation) !== 0 || pn(year1.mortgageInt) !== 0;
  const leaseReady = pn(grossRent) > 0;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Header />
      <main className="max-w-xl mx-auto px-4 py-10 flex flex-col gap-8">

        {/* Title */}
        <div>
          <a href="/" className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 mb-4 transition-colors">
            ← Back to Calculators
          </a>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Rental Income</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Calculate qualifying rental income from Schedule E or a lease agreement.
          </p>
        </div>

        {/* Method */}
        <TogglePill
          options={[
            { value: "schedule-e", label: "Schedule E",      sub: "Tax return method" },
            { value: "lease",      label: "Lease / 1007",    sub: "75% or net method" },
          ]}
          value={method}
          onChange={v => setMethod(v as Method)}
        />

        {/* ── Schedule E ─────────────────────────────────────────────────────── */}
        {method === "schedule-e" && (
          <>
            <YearPanel
              label={useYear2 ? "Year 1 (older)" : "Tax Year"}
              fields={year1}
              onChange={setYear1}
            />

            {/* Add Year 2 toggle */}
            <button
              onClick={() => setUseYear2(v => !v)}
              className="self-start text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              {useYear2 ? "− Remove Year 2" : "+ Add Year 2 (for 2-year average)"}
            </button>

            {useYear2 && (
              <YearPanel label="Year 2 (most recent)" fields={year2} onChange={setYear2} />
            )}

            {/* PITIA for the rental property */}
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 flex flex-col gap-5">
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-white">Property PITIA</h3>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">Monthly housing expense for the rental property — used to calculate net rental income.</p>
              </div>

              <Field label="Monthly Principal & Interest">
                <DollarInput value={pi} onChange={setPi} placeholder="1,400" />
              </Field>

              <Field label="Are taxes & insurance escrowed?">
                <TogglePill
                  options={[
                    { value: "yes", label: "Yes — escrowed" },
                    { value: "no",  label: "No — paid directly" },
                  ]}
                  value={escrowed}
                  onChange={v => setEscrowed(v as "yes" | "no")}
                />
              </Field>

              {escrowed === "yes" && (
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                  <p className="text-xs text-amber-700 dark:text-amber-400 font-medium leading-relaxed">
                    When T&I are escrowed, the servicer disburses taxes and insurance from the escrow account — these amounts should still appear as deductions on Schedule E (Line 16 for taxes, and in the insurance/expense lines). Verify the Schedule E figures match your escrow analysis before using this income.
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <Field
                  label={escrowed === "yes" ? "Monthly Escrow (T&I)" : "Monthly Taxes & Insurance"}
                  hint={escrowed === "yes" ? "From escrow account statement" : "Paid directly outside of mortgage"}
                >
                  <DollarInput value={tiMonthly} onChange={setTiMonthly} placeholder="400" />
                </Field>
                <Field label="Monthly HOA" hint="If applicable">
                  <DollarInput value={hoaMonthly} onChange={setHoaMonthly} placeholder="0" />
                </Field>
              </div>

              {monthlyPITIA > 0 && (
                <div className="flex items-center justify-between py-2 border-t border-zinc-100 dark:border-zinc-800">
                  <span className="text-sm font-semibold text-zinc-600 dark:text-zinc-300">Total Monthly PITIA</span>
                  <span className="text-base font-bold text-zinc-900 dark:text-white">{fmt(monthlyPITIA)}</span>
                </div>
              )}
            </div>

            {/* Schedule E Result */}
            {(() => {
              const netMonthly = schedResult.monthly - monthlyPITIA;
              const hasPITIA   = monthlyPITIA > 0;
              const finalIncome = hasPITIA ? netMonthly : schedResult.monthly;
              const isPositive  = finalIncome >= 0;
              return (
                <div className={`rounded-2xl border p-6 ${
                  schedReady
                    ? isPositive
                      ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-950/20"
                      : "border-red-200 dark:border-red-900 bg-red-50/60 dark:bg-red-950/20"
                    : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
                }`}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-zinc-900 dark:text-white text-base">Qualifying Income</h2>
                    {schedReady && (
                      <span className="text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 px-2.5 py-1 rounded-full">
                        {schedResult.avgMethod}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <RRow
                      label="Year 1 Adjusted"
                      value={schedReady ? fmt(schedResult.adj1) : "—"}
                      sub="Net income + depreciation + interest + taxes + HOA/insurance"
                    />
                    {schedResult.adj2 !== null && (
                      <RRow
                        label="Year 2 Adjusted"
                        value={fmt(schedResult.adj2)}
                        sub={schedResult.declining ? "Lower than Year 1 — declining income rule applies" : ""}
                        topBorder
                      />
                    )}
                    <RRow
                      label="Annual Adjusted Income"
                      value={schedReady ? fmt(schedResult.annual) : "—"}
                      topBorder
                    />
                    <RRow
                      label="Gross Monthly Income"
                      value={schedReady ? fmt(schedResult.monthly) : "—"}
                      topBorder
                    />
                    {hasPITIA && (
                      <>
                        <RRow
                          label="Monthly PITIA"
                          value={schedReady ? `(${fmt(monthlyPITIA)})` : "—"}
                          indent
                          topBorder
                        />
                        <RRow
                          label="Net Monthly Income"
                          value={schedReady ? fmt(netMonthly) : "—"}
                          sub={!isPositive ? "Negative — treat as monthly liability in DTI" : undefined}
                          highlight={isPositive}
                          topBorder
                        />
                      </>
                    )}
                    {!hasPITIA && (
                      <RRow
                        label="Net Monthly Income"
                        value={schedReady ? fmt(schedResult.monthly) : "—"}
                        sub="Enter PITIA above to calculate net income"
                        highlight={schedResult.monthly > 0}
                        topBorder
                      />
                    )}
                  </div>

                  {schedReady && schedResult.declining && (
                    <div className="mt-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                      <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">
                        Declining income — Year 2 is lower than Year 1. Per Fannie Mae B3-3.1-08, use the most recent year only when income is declining.
                      </p>
                    </div>
                  )}

                  {schedReady && hasPITIA && !isPositive && (
                    <div className="mt-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
                      <p className="text-xs text-red-700 dark:text-red-400 font-medium">
                        Net rental income is negative — this amount must be counted as a recurring monthly liability in the borrower&apos;s DTI rather than qualifying income.
                      </p>
                    </div>
                  )}

                  <p className="mt-4 text-xs text-zinc-400 dark:text-zinc-500 italic border-t border-zinc-100 dark:border-zinc-800 pt-3">
                    Fannie Mae B3-3.1-08 / Freddie Mac 5306.1 — Add back non-cash expenses (depreciation) and expenses already captured in PITIA (mortgage interest, taxes). Two-year average applies unless income is declining.
                  </p>
                </div>
              );
            })()}
          </>
        )}

        {/* ── Lease Agreement ────────────────────────────────────────────────── */}
        {method === "lease" && (
          <>
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 flex flex-col gap-5">

              <Field label="Rent Source">
                <TogglePill
                  options={[
                    { value: "lease", label: "Lease Agreement" },
                    { value: "1007",  label: "Rent Schedule (1007)" },
                  ]}
                  value={rentSource}
                  onChange={v => setRentSource(v as "lease" | "1007")}
                />
              </Field>

              <Field
                label="Monthly Gross Rent"
                hint={rentSource === "lease"
                  ? "Monthly amount stated in the executed lease agreement."
                  : "Market rent from appraiser's Form 1007 (Single Family Comparable Rent Schedule)."}
              >
                <DollarInput value={grossRent} onChange={setGrossRent} placeholder="2,500" />
              </Field>

              <Field label="Calculation Method">
                <TogglePill
                  options={[
                    { value: "75pct", label: "75% Rule",       sub: "Fannie Mae / Freddie Mac" },
                    { value: "net",   label: "Net After PITIA", sub: "VA / FHA" },
                  ]}
                  value={leaseCalc}
                  onChange={v => setLeaseCalc(v as LeaseCalcType)}
                />
              </Field>

              {leaseCalc === "net" && (
                <Field label="Monthly PITIA" hint="Principal, interest, taxes, insurance, and HOA for the rental property.">
                  <DollarInput value={pitia} onChange={setPitia} placeholder="1,800" />
                </Field>
              )}
            </div>

            {/* Lease Result */}
            <div className={`rounded-2xl border p-6 ${
              leaseReady
                ? leaseResult.qualifying > 0
                  ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-950/20"
                  : "border-red-200 dark:border-red-900 bg-red-50/60 dark:bg-red-950/20"
                : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
            }`}>
              <h2 className="font-semibold text-zinc-900 dark:text-white text-base mb-4">Qualifying Income</h2>

              <div className="flex flex-col">
                <RRow label="Gross Rent"  value={leaseReady ? fmt(pn(grossRent)) : "—"} />

                {leaseCalc === "75pct" && (
                  <RRow label="Vacancy / Maintenance Factor" value="25%" topBorder indent />
                )}

                {leaseCalc === "net" && pn(pitia) > 0 && (
                  <RRow label="Monthly PITIA" value={fmt(pn(pitia))} topBorder indent />
                )}

                <RRow
                  label="Monthly Qualifying Income"
                  value={leaseReady ? fmt(leaseResult.qualifying) : "—"}
                  sub={leaseResult.note}
                  highlight={leaseResult.qualifying > 0}
                  topBorder
                />
              </div>

              {leaseReady && leaseResult.qualifying < 0 && (
                <div className="mt-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
                  <p className="text-xs text-red-700 dark:text-red-400 font-medium">
                    Net rental income is negative — this amount must be counted as a monthly liability in the borrower&apos;s DTI rather than qualifying income.
                  </p>
                </div>
              )}

              <p className="mt-4 text-xs text-zinc-400 dark:text-zinc-500 italic border-t border-zinc-100 dark:border-zinc-800 pt-3">
                {leaseCalc === "75pct"
                  ? `Fannie Mae B3-3.1-08 — 75% of gross rent used to account for vacancy and maintenance. Rent sourced from ${rentSource === "1007" ? "Form 1007 (Single Family Comparable Rent Schedule)" : "executed lease agreement"}.`
                  : `VA Lenders Handbook Ch. 4 / FHA 4000.1 — Net rental income is gross rent minus full PITIA. Negative net income is treated as a recurring liability. Rent sourced from ${rentSource === "1007" ? "Form 1007" : "executed lease agreement"}.`}
              </p>
            </div>
          </>
        )}

      </main>
    </div>
  );
}
