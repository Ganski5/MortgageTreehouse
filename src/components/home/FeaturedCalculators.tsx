import Link from "next/link";

interface CalculatorCardProps {
  title: string;
  description: string;
  badge: string;
  href: string;
  icon: React.ReactNode;
}

function CalculatorCard({ title, description, badge, href, icon }: CalculatorCardProps) {
  return (
    <div className="flex flex-col rounded-xl border border-[#e5e7eb] bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-[#edf7f1] text-[#2d6a4f]">
        {icon}
      </div>

      <div className="mb-2 flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold text-[#1e2533]">{title}</h3>
        <span className="inline-flex flex-shrink-0 items-center rounded-full bg-[#f4a261]/15 px-2.5 py-0.5 text-xs font-medium text-[#c2610c]">
          {badge}
        </span>
      </div>

      <p className="flex-1 text-sm leading-6 text-[#6b7280]">{description}</p>

      <div className="mt-5">
        <Link
          href={href}
          className="inline-flex items-center text-sm font-semibold text-[#2d6a4f] transition-colors hover:text-[#245a41]"
        >
          Use Calculator
          <svg className="ml-1.5 h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

function VAIcon() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );
}

function FHAIcon() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
      <path d="M7 9h2m0 0v4m0-4V7m4 2h2m-2 0v4m0-4V7" />
    </svg>
  );
}

export default function FeaturedCalculators() {
  return (
    <section className="bg-[#f9f8f6] py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-6">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-[#1e2533] sm:text-4xl">
              Popular Calculators
            </h2>
            <p className="mt-2 text-lg text-[#6b7280]">
              Purpose-built tools for real mortgage scenarios.
            </p>
          </div>
          <Link
            href="/calculators"
            className="inline-flex flex-shrink-0 items-center text-sm font-semibold text-[#2d6a4f] transition-colors hover:text-[#245a41]"
          >
            View all calculators
            <svg className="ml-1.5 h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>

        {/* Calculator cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <CalculatorCard
            title="VA Residual Income Calculator"
            description="Quickly determine if a veteran borrower meets VA residual income requirements based on family size, loan amount, and region."
            badge="Broker Tool"
            href="/calculators/va-residual-income"
            icon={<VAIcon />}
          />
          <CalculatorCard
            title="FHA Streamline Calculator"
            description="Calculate the net tangible benefit on an FHA streamline refinance, including updated MIP, new payment estimates, and breakeven timelines."
            badge="Broker Tool"
            href="/calculators/fha-streamline"
            icon={<FHAIcon />}
          />
        </div>
      </div>
    </section>
  );
}
