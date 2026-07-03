"use client";

import { useState, useMemo } from "react";
import { Header } from "../../components/Header";

// ─── Constants ────────────────────────────────────────────────────────────────

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

// cushionMonths = RESPA standard for that state (federal max is 2; all states currently 2)
const STATE_DATA: { abbr: string; name: string; taxMonths: number[]; note: string; cushionMonths: number }[] = [
  { abbr:"AL", name:"Alabama",        taxMonths:[10],       note:"Annual – October",                        cushionMonths:2 },
  { abbr:"AK", name:"Alaska",         taxMonths:[10],       note:"Annual – October (varies)",               cushionMonths:2 },
  { abbr:"AZ", name:"Arizona",        taxMonths:[10,3],     note:"Semi-annual – Oct & Mar",                 cushionMonths:2 },
  { abbr:"AR", name:"Arkansas",       taxMonths:[10],       note:"Annual – October 15",                     cushionMonths:2 },
  { abbr:"CA", name:"California",     taxMonths:[11,2],     note:"Semi-annual – Nov & Feb",                 cushionMonths:2 },
  { abbr:"CO", name:"Colorado",       taxMonths:[2,6],      note:"Semi-annual – Feb & Jun",                 cushionMonths:2 },
  { abbr:"CT", name:"Connecticut",    taxMonths:[7,1],      note:"Semi-annual – Jul & Jan",                 cushionMonths:2 },
  { abbr:"DE", name:"Delaware",       taxMonths:[9,3],      note:"Semi-annual – Sep & Mar (varies)",        cushionMonths:2 },
  { abbr:"DC", name:"Washington D.C.",taxMonths:[3,9],      note:"Semi-annual – Mar & Sep",                 cushionMonths:2 },
  { abbr:"FL", name:"Florida",        taxMonths:[3],        note:"Annual – March 31 (discount Nov–Feb)",    cushionMonths:2 },
  { abbr:"GA", name:"Georgia",        taxMonths:[11],       note:"Annual – November (varies by county)",    cushionMonths:2 },
  { abbr:"HI", name:"Hawaii",         taxMonths:[8,2],      note:"Semi-annual – Aug & Feb",                 cushionMonths:2 },
  { abbr:"ID", name:"Idaho",          taxMonths:[12,6],     note:"Semi-annual – Dec & Jun",                 cushionMonths:2 },
  { abbr:"IL", name:"Illinois",       taxMonths:[6,9],      note:"Semi-annual – Jun & Sep (varies)",        cushionMonths:2 },
  { abbr:"IN", name:"Indiana",        taxMonths:[5,11],     note:"Semi-annual – May & Nov",                 cushionMonths:2 },
  { abbr:"IA", name:"Iowa",           taxMonths:[9,3],      note:"Semi-annual – Sep & Mar",                 cushionMonths:2 },
  { abbr:"KS", name:"Kansas",         taxMonths:[12,5],     note:"Semi-annual – Dec & May",                 cushionMonths:2 },
  { abbr:"KY", name:"Kentucky",       taxMonths:[10,4],     note:"Semi-annual – Oct & Apr",                 cushionMonths:2 },
  { abbr:"LA", name:"Louisiana",      taxMonths:[12],       note:"Annual – December (varies)",              cushionMonths:2 },
  { abbr:"ME", name:"Maine",          taxMonths:[9],        note:"Annual – September (varies)",             cushionMonths:2 },
  { abbr:"MD", name:"Maryland",       taxMonths:[9,3],      note:"Semi-annual – Sep & Mar",                 cushionMonths:2 },
  { abbr:"MA", name:"Massachusetts",  taxMonths:[2,5,8,11], note:"Quarterly – Feb, May, Aug, Nov",          cushionMonths:2 },
  { abbr:"MI", name:"Michigan",       taxMonths:[7,12],     note:"Semi-annual – Jul & Dec",                 cushionMonths:2 },
  { abbr:"MN", name:"Minnesota",      taxMonths:[5,10],     note:"Semi-annual – May & Oct",                 cushionMonths:2 },
  { abbr:"MS", name:"Mississippi",    taxMonths:[2],        note:"Annual – February",                       cushionMonths:2 },
  { abbr:"MO", name:"Missouri",       taxMonths:[12],       note:"Annual – December",                       cushionMonths:2 },
  { abbr:"MT", name:"Montana",        taxMonths:[11,5],     note:"Semi-annual – Nov & May",                 cushionMonths:1 },
  { abbr:"NE", name:"Nebraska",       taxMonths:[3,7],      note:"Semi-annual – Mar & Jul",                 cushionMonths:2 },
  { abbr:"NV", name:"Nevada",         taxMonths:[8,1],      note:"Semi-annual – Aug & Jan",                 cushionMonths:0 },
  { abbr:"NH", name:"New Hampshire",  taxMonths:[7,12],     note:"Semi-annual – Jul & Dec",                 cushionMonths:2 },
  { abbr:"NJ", name:"New Jersey",     taxMonths:[2,5,8,11], note:"Quarterly – Feb, May, Aug, Nov",          cushionMonths:2 },
  { abbr:"NM", name:"New Mexico",     taxMonths:[11],       note:"Annual – November (varies)",              cushionMonths:2 },
  { abbr:"NY", name:"New York",       taxMonths:[1,7],      note:"Semi-annual – Jan & Jul (varies by county)", cushionMonths:2 },
  { abbr:"NC", name:"North Carolina", taxMonths:[9],        note:"Annual – September",                      cushionMonths:2 },
  { abbr:"ND", name:"North Dakota",   taxMonths:[2,6],      note:"Semi-annual – Feb & Jun",                 cushionMonths:0 },
  { abbr:"OH", name:"Ohio",           taxMonths:[1,6],      note:"Semi-annual – Jan & Jun",                 cushionMonths:2 },
  { abbr:"OK", name:"Oklahoma",       taxMonths:[12],       note:"Annual – December",                       cushionMonths:2 },
  { abbr:"OR", name:"Oregon",         taxMonths:[11,5],     note:"Semi-annual – Nov & May",                 cushionMonths:2 },
  { abbr:"PA", name:"Pennsylvania",   taxMonths:[3,7],      note:"Semi-annual – Mar & Jul (varies)",        cushionMonths:2 },
  { abbr:"RI", name:"Rhode Island",   taxMonths:[7,1],      note:"Semi-annual – Jul & Jan",                 cushionMonths:2 },
  { abbr:"SC", name:"South Carolina", taxMonths:[1],        note:"Annual – January 15",                     cushionMonths:2 },
  { abbr:"SD", name:"South Dakota",   taxMonths:[4,10],     note:"Semi-annual – Apr & Oct",                 cushionMonths:2 },
  { abbr:"TN", name:"Tennessee",      taxMonths:[10],       note:"Annual – October",                        cushionMonths:2 },
  { abbr:"TX", name:"Texas",          taxMonths:[1],        note:"Annual – January 31",                     cushionMonths:2 },
  { abbr:"UT", name:"Utah",           taxMonths:[11,5],     note:"Semi-annual – Nov & May",                 cushionMonths:2 },
  { abbr:"VT", name:"Vermont",        taxMonths:[2,5,8,11], note:"Quarterly – Feb, May, Aug, Nov",          cushionMonths:2 },
  { abbr:"VA", name:"Virginia",       taxMonths:[6,12],     note:"Semi-annual – Jun & Dec (varies)",        cushionMonths:2 },
  { abbr:"WA", name:"Washington",     taxMonths:[4,10],     note:"Semi-annual – Apr & Oct",                 cushionMonths:2 },
  { abbr:"WV", name:"West Virginia",  taxMonths:[9,3],      note:"Semi-annual – Sep & Mar",                 cushionMonths:2 },
  { abbr:"WI", name:"Wisconsin",      taxMonths:[1,7],      note:"Semi-annual – Jan & Jul",                 cushionMonths:2 },
  { abbr:"WY", name:"Wyoming",        taxMonths:[5,11],     note:"Semi-annual – May & Nov",                 cushionMonths:2 },
] as const;

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 5 }, (_, i) => CURRENT_YEAR + i);

const CLS = {
  select: "w-full py-2.5 px-3 text-base rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white outline-none focus:border-emerald-400 transition",
  input:  "w-full py-2.5 px-3 text-base rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white outline-none focus:border-emerald-400 transition",
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface MonthDetail {
  index:     number;
  month:     number;
  year:      number;
  label:     string;
  collected: number;
  taxOut:    number;
  insOut:    number;
  balance:   number;
  isPast:    boolean;
  isCurrent: boolean;
}

interface EscrowResult {
  taxMonthly:     number;
  insMonthly:     number;
  pmiMonthly:     number;
  totalMonthly:   number;
  cushionAmount:  number;
  initialDeposit: number;
  schedule:       MonthDetail[];
  minBalance:     number;
  minIndex:       number;
}

// ─── Pure helpers ─────────────────────────────────────────────────────────────

function n(s: string | number): number {
  if (typeof s === "number") return s;
  return parseFloat(s.replace(/[^0-9.-]/g, "")) || 0;
}
function curr(v: number) {
  return v.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}
function currCents(v: number) {
  return v.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function buildSchedule(
  closingMonth:     number,
  closingYear:      number,
  totalMonthly:     number,
  taxPerPayment:    number,
  taxPaymentMonths: readonly number[],
  annualInsurance:  number,
  insRenewalMonth:  number,
  initialDeposit:   number,
): MonthDetail[] {
  const today  = new Date();
  const todayY = today.getFullYear();
  const todayM = today.getMonth() + 1;
  let balance  = initialDeposit;

  return Array.from({ length: 12 }, (_, i) => {
    const raw    = closingMonth + i + 1;
    const month  = ((raw - 1) % 12) + 1;
    const year   = closingYear + Math.floor((raw - 1) / 12);
    const taxOut = taxPaymentMonths.includes(month as never) ? taxPerPayment : 0;
    const insOut = month === insRenewalMonth ? annualInsurance : 0;
    balance     += totalMonthly - taxOut - insOut;
    return {
      index:     i,
      month,
      year,
      label:     `${MONTH_NAMES[month - 1]} ${year}`,
      collected: totalMonthly,
      taxOut,
      insOut,
      balance,
      isPast:    year < todayY || (year === todayY && month < todayM),
      isCurrent: year === todayY && month === todayM,
    };
  });
}

function calcEscrow(
  closingMonth:     number,
  closingYear:      number,
  annualTax:        number,
  taxPaymentMonths: readonly number[],
  annualInsurance:  number,
  insRenewalMonth:  number,
  monthlyPMI:       number,
  cushionMonths:    number,
): EscrowResult | null {
  if (!annualTax && !annualInsurance) return null;

  const taxMonthly    = annualTax / 12;
  const insMonthly    = annualInsurance / 12;
  const totalMonthly  = taxMonthly + insMonthly + monthlyPMI;
  const cushionAmount = cushionMonths * totalMonthly;
  const taxPerPayment = taxPaymentMonths.length > 0 ? annualTax / taxPaymentMonths.length : 0;

  const draft    = buildSchedule(closingMonth, closingYear, totalMonthly, taxPerPayment, taxPaymentMonths, annualInsurance, insRenewalMonth, 0);
  const minRaw   = Math.min(...draft.map(m => m.balance));
  const minIndex = draft.findIndex(m => m.balance === minRaw);

  const initialDeposit = Math.max(0, Math.ceil(cushionAmount - minRaw));
  const schedule = buildSchedule(closingMonth, closingYear, totalMonthly, taxPerPayment, taxPaymentMonths, annualInsurance, insRenewalMonth, initialDeposit);

  return {
    taxMonthly,
    insMonthly,
    pmiMonthly:    monthlyPMI,
    totalMonthly,
    cushionAmount,
    initialDeposit,
    schedule,
    minBalance: minRaw + initialDeposit,
    minIndex,
  };
}

// ─── DollarField — defined OUTSIDE the page component to prevent remounting ───

function DollarField({ label, value, onChange, placeholder, info }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; info?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
        {label}{info && <span className="ml-1 font-normal text-zinc-400">{info}</span>}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm select-none">$</span>
        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder ?? "0"}
          className={`${CLS.input} pl-7`}
        />
      </div>
    </div>
  );
}

// ─── MonthRow — also outside to keep it stable ───────────────────────────────

function MonthRow({ detail, cushionAmount, isLowest }: {
  detail: MonthDetail;
  cushionAmount: number;
  isLowest: boolean;
}) {
  const hasBill = detail.taxOut > 0 || detail.insOut > 0;
  const status  = detail.balance >= cushionAmount ? "healthy"
                : detail.balance >= 0             ? "low"
                : "deficit";

  return (
    <div className={`flex items-start gap-3 p-4 rounded-xl border transition-all ${
      detail.isPast      ? "border-zinc-100 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-800/20 opacity-70"
      : detail.isCurrent ? "border-emerald-300 dark:border-emerald-700 bg-emerald-50/40 dark:bg-emerald-950/20 shadow-sm"
      : hasBill          ? "border-amber-100 dark:border-amber-900/40 bg-amber-50/30 dark:bg-amber-950/10"
      : "border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950"
    }`}>

      {/* Checkbox indicator */}
      <div className="flex-shrink-0 mt-0.5">
        {detail.isPast ? (
          <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center shadow-sm">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        ) : detail.isCurrent ? (
          <div className="w-7 h-7 rounded-full bg-amber-400 flex items-center justify-center shadow-sm">
            <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse" />
          </div>
        ) : hasBill ? (
          <div className="w-7 h-7 rounded-full border-2 border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center">
            <span className="text-xs font-bold text-amber-500">{detail.index + 1}</span>
          </div>
        ) : (
          <div className="w-7 h-7 rounded-full border-2 border-zinc-200 dark:border-zinc-700 flex items-center justify-center">
            <span className="text-xs font-bold text-zinc-300 dark:text-zinc-600">{detail.index + 1}</span>
          </div>
        )}
      </div>

      {/* Month info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center flex-wrap gap-1.5 mb-1">
          <span className="text-sm font-semibold text-zinc-900 dark:text-white">{detail.label}</span>
          {detail.isCurrent && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 font-medium">Current</span>
          )}
          {detail.taxOut > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-400 font-medium">🏛 Tax Due</span>
          )}
          {detail.insOut > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 font-medium">🛡 Insurance</span>
          )}
          {isLowest && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-medium">Lowest Balance</span>
          )}
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-zinc-500 dark:text-zinc-400">
          <span className="text-emerald-600 dark:text-emerald-400">+ {currCents(detail.collected)} collected</span>
          {detail.taxOut > 0 && (
            <span className="text-red-500 dark:text-red-400">− {curr(detail.taxOut)} property tax</span>
          )}
          {detail.insOut > 0 && (
            <span className="text-blue-500 dark:text-blue-400">− {curr(detail.insOut)} insurance renewal</span>
          )}
        </div>
      </div>

      {/* Balance */}
      <div className="flex-shrink-0 text-right min-w-[90px]">
        <div className={`text-sm font-bold tabular-nums ${
          status === "healthy" ? "text-emerald-600 dark:text-emerald-400"
          : status === "low"   ? "text-amber-600 dark:text-amber-400"
          : "text-red-600 dark:text-red-400"
        }`}>
          {curr(detail.balance)}
        </div>
        <div className={`text-xs mt-0.5 font-medium ${
          status === "healthy" ? "text-emerald-500"
          : status === "low"   ? "text-amber-500"
          : "text-red-500"
        }`}>
          {status === "healthy" ? "✓ healthy" : status === "low" ? "⚠ at cushion" : "⚠ deficit"}
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EscrowClosingPage() {
  const [closingMonth,      setClosingMonth]      = useState(String(new Date().getMonth() + 1));
  const [closingYear,       setClosingYear]       = useState(String(CURRENT_YEAR));
  const [stateAbbr,         setStateAbbr]         = useState("CA");
  const [annualTax,         setAnnualTax]         = useState("");
  const [annualIns,         setAnnualIns]         = useState("");
  const [monthlyPMI,        setMonthlyPMI]        = useState("");
  const [insRenewalMonth,   setInsRenewalMonth]   = useState(String(new Date().getMonth() + 1));
  const [renewalOverridden, setRenewalOverridden] = useState(false);
  const [firstYearPremium,  setFirstYearPremium]  = useState("");
  const [prepaidDays,       setPrepaidDays]       = useState("");
  const [dailyInterest,     setDailyInterest]     = useState("");

  function handleClosingMonthChange(v: string) {
    setClosingMonth(v);
    if (!renewalOverridden) setInsRenewalMonth(v);
  }

  const selectedState = STATE_DATA.find(s => s.abbr === stateAbbr) ?? STATE_DATA[4];
  const cushionMonths = selectedState.cushionMonths; // auto from state

  const result = useMemo(() => calcEscrow(
    n(closingMonth),
    n(closingYear),
    n(annualTax),
    selectedState.taxMonths,
    n(annualIns),
    n(insRenewalMonth),
    n(monthlyPMI),
    cushionMonths,
  ), [closingMonth, closingYear, annualTax, selectedState, annualIns, insRenewalMonth, monthlyPMI, cushionMonths]);

  const prepaidInterest = n(prepaidDays) * n(dailyInterest);
  const firstYearPrem   = n(firstYearPremium) || n(annualIns);
  const totalPrepaids   = firstYearPrem + prepaidInterest;
  const totalAtClosing  = (result?.initialDeposit ?? 0) + totalPrepaids;
  const hasAny          = !!(n(annualTax) || n(annualIns));

  return (
    <div className="flex flex-col min-h-full bg-white dark:bg-zinc-950 font-[family-name:var(--font-geist-sans)]">
      <Header backLink={{ href: "/#calculators", label: "All Calculators" }} />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-10 flex flex-col gap-10">

        {/* Title */}
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Escrow at Closing</h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1.5">
            Calculate the initial escrow deposit by state, with a 12-month payment timeline showing every tax and insurance disbursement.
          </p>
        </div>

        {/* ── Inputs ──────────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Closing Details */}
          <section className="flex flex-col gap-4 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Closing Details</h2>

            {/* State */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">State</label>
              <select value={stateAbbr} onChange={e => setStateAbbr(e.target.value)} className={CLS.select}>
                {STATE_DATA.map(s => (
                  <option key={s.abbr} value={s.abbr}>{s.name} ({s.abbr})</option>
                ))}
              </select>
              <div className="mt-1 flex items-start gap-2 text-xs">
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">📅 {selectedState.note}</span>
                <span className="text-zinc-400">— verify dates with title</span>
              </div>
            </div>

            {/* Closing Month + Year */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Closing Month</label>
                <select value={closingMonth} onChange={e => handleClosingMonthChange(e.target.value)} className={CLS.select}>
                  {MONTH_NAMES.map((m, i) => (
                    <option key={i} value={i + 1}>{m}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Closing Year</label>
                <select value={closingYear} onChange={e => setClosingYear(e.target.value)} className={CLS.select}>
                  {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>

            {/* Auto cushion display */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900">
              <div>
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">RESPA Cushion</p>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">{selectedState.name} · auto-applied</p>
              </div>
              <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{cushionMonths} months</span>
            </div>
          </section>

          {/* Annual Costs */}
          <section className="flex flex-col gap-4 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Annual Costs</h2>

            <DollarField label="Annual Property Taxes" value={annualTax} onChange={setAnnualTax} placeholder="6,000" />

            <DollarField label="Annual Homeowner's Insurance" value={annualIns} onChange={setAnnualIns} placeholder="1,800" />

            {/* Insurance Renewal Month */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Insurance Renewal Month
                {!renewalOverridden && <span className="ml-1 font-normal text-zinc-400">(auto from closing month)</span>}
              </label>
              <div className="flex gap-2">
                <select
                  value={insRenewalMonth}
                  onChange={e => { setInsRenewalMonth(e.target.value); setRenewalOverridden(true); }}
                  className={`${CLS.select} flex-1`}
                >
                  {MONTH_NAMES.map((m, i) => (
                    <option key={i} value={i + 1}>{m}</option>
                  ))}
                </select>
                {renewalOverridden && (
                  <button
                    onClick={() => { setInsRenewalMonth(closingMonth); setRenewalOverridden(false); }}
                    className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 whitespace-nowrap px-2 underline underline-offset-2"
                  >
                    reset
                  </button>
                )}
              </div>
            </div>

            <DollarField label="Monthly PMI" value={monthlyPMI} onChange={setMonthlyPMI} placeholder="0" info="(if applicable)" />
          </section>
        </div>

        {/* ── Prepaids (optional) ──────────────────────────────────────────────── */}
        <section className="flex flex-col gap-4 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
              Prepaids <span className="font-normal normal-case tracking-normal text-zinc-400 ml-1">(optional)</span>
            </h2>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">Collected at closing separately from the escrow deposit.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <DollarField
              label="First Year Insurance Premium"
              value={firstYearPremium}
              onChange={setFirstYearPremium}
              placeholder={n(annualIns) > 0 ? String(Math.round(n(annualIns))) : "1,800"}
              info="(prepaid at closing)"
            />
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Prepaid Interest Days</label>
              <input
                type="text"
                inputMode="numeric"
                value={prepaidDays}
                onChange={e => setPrepaidDays(e.target.value)}
                placeholder="e.g. 15"
                className={CLS.input}
              />
            </div>
            <DollarField label="Daily Interest Amount" value={dailyInterest} onChange={setDailyInterest} placeholder="0.00" />
          </div>
        </section>

        {/* ── Results ──────────────────────────────────────────────────────────── */}
        {hasAny && result && (
          <>
            {/* Summary strip */}
            <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                {
                  label: "Monthly Escrow",
                  value: currCents(result.totalMonthly),
                  sub: `Tax ${currCents(result.taxMonthly)} · Ins ${currCents(result.insMonthly)}${result.pmiMonthly ? ` · PMI ${currCents(result.pmiMonthly)}` : ""}`,
                  color: "text-zinc-900 dark:text-white",
                },
                {
                  label: "RESPA Cushion",
                  value: curr(result.cushionAmount),
                  sub: `${cushionMonths} month${cushionMonths !== 1 ? "s" : ""} · ${selectedState.name}`,
                  color: "text-zinc-900 dark:text-white",
                },
                {
                  label: "Initial Escrow Deposit",
                  value: curr(result.initialDeposit),
                  sub: "Required at closing",
                  color: "text-emerald-600 dark:text-emerald-400",
                },
                {
                  label: "Total at Closing",
                  value: curr(totalAtClosing),
                  sub: `Escrow ${curr(result.initialDeposit)} + Prepaids ${curr(totalPrepaids)}`,
                  color: "text-emerald-600 dark:text-emerald-400",
                },
              ].map(({ label, value, sub, color }) => (
                <div key={label} className="flex flex-col gap-1 p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                  <span className="text-xs font-medium text-zinc-400 uppercase tracking-wide">{label}</span>
                  <span className={`text-xl font-bold tabular-nums ${color}`}>{value}</span>
                  <span className="text-xs text-zinc-400 dark:text-zinc-500 leading-tight">{sub}</span>
                </div>
              ))}
            </section>

            {/* Breakdown cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-3">Escrow Deposit Breakdown</p>
                {[
                  { label: "Annual taxes ÷ 12 × 12",       amount: result.taxMonthly * 12,  per: `${currCents(result.taxMonthly)}/mo`,  show: result.taxMonthly > 0 },
                  { label: "Annual insurance ÷ 12 × 12",   amount: result.insMonthly * 12,  per: `${currCents(result.insMonthly)}/mo`,  show: result.insMonthly > 0 },
                  { label: "PMI escrow (12 mo)",            amount: result.pmiMonthly * 12,  per: `${currCents(result.pmiMonthly)}/mo`,  show: result.pmiMonthly > 0 },
                  { label: `RESPA cushion (${cushionMonths} mo)`, amount: result.cushionAmount, per: `${selectedState.name} standard`, show: true },
                ].filter(r => r.show && r.amount).map(({ label, amount, per }) => (
                  <div key={label} className="flex items-center justify-between py-2 border-b border-zinc-50 dark:border-zinc-800/50 last:border-0">
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">{label}</span>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 tabular-nums">{curr(amount)}</span>
                      <span className="block text-xs text-zinc-400">{per}</span>
                    </div>
                  </div>
                ))}
                <div className="flex items-center justify-between pt-3 border-t-2 border-zinc-200 dark:border-zinc-700 mt-1">
                  <span className="text-sm font-bold text-zinc-900 dark:text-white">Initial Deposit</span>
                  <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">{curr(result.initialDeposit)}</span>
                </div>
              </div>

              {totalPrepaids > 0 && (
                <div className="p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                  <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-3">Prepaids Breakdown</p>
                  {[
                    { label: "First year insurance",              amount: firstYearPrem,   show: firstYearPrem > 0 },
                    { label: `Prepaid interest (${prepaidDays} days)`, amount: prepaidInterest, show: prepaidInterest > 0 },
                  ].filter(r => r.show).map(({ label, amount }) => (
                    <div key={label} className="flex items-center justify-between py-2 border-b border-zinc-50 dark:border-zinc-800/50 last:border-0">
                      <span className="text-xs text-zinc-500 dark:text-zinc-400">{label}</span>
                      <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 tabular-nums">{curr(amount)}</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between pt-3 border-t-2 border-zinc-200 dark:border-zinc-700 mt-1">
                    <span className="text-sm font-bold text-zinc-900 dark:text-white">Total Prepaids</span>
                    <span className="text-lg font-bold text-zinc-700 dark:text-zinc-300 tabular-nums">{curr(totalPrepaids)}</span>
                  </div>
                </div>
              )}
            </div>

            {/* ── 12-Month Checklist ───────────────────────────────────────────── */}
            <section className="flex flex-col gap-4">
              <div className="flex items-end justify-between flex-wrap gap-2">
                <div>
                  <h2 className="text-sm font-bold text-zinc-900 dark:text-white">12-Month Escrow Timeline</h2>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
                    First collection: {result.schedule[0]?.label} · Tax schedule: {selectedState.note}
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs text-zinc-400 dark:text-zinc-500">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />Past</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />Current</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full border-2 border-amber-300 inline-block" />Bill Due</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full border-2 border-zinc-200 inline-block" />Upcoming</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                {result.schedule.map((detail, i) => (
                  <MonthRow
                    key={i}
                    detail={detail}
                    cushionAmount={result.cushionAmount}
                    isLowest={i === result.minIndex}
                  />
                ))}
              </div>

              <div className="p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 flex items-center gap-6 flex-wrap">
                <div>
                  <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">Lowest Balance</p>
                  <p className="text-xl font-bold text-zinc-900 dark:text-white tabular-nums mt-0.5">{curr(result.minBalance)}</p>
                </div>
                <div className="h-8 w-px bg-zinc-200 dark:bg-zinc-700 hidden sm:block" />
                <div>
                  <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">Cushion Held</p>
                  <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums mt-0.5">{curr(result.cushionAmount)}</p>
                </div>
                <p className="flex-1 text-xs text-zinc-400 dark:text-zinc-500 leading-relaxed sm:text-right">
                  Initial deposit of <strong className="text-zinc-700 dark:text-zinc-300">{curr(result.initialDeposit)}</strong> keeps the account above the {cushionMonths}-month RESPA cushion at all times (12 CFR §1024.17).
                </p>
              </div>
            </section>
          </>
        )}

        {!hasAny && (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <span className="text-4xl">🏠</span>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm">
              Select a state and enter property taxes or insurance above to calculate the escrow deposit and see the 12-month timeline.
            </p>
          </div>
        )}

      </main>
    </div>
  );
}
