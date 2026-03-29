import Link from "next/link";

function CheckIcon() {
  return (
    <svg
      className="mt-0.5 h-4 w-4 flex-shrink-0"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function HouseIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
      <path d="M9 21V12h6v9" />
    </svg>
  );
}

function BriefcaseIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
      <line x1="12" y1="12" x2="12" y2="12" />
      <path d="M2 12h20" />
    </svg>
  );
}

export default function AudiencePaths() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-[#1e2533] sm:text-4xl">
            Choose your path
          </h2>
          <p className="mt-3 text-lg text-[#6b7280]">
            Mortgage Treehouse is built for two audiences — pick yours.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Homebuyers card */}
          <div className="flex flex-col rounded-2xl bg-[#2d6a4f] p-8 text-white shadow-lg">
            <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-white/15">
              <HouseIcon className="h-8 w-8 text-white" />
            </div>

            <h3 className="text-2xl font-bold">For Homebuyers</h3>

            <p className="mt-3 text-base leading-7 text-green-100">
              Learn mortgage basics, understand loan types, and get confident
              before you speak with a lender.
            </p>

            <ul className="mt-6 flex flex-col gap-2.5">
              {[
                "Plain-English guides",
                "No jargon",
                "Loan type comparisons",
                "Mortgage glossary",
              ].map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 text-sm text-green-50">
                  <CheckIcon />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <Link
                href="/homebuyers"
                className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-sm font-semibold text-[#2d6a4f] shadow transition-colors hover:bg-green-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Start Learning
                <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Mortgage Brokers card */}
          <div className="flex flex-col rounded-2xl bg-[#fff7ed] p-8 shadow-lg ring-1 ring-[#f4a261]/30">
            <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-[#f4a261]/20">
              <BriefcaseIcon className="h-8 w-8 text-[#c2610c]" />
            </div>

            <h3 className="text-2xl font-bold text-[#1e2533]">For Mortgage Brokers</h3>

            <p className="mt-3 text-base leading-7 text-[#6b7280]">
              Access fast, reliable tools built for real-world mortgage scenarios.
            </p>

            <ul className="mt-6 flex flex-col gap-2.5">
              {[
                "VA Residual Income Calculator",
                "FHA Streamline Calculator",
                "More tools coming soon",
              ].map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 text-sm text-[#4b5563]">
                  <span className="mt-0.5 flex-shrink-0">
                    <svg className="h-4 w-4 text-[#f4a261]" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <Link
                href="/brokers"
                className="inline-flex items-center justify-center rounded-lg bg-[#f4a261] px-6 py-3 text-sm font-semibold text-white shadow transition-colors hover:bg-[#e8904a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f4a261]"
              >
                View Broker Tools
                <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
