"use client";

import { useState, useMemo } from "react";
import { Header } from "../../components/Header";
import { DownloadPDFButton } from "../../components/DownloadPDFButton";
import { LoanComparisonPDF } from "../../components/pdf/LoanComparisonPDF";

// ─── Types ────────────────────────────────────────────────────────────────────

type TxType  = "purchase" | "refinance";
type RefiSub = "rate-term" | "cash-out" | "irrrl";

interface ProductInputs {
  enabled:         boolean;
  termYears:       string;
  rate:            string;
  points:          string;
  originationFee:  string;
  otherLenderFees: string;
  pmiRate:         string;
  upfrontOverride: string;
  financeUpfront:  boolean;
}

type SyncableField = "termYears" | "points" | "originationFee" | "otherLenderFees";

interface FeeRow {
  id:           string;
  label:        string;
  amount:       string;
  waivable:     boolean;
  waived:       boolean;
  purchaseOnly: boolean;
}

interface ProductResult {
  loanAmtFinanced: number;
  monthlyPI:       number;
  monthlyMI:       number;
  totalMonthly:    number;
  upfrontMI:       number;
  pointsCost:      number;
  lenderFees:      number;
  cashToClose:     number;
  totalInterest:   number;
  totalMIStay:     number;
  totalCostStay:   number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const TERM_PRESETS = [10, 15, 20, 25, 30];

const CREDIT_RANGES = [
  "< 620", "620–639", "640–659", "660–679",
  "680–699", "700–719", "720–739", "740–759", "760–779", "780+",
];

const DEFAULT_PRODUCT: ProductInputs = {
  enabled:         true,
  termYears:       "30",
  rate:            "",
  points:          "0",
  originationFee:  "0",
  otherLenderFees: "0",
  pmiRate:         "",
  upfrontOverride: "",
  financeUpfront:  true,
};

const DEFAULT_FEES: FeeRow[] = [
  { id: "appraisal",    label: "Appraisal",          amount: "600",  waivable: true,  waived: false, purchaseOnly: false },
  { id: "title",        label: "Title Insurance",     amount: "1200", waivable: false, waived: false, purchaseOnly: false },
  { id: "settlement",   label: "Settlement / Escrow", amount: "850",  waivable: false, waived: false, purchaseOnly: false },
  { id: "creditReport", label: "Credit Report",       amount: "35",   waivable: false, waived: false, purchaseOnly: false },
  { id: "recording",    label: "Recording Fees",      amount: "150",  waivable: false, waived: false, purchaseOnly: false },
  { id: "survey",       label: "Survey",              amount: "400",  waivable: true,  waived: false, purchaseOnly: true  },
  { id: "pest",         label: "Pest Inspection",     amount: "125",  waivable: true,  waived: false, purchaseOnly: false },
  { id: "hoaTransfer",  label: "HOA Transfer",        amount: "300",  waivable: true,  waived: false, purchaseOnly: true  },
];

// ─── Pure Helpers ─────────────────────────────────────────────────────────────

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

function calcMP(principal: number, annualPct: number, termMo: number): number {
  if (!principal || !annualPct || !termMo) return 0;
  const r = annualPct / 100 / 12;
  return (principal * r) / (1 - Math.pow(1 + r, -termMo));
}

function calcFHAMIPRate(loanAmt: number, ltv: number, termYrs: number): number {
  const hb = loanAmt > 726200;
  if (termYrs <= 15) {
    if (ltv <= 78) return 0.0015;
    if (ltv <= 90) return 0.0040;
    return 0.0065;
  }
  return hb ? (ltv <= 90 ? 0.0070 : 0.0075) : (ltv <= 90 ? 0.0050 : 0.0055);
}

function calcVAFeeRate(downPct: number, firstUse: boolean, txType: TxType, refiSub: RefiSub): number {
  if (txType === "refinance" && refiSub === "irrrl") return 0.005;
  if (downPct >= 10) return 0.0125;
  if (downPct >= 5)  return 0.0150;
  return firstUse ? 0.0215 : 0.0330;
}

function calcProductResult(
  p:             ProductInputs,
  baseLoan:      number,
  upfrontAuto:   number,
  monthlyMIAuto: number,
  sharedFees:    number,
  sellerConc:    number,
  stayYrs:       number,
): ProductResult | null {
  if (!p.enabled || !n(p.rate) || !baseLoan) return null;
  const termMo      = n(p.termYears) * 12;
  const upfront     = p.upfrontOverride !== "" ? n(p.upfrontOverride) : upfrontAuto;
  const financed    = p.financeUpfront ? baseLoan + upfront : baseLoan;
  const pi          = calcMP(financed, n(p.rate), termMo);
  const pointsCost  = (n(p.points) / 100) * baseLoan;
  const lenderFees  = n(p.originationFee) + n(p.otherLenderFees);
  const upfrontCash = p.financeUpfront ? 0 : upfront;
  const cashToClose = upfrontCash + pointsCost + lenderFees + sharedFees - sellerConc;
  const totalInt    = Math.max(0, pi * termMo - financed);
  const stayMo      = Math.min(Math.max(1, stayYrs) * 12, termMo);
  const totalMI     = monthlyMIAuto * stayMo;
  const totalCost   = pi * stayMo + totalMI + cashToClose;
  return {
    loanAmtFinanced: financed,
    monthlyPI:       pi,
    monthlyMI:       monthlyMIAuto,
    totalMonthly:    pi + monthlyMIAuto,
    upfrontMI:       upfront,
    pointsCost,
    lenderFees,
    cashToClose,
    totalInterest:   totalInt,
    totalMIStay:     totalMI,
    totalCostStay:   totalCost,
  };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SyncChip({ isSynced, onToggle }: { isSynced: boolean; onToggle: () => void }) {
  return (
    <label className="flex items-center gap-1 cursor-pointer select-none group" title="When checked, this value syncs across all three products">
      <input
        type="checkbox"
        checked={isSynced}
        onChange={onToggle}
        className="w-3 h-3 rounded accent-emerald-600 cursor-pointer"
      />
      <span className={`text-xs transition-colors ${
        isSynced
          ? "text-emerald-600 dark:text-emerald-400 font-semibold"
          : "text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-500 dark:group-hover:text-zinc-400"
      }`}>
        {isSynced ? "🔗 synced" : "sync all"}
      </span>
    </label>
  );
}

function TermPills({ value, onChange, activeClass }: {
  value: string;
  onChange: (v: string) => void;
  activeClass: string;
}) {
  const isPreset  = TERM_PRESETS.includes(Number(value));
  const showInput = !isPreset && value !== "" || value === "";

  return (
    <div className="flex flex-wrap gap-1.5 items-center">
      {TERM_PRESETS.map(t => (
        <button key={t} type="button" onClick={() => onChange(String(t))}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
            value === String(t) ? activeClass
              : "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:border-zinc-300"
          }`}>
          {t}yr
        </button>
      ))}
      <button type="button" onClick={() => { if (isPreset) onChange(""); }}
        className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
          showInput ? activeClass
            : "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:border-zinc-300"
        }`}>
        Custom
      </button>
      {showInput && (
        <input autoFocus type="number" min="1" max="40" value={value}
          onChange={e => onChange(e.target.value)} placeholder="yrs"
          className="w-14 px-2 py-1 text-xs border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:border-emerald-400" />
      )}
    </div>
  );
}

function Field({ label, prefix, suffix, value, onChange, placeholder, disabled, info, inputMode = "decimal", syncChip }: {
  label: string; prefix?: string; suffix?: string; value: string;
  onChange: (v: string) => void; placeholder?: string; disabled?: boolean;
  info?: string; inputMode?: "decimal" | "numeric" | "text";
  syncChip?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center justify-between gap-2">
        <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
          {label}{info && <span className="ml-1 text-zinc-400 font-normal">{info}</span>}
        </label>
        {syncChip}
      </div>
      <div className="relative">
        {prefix && <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400 text-xs select-none">{prefix}</span>}
        <input type="text" inputMode={inputMode} value={value} onChange={e => onChange(e.target.value)}
          placeholder={placeholder ?? "0"} disabled={disabled}
          className={`w-full py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white outline-none focus:border-emerald-400 transition
            ${prefix ? "pl-6 pr-3" : suffix ? "pl-3 pr-6" : "px-3"} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`} />
        {suffix && <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 text-xs select-none">{suffix}</span>}
      </div>
    </div>
  );
}

function ProductPanel({
  title, borderClass, bgClass, badgeClass, activeTermClass,
  inputs, onFieldChange, autoUpfront, autoMonthlyMI, upfrontLabel,
  showPMI, showUpfront, isVA, isFHA,
  syncedFields, onToggleSync,
}: {
  title: string; borderClass: string; bgClass: string;
  badgeClass: string; activeTermClass: string;
  inputs: ProductInputs;
  onFieldChange: <K extends keyof ProductInputs>(field: K, value: ProductInputs[K]) => void;
  autoUpfront: number; autoMonthlyMI: number; upfrontLabel: string;
  showPMI: boolean; showUpfront: boolean; isVA: boolean; isFHA: boolean;
  syncedFields: Set<SyncableField>;
  onToggleSync: (field: SyncableField) => void;
}) {
  return (
    <div className={`flex flex-col gap-3 p-5 rounded-2xl border ${borderClass} ${bgClass} ${!inputs.enabled ? "opacity-50" : ""}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${badgeClass}`}>{title}</span>
        <label className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 cursor-pointer select-none">
          <input type="checkbox" checked={inputs.enabled} onChange={e => onFieldChange("enabled", e.target.checked)}
            className="rounded accent-emerald-600" />
          Include
        </label>
      </div>

      {inputs.enabled && (
        <>
          {/* Loan Term */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Loan Term</span>
              <SyncChip isSynced={syncedFields.has("termYears")} onToggle={() => onToggleSync("termYears")} />
            </div>
            <TermPills value={inputs.termYears} onChange={v => onFieldChange("termYears", v)} activeClass={activeTermClass} />
          </div>

          {/* Rate — not syncable (pricing differs per product) */}
          <Field label="Interest Rate" suffix="%" value={inputs.rate}
            onChange={v => onFieldChange("rate", v)} placeholder="6.875" />

          {/* Points / Credits */}
          <Field label="Points / Credits" suffix="%" value={inputs.points}
            onChange={v => onFieldChange("points", v)} placeholder="0"
            info="(−) = lender credits"
            syncChip={<SyncChip isSynced={syncedFields.has("points")} onToggle={() => onToggleSync("points")} />}
          />

          {/* Origination Fee */}
          <Field label="Origination Fee" prefix="$" value={inputs.originationFee}
            onChange={v => onFieldChange("originationFee", v)} inputMode="numeric"
            syncChip={<SyncChip isSynced={syncedFields.has("originationFee")} onToggle={() => onToggleSync("originationFee")} />}
          />

          {/* Other Lender Fees */}
          <Field label="Other Lender Fees" prefix="$" value={inputs.otherLenderFees}
            onChange={v => onFieldChange("otherLenderFees", v)} inputMode="numeric"
            syncChip={<SyncChip isSynced={syncedFields.has("otherLenderFees")} onToggle={() => onToggleSync("otherLenderFees")} />}
          />

          {/* PMI (Conv only) */}
          {showPMI && (
            <Field label="Monthly PMI Rate" suffix="%" value={inputs.pmiRate}
              onChange={v => onFieldChange("pmiRate", v)} placeholder="0.50" info="(annual % of loan)" />
          )}

          {/* Monthly MI (FHA, auto-calc display) */}
          {isFHA && autoMonthlyMI > 0 && (
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Monthly MIP <span className="font-normal text-zinc-400">(auto-calc)</span>
              </span>
              <div className="px-3 py-2 text-xs rounded-lg border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-emerald-700 dark:text-emerald-400 font-semibold tabular-nums">
                {currCents(autoMonthlyMI)}
              </div>
            </div>
          )}

          {/* VA no monthly MI badge */}
          {isVA && (
            <div className="px-3 py-2 text-xs rounded-lg border border-emerald-100 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 font-medium">
              No monthly MI — ever
            </div>
          )}

          {/* Upfront MI / Funding Fee */}
          {showUpfront && (
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                {upfrontLabel} <span className="font-normal text-zinc-400">(auto-calc)</span>
              </span>
              <div className="px-3 py-2 text-xs rounded-lg border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 font-semibold tabular-nums flex justify-between">
                <span>{curr(autoUpfront)}</span>
                <button type="button"
                  onClick={() => onFieldChange("upfrontOverride", inputs.upfrontOverride === "" ? String(Math.round(autoUpfront)) : "")}
                  className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 font-normal text-xs underline underline-offset-2">
                  {inputs.upfrontOverride !== "" ? "use auto" : "override"}
                </button>
              </div>
              {inputs.upfrontOverride !== "" && (
                <Field label="" prefix="$" value={inputs.upfrontOverride}
                  onChange={v => onFieldChange("upfrontOverride", v)} inputMode="numeric" />
              )}
              <label className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 cursor-pointer mt-0.5">
                <input type="checkbox" checked={inputs.financeUpfront}
                  onChange={e => onFieldChange("financeUpfront", e.target.checked)}
                  className="rounded accent-emerald-600" />
                Finance into loan amount
              </label>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LoanComparisonPage() {
  // Transaction
  const [txType,  setTxType]  = useState<TxType>("purchase");
  const [refiSub, setRefiSub] = useState<RefiSub>("rate-term");

  // Scenario
  const [purchasePrice, setPurchasePrice] = useState("");
  const [loanAmount,    setLoanAmount]    = useState("");

  // Borrower
  const [creditScore, setCreditScore] = useState("740–759");
  const [vaFirstUse,  setVaFirstUse]  = useState(true);
  const [vaFeeExempt, setVaFeeExempt] = useState(false);
  const [stayYears,   setStayYears]   = useState("7");

  // Products
  const [conv, setConv] = useState<ProductInputs>({ ...DEFAULT_PRODUCT });
  const [fha,  setFha]  = useState<ProductInputs>({ ...DEFAULT_PRODUCT });
  const [va,   setVa]   = useState<ProductInputs>({ ...DEFAULT_PRODUCT });

  // Field sync
  const [syncedFields, setSyncedFields] = useState<Set<SyncableField>>(new Set());

  // Fees
  const [fees,              setFees]              = useState<FeeRow[]>(DEFAULT_FEES);
  const [sellerConcessions, setSellerConcessions] = useState("0");

  // ─── Field-level change handler with sync support ────────────────────────────

  function handleFieldChange<K extends keyof ProductInputs>(
    product: "conv" | "fha" | "va",
    field: K,
    value: ProductInputs[K],
  ) {
    const update = (prev: ProductInputs): ProductInputs => ({ ...prev, [field]: value });
    if (syncedFields.has(field as SyncableField)) {
      setConv(update);
      setFha(update);
      setVa(update);
    } else {
      if (product === "conv") setConv(update);
      else if (product === "fha") setFha(update);
      else setVa(update);
    }
  }

  function handleToggleSync(field: SyncableField) {
    setSyncedFields(prev => {
      const next = new Set(prev);
      if (next.has(field)) {
        next.delete(field);
      } else {
        next.add(field);
        // Copy the value from whichever product has a non-default value first (conv → fha → va)
        const sourceVal = conv[field] !== DEFAULT_PRODUCT[field] ? conv[field]
          : fha[field] !== DEFAULT_PRODUCT[field] ? fha[field]
          : va[field];
        const update = (p: ProductInputs): ProductInputs => ({ ...p, [field]: sourceVal });
        setConv(update);
        setFha(update);
        setVa(update);
      }
      return next;
    });
  }

  // ─── Derived values ──────────────────────────────────────────────────────────

  const priceNum   = n(purchasePrice);
  const loanNum    = n(loanAmount);
  const downNum    = priceNum > 0 ? priceNum - loanNum : 0;
  const downPct    = priceNum > 0 ? (downNum / priceNum) * 100 : 0;
  const ltv        = priceNum > 0 ? (loanNum / priceNum) * 100 : 0;
  const stayYrs    = Math.max(1, n(stayYears));
  const sellerConc = n(sellerConcessions);

  const sharedFeeTotal = useMemo(() =>
    fees
      .filter(f => !f.waived && (txType === "purchase" || !f.purchaseOnly))
      .reduce((sum, f) => sum + n(f.amount), 0),
    [fees, txType]
  );

  const fhaAutoUFMIP     = loanNum * 0.0175;
  const fhaMIPAnnualRate = useMemo(() => calcFHAMIPRate(loanNum, ltv, n(fha.termYears)), [loanNum, ltv, fha.termYears]);
  const fhaAutoMonthlyMI = (fhaMIPAnnualRate / 12) * loanNum;

  const vaFeeRate    = useMemo(() =>
    vaFeeExempt ? 0 : calcVAFeeRate(downPct, vaFirstUse, txType, refiSub),
    [vaFeeExempt, downPct, vaFirstUse, txType, refiSub]
  );
  const vaAutoUpfront = loanNum * vaFeeRate;

  const convPMIMonthly = useMemo(() =>
    conv.enabled && n(conv.pmiRate) > 0 ? (n(conv.pmiRate) / 100 / 12) * loanNum : 0,
    [conv.enabled, conv.pmiRate, loanNum]
  );

  const results = useMemo(() => ({
    conv: calcProductResult(conv, loanNum, 0,             convPMIMonthly,   sharedFeeTotal, sellerConc, stayYrs),
    fha:  calcProductResult(fha,  loanNum, fhaAutoUFMIP,  fhaAutoMonthlyMI, sharedFeeTotal, sellerConc, stayYrs),
    va:   calcProductResult(va,   loanNum, vaAutoUpfront, 0,                sharedFeeTotal, sellerConc, stayYrs),
  }), [conv, fha, va, loanNum, convPMIMonthly, fhaAutoUFMIP, fhaAutoMonthlyMI, vaAutoUpfront, sharedFeeTotal, sellerConc, stayYrs]);

  // ─── Winner helper ───────────────────────────────────────────────────────────

  const prods = [
    { key: "conv" as const, label: "Conventional", result: results.conv },
    { key: "fha"  as const, label: "FHA",          result: results.fha  },
    { key: "va"   as const, label: "VA",            result: results.va   },
  ];

  function getWinner(field: keyof ProductResult): "conv" | "fha" | "va" | null {
    const active = prods.filter(p => p.result !== null);
    if (active.length < 2) return null;
    return active.reduce((best, p) =>
      (p.result![field] as number) < (best.result![field] as number) ? p : best
    ).key;
  }

  const hasResults = prods.some(p => p.result !== null);

  const tableRows: { label: string; field: keyof ProductResult; fmt: (v: number) => string }[] = [
    { label: "Monthly P&I",                      field: "monthlyPI",      fmt: currCents },
    { label: "Monthly MI / PMI",                 field: "monthlyMI",      fmt: currCents },
    { label: "Total Monthly Payment",            field: "totalMonthly",   fmt: currCents },
    { label: "Upfront MI / Funding Fee",         field: "upfrontMI",      fmt: curr },
    { label: "Points / Credits",                 field: "pointsCost",     fmt: curr },
    { label: "Lender Fees",                      field: "lenderFees",     fmt: curr },
    { label: "Cash to Close (excl. down pmt)",   field: "cashToClose",    fmt: curr },
    { label: "Total Loan Interest",              field: "totalInterest",  fmt: curr },
    { label: `Total MI (${stayYears}yr stay)`,   field: "totalMIStay",    fmt: curr },
    { label: `Total Cost (${stayYears}yr stay)`, field: "totalCostStay",  fmt: curr },
  ];

  const costWinner = hasResults ? getWinner("totalCostStay") : null;
  const cashWinner = getWinner("cashToClose");
  const pmtWinner  = getWinner("totalMonthly");

  const colorFor = {
    conv: { badge: "bg-blue-600 text-white",    border: "border-blue-200 dark:border-blue-800",    bg: "bg-blue-50/30 dark:bg-blue-950/10",    active: "bg-blue-600 border-blue-600 text-white",    text: "text-blue-700 dark:text-blue-400"    },
    fha:  { badge: "bg-amber-500 text-white",   border: "border-amber-200 dark:border-amber-800",  bg: "bg-amber-50/30 dark:bg-amber-950/10",  active: "bg-amber-500 border-amber-500 text-white",  text: "text-amber-700 dark:text-amber-400"  },
    va:   { badge: "bg-emerald-600 text-white", border: "border-emerald-200 dark:border-emerald-800", bg: "bg-emerald-50/30 dark:bg-emerald-950/10", active: "bg-emerald-600 border-emerald-600 text-white", text: "text-emerald-700 dark:text-emerald-400" },
  };
  const labelFor = { conv: "Conventional", fha: "FHA", va: "VA" } as const;

  const recommendations: { key: "conv" | "fha" | "va"; pros: string[]; cons: string[] }[] = [
    {
      key: "conv",
      pros: [
        "PMI drops off automatically at 78% LTV — no lifetime MI",
        "No upfront mortgage insurance premium",
        "Widest lender options and loan program flexibility",
        ...(downPct >= 20 ? ["20%+ down eliminates PMI entirely"] : []),
      ],
      cons: [
        ...(downPct < 20 ? [`PMI required until ~80% LTV (est. ${curr(convPMIMonthly)}/mo)`] : []),
        "Stricter credit / DTI requirements than FHA",
        ...(downPct < 5 ? ["Minimum 3–5% down payment required"] : []),
      ],
    },
    {
      key: "fha",
      pros: [
        "Accepts credit scores down to 580 with 3.5% down",
        "More flexible DTI allowances",
        ...(downPct < 5 ? ["Low 3.5% minimum down payment"] : []),
        "Assumable loan — valuable if rates rise",
      ],
      cons: [
        `Upfront MIP: 1.75% of loan (${curr(fhaAutoUFMIP)})`,
        ltv > 90
          ? "Annual MIP for the LIFE of the loan (LTV > 90%)"
          : "Annual MIP for 11 years (LTV ≤ 90%), then drops off",
        `Monthly MIP: ${currCents(fhaAutoMonthlyMI)}/mo`,
        "Loan limits may restrict higher purchase prices",
      ],
    },
    {
      key: "va",
      pros: [
        "No monthly MI — ever",
        "No down payment required",
        "Typically competitive rates vs. conventional",
        ...(vaFeeExempt ? ["Funding fee exempt — no upfront cost"] : []),
        "No prepayment penalty",
        "Assumable loan",
      ],
      cons: [
        ...(vaFeeExempt ? [] : [`Upfront funding fee: ${(vaFeeRate * 100).toFixed(2)}% (${curr(vaAutoUpfront)})`]),
        "VA-eligible borrowers only",
        "Primary residence occupancy requirement",
        "Property must meet VA minimum property requirements",
      ],
    },
  ];

  const logoSrc = typeof window !== "undefined" ? `${window.location.origin}/logo.png` : "";

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col min-h-full bg-white dark:bg-zinc-950 font-[family-name:var(--font-geist-sans)]">
      <Header backLink={{ href: "/#calculators", label: "All Calculators" }} />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-10 flex flex-col gap-10">

        {/* Title */}
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Loan Product Comparison</h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1.5">
            Compare Conventional, FHA, and VA side by side — pricing, closing costs, MI, and total cost over your stay.
          </p>
        </div>

        {/* ── Transaction Type ─────────────────────────────────────────────────── */}
        <section className="flex flex-col gap-3">
          <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Transaction Type</h2>
          <div className="flex flex-wrap gap-3">
            <div className="inline-flex rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 p-1 gap-1">
              {(["purchase", "refinance"] as TxType[]).map(t => (
                <button key={t} onClick={() => setTxType(t)}
                  className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all ${
                    txType === t ? "bg-emerald-600 text-white shadow-sm" : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                  }`}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
            {txType === "refinance" && (
              <div className="inline-flex rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 p-1 gap-1">
                {([
                  { id: "rate-term" as RefiSub, label: "Rate / Term" },
                  { id: "cash-out"  as RefiSub, label: "Cash-Out" },
                  { id: "irrrl"     as RefiSub, label: "IRRRL (VA)" },
                ]).map(({ id, label }) => (
                  <button key={id} onClick={() => setRefiSub(id)}
                    className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                      refiSub === id ? "bg-emerald-600 text-white shadow-sm" : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                    }`}>
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── Scenario + Borrower ──────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <section className="flex flex-col gap-4 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Scenario Details</h2>
            <Field label={txType === "purchase" ? "Purchase Price" : "Appraised Value"} prefix="$"
              value={purchasePrice} onChange={setPurchasePrice} placeholder="500,000" inputMode="numeric" />
            <Field label="Loan Amount" prefix="$"
              value={loanAmount} onChange={setLoanAmount} placeholder="460,000" inputMode="numeric" />
            {priceNum > 0 && loanNum > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Down Pmt.",   val: curr(downNum) },
                  { label: "Down %",      val: `${downPct.toFixed(1)}%` },
                  { label: "LTV",         val: `${ltv.toFixed(1)}%` },
                ].map(({ label, val }) => (
                  <div key={label} className="flex flex-col gap-0.5 p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
                    <span className="text-xs text-zinc-400 uppercase tracking-wide">{label}</span>
                    <span className="text-sm font-bold text-zinc-900 dark:text-white tabular-nums">{val}</span>
                  </div>
                ))}
              </div>
            )}
            <Field label="Intended Stay" suffix="yrs" value={stayYears} onChange={setStayYears}
              placeholder="7" info="for total cost calculation" />
          </section>

          <section className="flex flex-col gap-4 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Borrower Profile</h2>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Credit Score Range</label>
              <select value={creditScore} onChange={e => setCreditScore(e.target.value)}
                className="w-full py-2.5 px-3 text-base rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white outline-none focus:border-emerald-400 transition">
                {CREDIT_RANGES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-2 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900">
              <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">VA Borrower Details</span>
              <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300 cursor-pointer">
                <input type="radio" name="vaUse" checked={vaFirstUse} onChange={() => setVaFirstUse(true)} className="accent-emerald-600" />
                First-time VA use
              </label>
              <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300 cursor-pointer">
                <input type="radio" name="vaUse" checked={!vaFirstUse} onChange={() => setVaFirstUse(false)} className="accent-emerald-600" />
                Subsequent use
              </label>
              <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300 cursor-pointer mt-1">
                <input type="checkbox" checked={vaFeeExempt} onChange={e => setVaFeeExempt(e.target.checked)} className="rounded accent-emerald-600" />
                Funding fee exempt (disability / Purple Heart)
              </label>
            </div>
          </section>
        </div>

        {/* ── Product Panels ───────────────────────────────────────────────────── */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Loan Pricing — Per Product</h2>
            {syncedFields.size > 0 && (
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
                <span>🔗</span>
                <span className="font-medium">
                  {Array.from(syncedFields).map(f =>
                    f === "termYears" ? "Term" : f === "points" ? "Points" : f === "originationFee" ? "Orig. Fee" : "Other Fees"
                  ).join(", ")} synced across all products
                </span>
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ProductPanel
              title="Conventional" borderClass={colorFor.conv.border} bgClass={colorFor.conv.bg}
              badgeClass={colorFor.conv.badge} activeTermClass={colorFor.conv.active}
              inputs={conv} onFieldChange={(f, v) => handleFieldChange("conv", f, v)}
              autoUpfront={0} autoMonthlyMI={convPMIMonthly} upfrontLabel="Upfront MI"
              showPMI showUpfront={false} isVA={false} isFHA={false}
              syncedFields={syncedFields} onToggleSync={handleToggleSync}
            />
            <ProductPanel
              title="FHA" borderClass={colorFor.fha.border} bgClass={colorFor.fha.bg}
              badgeClass={colorFor.fha.badge} activeTermClass={colorFor.fha.active}
              inputs={fha} onFieldChange={(f, v) => handleFieldChange("fha", f, v)}
              autoUpfront={fhaAutoUFMIP} autoMonthlyMI={fhaAutoMonthlyMI} upfrontLabel="Upfront MIP (UFMIP)"
              showPMI={false} showUpfront isVA={false} isFHA
              syncedFields={syncedFields} onToggleSync={handleToggleSync}
            />
            <ProductPanel
              title="VA" borderClass={colorFor.va.border} bgClass={colorFor.va.bg}
              badgeClass={colorFor.va.badge} activeTermClass={colorFor.va.active}
              inputs={va} onFieldChange={(f, v) => handleFieldChange("va", f, v)}
              autoUpfront={vaAutoUpfront} autoMonthlyMI={0} upfrontLabel="VA Funding Fee"
              showPMI={false} showUpfront={!vaFeeExempt} isVA isFHA={false}
              syncedFields={syncedFields} onToggleSync={handleToggleSync}
            />
          </div>
        </section>

        {/* ── Shared Fees ──────────────────────────────────────────────────────── */}
        <section className="flex flex-col gap-4 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-start justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Third-Party / Shared Fees</h2>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">These apply to all products equally. Waive fees the seller or lender will cover.</p>
            </div>
            <span className="text-sm font-bold text-zinc-900 dark:text-white tabular-nums">{curr(sharedFeeTotal)} total</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {fees
              .filter(f => txType === "purchase" || !f.purchaseOnly)
              .map(fee => (
                <div key={fee.id} className="flex items-center gap-3 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                  <div className="flex-1 min-w-0">
                    <span className={`text-xs font-medium ${fee.waived ? "line-through text-zinc-300 dark:text-zinc-600" : "text-zinc-700 dark:text-zinc-300"}`}>
                      {fee.label}
                    </span>
                    {fee.purchaseOnly && <span className="ml-1.5 text-xs text-zinc-400 dark:text-zinc-500">(purchase only)</span>}
                  </div>
                  <input type="text" inputMode="numeric" value={fee.amount}
                    onChange={e => setFees(prev => prev.map(f => f.id === fee.id ? { ...f, amount: e.target.value } : f))}
                    disabled={fee.waived}
                    className={`w-20 px-2 py-1 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-right tabular-nums text-zinc-900 dark:text-white outline-none focus:border-emerald-400 ${fee.waived ? "opacity-40" : ""}`}
                  />
                  {fee.waivable && (
                    <label className="flex items-center gap-1 text-xs text-zinc-400 dark:text-zinc-500 cursor-pointer flex-shrink-0">
                      <input type="checkbox" checked={fee.waived}
                        onChange={e => setFees(prev => prev.map(f => f.id === fee.id ? { ...f, waived: e.target.checked } : f))}
                        className="rounded accent-emerald-600" />
                      Waived
                    </label>
                  )}
                </div>
              ))}
          </div>

          <Field label="Seller Concessions" prefix="$" value={sellerConcessions} onChange={setSellerConcessions}
            placeholder="0" info="(reduces cash to close)" inputMode="numeric" />
        </section>

        {/* ── Results Table ────────────────────────────────────────────────────── */}
        {hasResults && (
          <section className="flex flex-col gap-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Side-by-Side Comparison</h2>

            <div className="rounded-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800">
                      <th className="text-left px-5 py-4 font-semibold text-xs uppercase tracking-wide text-zinc-500 w-56">Category</th>
                      {prods.map(p => p.result && (
                        <th key={p.key} className={`px-5 py-4 text-center font-bold text-xs uppercase tracking-wide ${colorFor[p.key].text}`}>
                          {labelFor[p.key]}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
                    {tableRows.map((row, ri) => {
                      const winner = getWinner(row.field);
                      return (
                        <tr key={row.field} className={ri % 2 === 1 ? "bg-zinc-50/50 dark:bg-zinc-800/20" : ""}>
                          <td className="px-5 py-3 text-xs font-medium text-zinc-500 dark:text-zinc-400">{row.label}</td>
                          {prods.map(p => {
                            if (!p.result) return null;
                            const val = p.result[row.field] as number;
                            const isWinner = winner === p.key;
                            const isCredit = row.field === "pointsCost" && val < 0;
                            return (
                              <td key={p.key}
                                className={`px-5 py-3 text-center tabular-nums font-semibold text-sm transition-colors ${
                                  isWinner
                                    ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400"
                                    : "text-zinc-800 dark:text-zinc-200"
                                }`}>
                                {isWinner && <span className="mr-1 text-emerald-500">✓</span>}
                                {isCredit
                                  ? <span className="text-emerald-600 dark:text-emerald-400">{curr(Math.abs(val))} credit</span>
                                  : row.fmt(val)}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                { label: "Lowest Monthly",         winner: pmtWinner  },
                { label: "Lowest Cash to Close",   winner: cashWinner },
                { label: `Lowest ${stayYears}yr Cost`, winner: costWinner },
              ].map(({ label, winner: w }) => w && (
                <div key={label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 text-xs">
                  <span className="text-zinc-500 dark:text-zinc-400">{label}:</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">{labelFor[w]}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Recommendation ───────────────────────────────────────────────────── */}
        {hasResults && (
          <section className="flex flex-col gap-5">
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Product Analysis</h2>

            {costWinner && (
              <div className="p-5 rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-950/20">
                <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
                  Recommendation: <span className="font-bold">{labelFor[costWinner]}</span> has the lowest total cost over a {stayYears}-year stay.
                </p>
                <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-1">
                  {costWinner === "va" ? "No monthly MI and competitive rates make VA a strong choice for eligible borrowers." :
                   costWinner === "conv" ? "With PMI eventually dropping off and no upfront MI, Conventional comes out ahead over your intended stay." :
                   "Lower credit requirements and assumability make FHA the best fit here, despite the MIP cost."}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recommendations
                .filter(r => prods.find(p => p.key === r.key)?.result !== null)
                .map(rec => (
                  <div key={rec.key} className={`flex flex-col gap-3 p-5 rounded-2xl border ${colorFor[rec.key].border} ${colorFor[rec.key].bg}`}>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full self-start ${colorFor[rec.key].badge}`}>{labelFor[rec.key]}</span>
                    <div className="flex flex-col gap-1.5">
                      <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">Advantages</span>
                      {rec.pros.map((pro, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-zinc-700 dark:text-zinc-300">
                          <span className="text-emerald-500 flex-shrink-0 mt-0.5">✓</span>{pro}
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-col gap-1.5 border-t border-zinc-200 dark:border-zinc-700 pt-3">
                      <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">Considerations</span>
                      {rec.cons.map((con, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-zinc-700 dark:text-zinc-300">
                          <span className="text-zinc-400 flex-shrink-0 mt-0.5">•</span>{con}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </section>
        )}

        {/* ── Download ─────────────────────────────────────────────────────────── */}
        {hasResults && (
          <div className="flex flex-col items-center gap-2 pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <p className="text-xs text-zinc-400 dark:text-zinc-500">
              Save a clean PDF to share with your client or underwriter.
            </p>
            <DownloadPDFButton
              filename="loan-comparison.pdf"
              document={
                <LoanComparisonPDF
                  txType={txType} refiSub={refiSub}
                  purchasePrice={purchasePrice} loanAmount={loanAmount}
                  ltv={ltv} downPct={downPct}
                  creditScore={creditScore} stayYears={stayYears}
                  vaFirstUse={vaFirstUse} vaFeeExempt={vaFeeExempt}
                  convResult={results.conv} fhaResult={results.fha} vaResult={results.va}
                  convRate={conv.rate} fhaMIPRate={fhaMIPAnnualRate} vaFeeRate={vaFeeRate}
                  sharedFeeTotal={sharedFeeTotal} sellerConc={sellerConc}
                  costWinner={costWinner} cashWinner={cashWinner} pmtWinner={pmtWinner}
                  logoSrc={logoSrc}
                />
              }
            />
          </div>
        )}

      </main>
    </div>
  );
}
