"use client";

import { useState } from "react";
import Link from "next/link";
import { FadeIn } from "./FadeIn";
import { ComingSoonCard } from "./ComingSoonCard";
import { NotifyModal } from "./NotifyModal";

interface PreviewLine { label: string; value: string; highlight?: boolean }
interface Calc {
  title: string;
  description: string;
  icon: string;
  live: boolean;
  href?: string;
  preview?: PreviewLine[];
}

interface Bucket {
  id: string;
  label: string;
  sub: string;
  calcs: Calc[];
}

const BUCKETS: Bucket[] = [
  {
    id: "va",
    label: "VA",
    sub: "VA loan analysis and eligibility tools",
    calcs: [
      {
        title: "VA Residual Income",
        description: "Calculate VA residual income and compare against regional threshold tables.",
        href: "/calculators/va-residual",
        icon: "🎖️",
        live: true,
        preview: [
          { label: "4 people · Northeast · ≥$80k loan", value: "" },
          { label: "Residual Income", value: "$2,340", highlight: true },
          { label: "Required", value: "$1,003  ✓ Pass" },
        ],
      },
      {
        title: "VA Entitlement",
        description: "Determine remaining VA entitlement and max zero-down purchase power, with county loan limits auto-filled by state.",
        href: "/calculators/va-entitlement",
        icon: "🏅",
        live: true,
        preview: [
          { label: "$406k active VA · Standard county", value: "" },
          { label: "Remaining Entitlement", value: "$100,000", highlight: true },
          { label: "Max $0-Down Loan", value: "$400,000" },
        ],
      },
      {
        title: "VA Funding Fee",
        description: "Determine the VA funding fee based on loan type, prior usage, and down payment.",
        href: "/calculators/va-funding-fee",
        icon: "💳",
        live: true,
        preview: [
          { label: "Purchase · First Use · < 5% down", value: "" },
          { label: "Funding Fee Rate", value: "2.15%", highlight: true },
          { label: "Fee on $400k loan", value: "$8,600" },
        ],
      },
      {
        title: "VA Recoupment Test",
        description: "Verify an IRRRL meets the 36-month recoupment requirement and net tangible benefit test before closing.",
        href: "/calculators/va-recoupment",
        icon: "⏱️",
        live: true,
        preview: [
          { label: "$2,100 → $1,940 P&I · $3,500 costs", value: "" },
          { label: "Recoupment Period", value: "22.1 months", highlight: true },
          { label: "36-Month Test", value: "✓ Pass" },
        ],
      },
    ],
  },
  {
    id: "fha",
    label: "FHA",
    sub: "FHA loan analysis and refinance tools",
    calcs: [
      {
        title: "FHA Streamline Refinance",
        description: "Analyze max loan amount, UFMIP refund credit, seasoning eligibility, and net tangible benefit for an FHA-to-FHA streamline.",
        href: "/calculators/fha-streamline",
        icon: "🔁",
        live: true,
        preview: [
          { label: "$350k FHA · 7.25% → 6.25%", value: "" },
          { label: "UFMIP Refund", value: "$4,287", highlight: true },
          { label: "NTB", value: "✓ Pass −1.050%" },
        ],
      },
      {
        title: "UFMIP Refund",
        description: "Estimate the upfront MIP refund credit when refinancing an FHA loan.",
        href: "/calculators/ufmip-refund",
        icon: "💵",
        live: true,
        preview: [
          { label: "$350k FHA · closed 14 months ago", value: "" },
          { label: "Refund Credit", value: "$3,795", highlight: true },
          { label: "Refund Rate", value: "62%" },
        ],
      },
    ],
  },
  {
    id: "analysis",
    label: "Loan Analysis",
    sub: "Compare scenarios, costs, and loan structures",
    calcs: [
      {
        title: "Amortization Comparison",
        description: "Build two loan scenarios side by side — compare interest costs, payoff timelines, and month-by-month breakdowns.",
        href: "/calculators/amortization",
        icon: "🧮",
        live: true,
        preview: [
          { label: "30yr vs 15yr · $400k · 6.875%", value: "" },
          { label: "Interest saved", value: "$189,432", highlight: true },
          { label: "Paid off", value: "15yr sooner" },
        ],
      },
      {
        title: "Loan Product Comparison",
        description: "Compare Conventional, FHA, and VA side by side — pricing, closing costs, MI, and total cost over your stay.",
        href: "/calculators/loan-comparison",
        icon: "⚖️",
        live: true,
        preview: [
          { label: "$460k loan · 5% down · 740 FICO", value: "" },
          { label: "VA saves vs FHA", value: "$412/mo", highlight: true },
          { label: "Best total cost (7yr)", value: "VA" },
        ],
      },
      {
        title: "Escrow at Closing",
        description: "Calculate the initial escrow deposit by state, with a 12-month payment timeline showing every tax and insurance disbursement.",
        href: "/calculators/escrow-closing",
        icon: "🏦",
        live: true,
        preview: [
          { label: "CA · $6k taxes · $1.8k insurance", value: "" },
          { label: "Initial deposit", value: "$3,150", highlight: true },
          { label: "Monthly escrow", value: "$650/mo" },
        ],
      },
    ],
  },
  {
    id: "income",
    label: "Income & Qualification",
    sub: "Qualifying income analysis for underwriting",
    calcs: [
      {
        title: "Self Employment",
        description: "Analyze self-employment income from Schedule C, 1065, 1120-S, and 1120 — correct add-backs and deductions for each entity type, with 1- or 2-year analysis.",
        href: "/calculators/self-employment",
        icon: "💼",
        live: true,
        preview: [
          { label: "Schedule C · 2 yrs · Conventional", value: "" },
          { label: "Qualifying Monthly", value: "$7,200", highlight: true },
          { label: "2-year average", value: "$86,400/yr" },
        ],
      },
      {
        title: "Variable Income",
        description: "Average commission, bonus, and overtime for qualifying purposes.",
        icon: "📈",
        live: false,
      },
      {
        title: "Paystub / W2",
        description: "Calculate qualifying income from base pay rate and verify against YTD earnings and W2 history.",
        href: "/calculators/paystub-w2",
        icon: "🧾",
        live: true,
        preview: [
          { label: "Salary $72k · bi-weekly · 14 periods YTD", value: "" },
          { label: "Qualifying Monthly", value: "$6,000", highlight: true },
          { label: "YTD Annualized", value: "$6,000 ✓" },
        ],
      },
      {
        title: "Rental Income",
        description: "Calculate qualifying rental income from Schedule E or a lease agreement.",
        href: "/calculators/rental-income",
        icon: "🏘️",
        live: true,
        preview: [
          { label: "Schedule E · 2-year avg · $1,200 depreciation", value: "" },
          { label: "Monthly Qualifying Income", value: "$1,840", highlight: true },
          { label: "Annual Adjusted", value: "$22,080" },
        ],
      },
    ],
  },
];

function LiveCard({ calc }: { calc: Calc & { href: string; preview: PreviewLine[] } }) {
  return (
    <Link
      href={calc.href}
      className="group relative flex flex-col gap-3 p-6 rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20 hover:border-emerald-400 dark:hover:border-emerald-600 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 overflow-hidden"
    >
      <div className="flex items-start justify-between">
        <span className="text-3xl transition-transform duration-200 group-hover:scale-110 inline-block">
          {calc.icon}
        </span>
        <span className="text-xs font-semibold bg-emerald-600 text-white px-2.5 py-1 rounded-full">
          Live
        </span>
      </div>
      <h3 className="font-semibold text-zinc-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors duration-150">
        {calc.title}
      </h3>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
        {calc.description}
      </p>
      <span className="mt-auto text-xs font-medium text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform duration-150 inline-block">
        Open →
      </span>

      {/* Preview panel — slides up on hover */}
      <div className="absolute inset-x-0 bottom-0 bg-white/96 dark:bg-zinc-900/96 backdrop-blur-sm border-t border-emerald-100 dark:border-emerald-900 px-5 py-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
        <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide mb-2.5">
          Sample output
        </p>
        <div className="flex flex-col gap-1.5">
          {calc.preview.map((line, i) =>
            line.value ? (
              <div key={i} className="flex items-baseline justify-between gap-3">
                <span className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{line.label}</span>
                <span
                  className={`text-xs font-semibold flex-shrink-0 ${
                    line.highlight
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-zinc-700 dark:text-zinc-300"
                  }`}
                >
                  {line.value}
                </span>
              </div>
            ) : (
              <p key={i} className="text-xs text-zinc-400 dark:text-zinc-500 italic">{line.label}</p>
            )
          )}
        </div>
      </div>
    </Link>
  );
}

function BucketSection({
  bucket, baseDelay, onNotify,
}: {
  bucket: Bucket;
  baseDelay: number;
  onNotify: (name: string) => void;
}) {
  const liveCount = bucket.calcs.filter(c => c.live).length;
  return (
    <section className="flex flex-col gap-5">
      <div className="flex items-baseline gap-3">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">{bucket.label}</h2>
        {liveCount > 0 && (
          <span className="text-xs font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full">
            {liveCount} live
          </span>
        )}
        <span className="hidden sm:block text-sm text-zinc-400 dark:text-zinc-500">{bucket.sub}</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {bucket.calcs.map((calc, i) =>
          calc.live && calc.href && calc.preview ? (
            <FadeIn key={calc.title} delay={baseDelay + i * 60}>
              <LiveCard calc={calc as Calc & { href: string; preview: PreviewLine[] }} />
            </FadeIn>
          ) : (
            <FadeIn key={calc.title} delay={baseDelay + i * 60}>
              <ComingSoonCard
                title={calc.title}
                description={calc.description}
                icon={calc.icon}
                onNotify={onNotify}
              />
            </FadeIn>
          )
        )}
      </div>
    </section>
  );
}

export function CalculatorTabs() {
  const [notifyCalc, setNotifyCalc] = useState<string | null>(null);

  return (
    <>
      <div className="flex flex-col gap-14">
        {BUCKETS.map((bucket, bi) => (
          <BucketSection key={bucket.id} bucket={bucket} baseDelay={bi * 40} onNotify={setNotifyCalc} />
        ))}
      </div>

      {notifyCalc && (
        <NotifyModal calcName={notifyCalc} onClose={() => setNotifyCalc(null)} />
      )}
    </>
  );
}
