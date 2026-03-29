import type { Metadata } from "next";
import Link from "next/link";
import { VAResidualIncomeCalculator } from "@/components/calculators/VAResidualIncomeCalculator";

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "VA Residual Income Calculator",
  description:
    "Quickly determine whether a VA loan borrower meets the VA's residual income requirement. Enter income, housing payment, and monthly obligations to get an instant PASS/FAIL result with a full breakdown.",
};

// ─── Static content ───────────────────────────────────────────────────────────

const HOW_IT_WORKS_STEPS = [
  {
    step: "01",
    title: "Two threshold tables",
    body: "VA publishes separate income tables for loans under $80,000 and loans of $80,000 or more. The calculator automatically selects the correct table based on the estimated loan amount you enter.",
  },
  {
    step: "02",
    title: "Four geographic regions",
    body: "VA divides the United States into Northeast, Midwest, South, and West regions. Each region has its own minimum residual income requirements because cost of living varies significantly across the country.",
  },
  {
    step: "03",
    title: "Family size scaling",
    body: "Thresholds are defined for families of 1 through 4. For families of 5 or more, the 4-person threshold is used as a base and a per-additional-person amount is added for each member beyond four.",
  },
  {
    step: "04",
    title: "Residual income formula",
    body: "Residual Income = Gross Monthly Income − (PITI + Monthly Debts + Child Support/Alimony + Utilities + Other Obligations). The result must meet or exceed the applicable threshold to pass.",
  },
];

const RELATED_RESOURCES = [
  {
    href: "/learn/va-basics",
    label: "VA Loan Basics",
    description:
      "Understand eligibility, entitlement, and the VA funding fee before running calculations.",
    icon: (
      <svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    href: "/calculators",
    label: "All Calculators",
    description:
      "Browse the full suite of mortgage calculators including FHA Streamline, DTI, and more.",
    icon: (
      <svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
        <line x1="8" y1="6" x2="16" y2="6" />
        <line x1="8" y1="10" x2="16" y2="10" />
        <line x1="8" y1="14" x2="12" y2="14" />
      </svg>
    ),
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function VAResidualIncomeCalculatorPage() {
  return (
    <div className="bg-[#f9f8f6] min-h-screen">
      {/* ── Hero / Header ── */}
      <section className="bg-white border-b border-[#e5e7eb]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          {/* Breadcrumb */}
          <nav
            className="flex items-center gap-2 text-sm text-[#9ca3af] mb-6"
            aria-label="Breadcrumb"
          >
            <Link
              href="/"
              className="hover:text-[#2d6a4f] transition-colors duration-150"
            >
              Home
            </Link>
            <svg
              className="w-3.5 h-3.5 shrink-0 text-[#d1d5db]"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                clipRule="evenodd"
              />
            </svg>
            <Link
              href="/calculators"
              className="hover:text-[#2d6a4f] transition-colors duration-150"
            >
              Calculators
            </Link>
            <svg
              className="w-3.5 h-3.5 shrink-0 text-[#d1d5db]"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-[#1e2533] font-medium">VA Residual Income</span>
          </nav>

          {/* Title row */}
          <div className="flex items-start gap-4">
            {/* VA Shield icon */}
            <div className="shrink-0 mt-1 flex h-12 w-12 items-center justify-center rounded-xl bg-[#2d6a4f]/10 text-[#2d6a4f]">
              <svg
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center rounded-md bg-[#edf7f1] px-2.5 py-1 text-xs font-semibold text-[#2d6a4f] ring-1 ring-inset ring-[#c3e6d0]">
                  Broker Tool
                </span>
                <span className="inline-flex items-center rounded-md bg-[#fef3c7] px-2.5 py-1 text-xs font-semibold text-[#92400e] ring-1 ring-inset ring-[#fde68a]">
                  VA Loans
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-[#2d6a4f] leading-tight mb-3">
                VA Residual Income Calculator
              </h1>
              <p className="text-base sm:text-lg text-[#4b5563] max-w-2xl leading-relaxed">
                Instantly determine whether a VA loan borrower meets the VA&apos;s
                residual income requirement. Enter the borrower&apos;s income,
                housing payment, and monthly obligations to see a detailed
                PASS or FAIL result with a full deduction breakdown.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main content ── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* What is Residual Income info box */}
        <aside
          aria-label="What is VA Residual Income"
          className="rounded-2xl border border-[#c3e6d0] bg-[#edf7f1] px-6 py-5 flex gap-4"
        >
          <div className="shrink-0 mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-[#2d6a4f]/15 text-[#2d6a4f]">
            <svg
              className="w-4 h-4"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-base font-bold text-[#1e2533] mb-1.5">
              What is Residual Income?
            </h2>
            <p className="text-sm text-[#374151] leading-relaxed">
              VA residual income is the amount of money a borrower has left each
              month after paying all major obligations — including housing, debts,
              and living expenses. Unlike the debt-to-income ratio used by
              conventional lenders, residual income measures cash-flow sufficiency
              to ensure the borrower can comfortably cover day-to-day living costs.
              VA requires borrowers to meet region- and family-size-specific
              minimums, making it one of the most borrower-protective underwriting
              standards in the mortgage industry.
            </p>
          </div>
        </aside>

        {/* Calculator component */}
        <VAResidualIncomeCalculator />

        {/* How It Works */}
        <section aria-labelledby="how-it-works-heading">
          <div className="flex items-center gap-3 mb-6">
            <h2
              id="how-it-works-heading"
              className="text-xl font-bold text-[#1e2533] whitespace-nowrap"
            >
              How It Works
            </h2>
            <div className="flex-1 h-px bg-[#e5e7eb]" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {HOW_IT_WORKS_STEPS.map(({ step, title, body }) => (
              <div
                key={step}
                className="rounded-xl border border-[#e5e7eb] bg-white p-5 flex gap-4 shadow-sm"
              >
                {/* Step number */}
                <div className="shrink-0 mt-0.5 flex h-9 w-9 items-center justify-center rounded-lg bg-[#2d6a4f] text-white text-xs font-extrabold tracking-wide">
                  {step}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#1e2533] mb-1">
                    {title}
                  </h3>
                  <p className="text-sm text-[#4b5563] leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>

          {/* VA threshold note */}
          <div className="mt-5 rounded-xl border border-[#fde68a] bg-[#fef9ee] px-5 py-4 flex gap-3">
            <svg
              className="w-5 h-5 shrink-0 mt-0.5 text-[#f4a261]"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-sm text-[#78350f] leading-relaxed">
              <strong>Note for brokers:</strong> VA residual income thresholds are
              published in the VA Lenders Handbook, Pamphlet 26-7, Chapter 4.
              Thresholds shown in this tool are based on official VA tables and are
              kept up to date, but always cross-reference with the most current VA
              guidelines before submitting a loan for approval.
            </p>
          </div>
        </section>

        {/* Related Resources */}
        <section aria-labelledby="related-resources-heading">
          <div className="flex items-center gap-3 mb-6">
            <h2
              id="related-resources-heading"
              className="text-xl font-bold text-[#1e2533] whitespace-nowrap"
            >
              Related Resources
            </h2>
            <div className="flex-1 h-px bg-[#e5e7eb]" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {RELATED_RESOURCES.map(({ href, label, description, icon }) => (
              <Link
                key={href}
                href={href}
                className="group flex gap-4 rounded-xl border border-[#e5e7eb] bg-white p-5 shadow-sm hover:border-[#2d6a4f] hover:shadow-md transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2d6a4f] focus-visible:ring-offset-2"
              >
                <div className="shrink-0 mt-0.5 flex h-9 w-9 items-center justify-center rounded-lg bg-[#2d6a4f]/10 text-[#2d6a4f] group-hover:bg-[#2d6a4f] group-hover:text-white transition-colors duration-200">
                  {icon}
                </div>
                <div>
                  <p className="text-sm font-bold text-[#1e2533] group-hover:text-[#2d6a4f] transition-colors duration-200 mb-1">
                    {label}
                  </p>
                  <p className="text-sm text-[#6b7280] leading-relaxed">
                    {description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
