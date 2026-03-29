import type { Metadata } from "next";
import Link from "next/link";
import FHAStreamlineCalculator from "@/components/calculators/FHAStreamlineCalculator";

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "FHA Streamline Refinance Calculator",
  description:
    "Estimate your UFMIP refund credit, new loan amount, and monthly payment savings when refinancing with an FHA Streamline. Includes the full 36-month UFMIP refund schedule.",
};

// ─── UFMIP Refund Schedule (months 1-35, every 5 for brevity) ────────────────

const REFUND_EXAMPLES = [
  { months: "Month 1", refund: "80%" },
  { months: "Month 6", refund: "70%" },
  { months: "Month 12", refund: "58%" },
  { months: "Month 18", refund: "46%" },
  { months: "Month 24", refund: "34%" },
  { months: "Month 30", refund: "22%" },
  { months: "Month 35", refund: "12%" },
  { months: "Month 36+", refund: "0%" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FHAStreamlinePage() {
  return (
    <div className="bg-[#f9f8f6] min-h-full">
      {/* ── Hero / header area ── */}
      <div className="bg-white border-b border-[#e5e7eb]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex items-center gap-1.5 text-xs text-gray-500">
              <li>
                <Link href="/" className="hover:text-[#2d6a4f] transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true" className="text-gray-300">/</li>
              <li>
                <Link href="/calculators" className="hover:text-[#2d6a4f] transition-colors">
                  Calculators
                </Link>
              </li>
              <li aria-hidden="true" className="text-gray-300">/</li>
              <li className="font-medium text-gray-700" aria-current="page">
                FHA Streamline
              </li>
            </ol>
          </nav>

          {/* Page heading */}
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#2d6a4f]/10 text-2xl">
              🏡
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                FHA Streamline Refinance Calculator
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Estimate your UFMIP refund, new loan amount, and monthly savings
              </p>
            </div>
          </div>

          {/* What is an FHA Streamline info box */}
          <div className="mt-6 rounded-xl bg-[#edf7f1] border border-[#c3e6d0] px-5 py-4">
            <div className="flex gap-3">
              <span className="shrink-0 text-[#2d6a4f] text-lg mt-px" aria-hidden="true">ℹ</span>
              <div>
                <h2 className="text-sm font-semibold text-[#2d6a4f] mb-1">
                  What is an FHA Streamline Refinance?
                </h2>
                <p className="text-sm text-[#1a5c3a] leading-relaxed">
                  An FHA Streamline Refinance is a simplified mortgage refinance program exclusively
                  for homeowners with an existing FHA-insured loan. It requires minimal documentation
                  and no appraisal, making it faster and less expensive than a standard refinance.
                  When you refinance from one FHA loan into another within the first 36 months, the
                  FHA credits a portion of your original Upfront Mortgage Insurance Premium (UFMIP)
                  toward your new UFMIP — reducing your out-of-pocket costs. The refund percentage
                  starts at 80% in month one and decreases by roughly 2 percentage points each month.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Calculator ── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <FHAStreamlineCalculator />
      </div>

      {/* ── How the UFMIP Refund Works ── */}
      <div className="border-t border-[#e5e7eb] bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h2 className="text-lg font-bold text-gray-900 mb-1">
            How the UFMIP Refund Works
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            The FHA prorates the UFMIP refund based on how long you&apos;ve held your current loan.
            The table below shows representative refund percentages applied to your{" "}
            <em>original</em> UFMIP. After 35 months, no refund credit is available.
          </p>

          {/* Refund schedule cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {REFUND_EXAMPLES.map(({ months, refund }) => {
              const pct = parseInt(refund, 10);
              const isZero = pct === 0;
              return (
                <div
                  key={months}
                  className={`rounded-xl border px-4 py-3 text-center ${
                    isZero
                      ? "bg-gray-50 border-gray-200"
                      : pct >= 60
                      ? "bg-[#edf7f1] border-[#2d6a4f]/30"
                      : "bg-white border-[#e5e7eb]"
                  }`}
                >
                  <p className="text-xs text-gray-500 mb-1">{months}</p>
                  <p
                    className={`text-xl font-bold ${
                      isZero ? "text-gray-400" : "text-[#2d6a4f]"
                    }`}
                  >
                    {refund}
                  </p>
                  <p className="text-xs text-gray-400">refund</p>
                </div>
              );
            })}
          </div>

          {/* Full schedule note */}
          <div className="rounded-lg bg-[#fff7f0] border border-[#f4a261]/30 px-4 py-3 text-sm text-[#7a4010]">
            <strong>Full schedule:</strong> The refund percentage begins at 80% in month 1 and
            decreases by 2 percentage points each month (80%, 78%, 76%…) through month 35, then
            drops to 0% at month 36 and beyond. The refund is applied as a credit toward your new
            UFMIP — it is not paid out as cash.
          </div>
        </div>
      </div>

      {/* ── Related links ── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
          Related Resources
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            href="/learn/fha-basics"
            className="flex items-center gap-3 rounded-xl border border-[#e5e7eb] bg-white px-5 py-4 hover:border-[#2d6a4f]/50 hover:shadow-sm transition-all duration-150 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2d6a4f] focus-visible:ring-offset-2"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#2d6a4f]/10 text-lg group-hover:bg-[#2d6a4f]/15 transition-colors">
              📖
            </span>
            <div>
              <p className="text-sm font-semibold text-gray-900 group-hover:text-[#2d6a4f] transition-colors">
                FHA Loan Basics
              </p>
              <p className="text-xs text-gray-500">Learn how FHA loans and MIP work</p>
            </div>
            <span className="ml-auto text-gray-300 group-hover:text-[#2d6a4f] transition-colors" aria-hidden="true">
              →
            </span>
          </Link>

          <Link
            href="/calculators"
            className="flex items-center gap-3 rounded-xl border border-[#e5e7eb] bg-white px-5 py-4 hover:border-[#2d6a4f]/50 hover:shadow-sm transition-all duration-150 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2d6a4f] focus-visible:ring-offset-2"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#f4a261]/15 text-lg group-hover:bg-[#f4a261]/25 transition-colors">
              🧮
            </span>
            <div>
              <p className="text-sm font-semibold text-gray-900 group-hover:text-[#2d6a4f] transition-colors">
                All Calculators
              </p>
              <p className="text-xs text-gray-500">Browse our full suite of mortgage tools</p>
            </div>
            <span className="ml-auto text-gray-300 group-hover:text-[#2d6a4f] transition-colors" aria-hidden="true">
              →
            </span>
          </Link>
        </div>
      </div>

    </div>
  );
}
