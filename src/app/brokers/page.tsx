import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Broker Tools — Fast Mortgage Calculators for Professionals',
  description:
    'Mortgage Treehouse gives brokers fast, reliable calculation tools built on real guidelines. VA Residual Income, FHA Streamline, and more. No account required.',
};

const featuredTools = [
  {
    title: 'VA Residual Income Calculator',
    badge: 'Live',
    badgeBg: '#d1fae5',
    badgeColor: '#065f46',
    description:
      'VA residual income is one of the most important — and most overlooked — parts of VA loan underwriting. This calculator applies the actual VA residual income tables by family size and region so you can quickly confirm eligibility or identify a shortfall before the file goes to underwriting.',
    highlights: [
      'Covers all four regions: Northeast, Midwest, South, West',
      'Adjusts for family size (1–5+ members)',
      'Shows required vs. actual residual income clearly',
      'Explains results in plain English',
    ],
    href: '/calculators/va-residual-income',
    cta: 'Open VA Calculator',
    accent: '#2d6a4f',
  },
  {
    title: 'FHA Streamline Net Tangible Benefit Calculator',
    badge: 'Live',
    badgeBg: '#d1fae5',
    badgeColor: '#065f46',
    description:
      'FHA Streamline refinances require a net tangible benefit — but calculating whether the new loan actually qualifies can be tricky. This tool runs the NTB check for you, testing for the required 5% reduction in principal, interest, and MIP combined, so you know where you stand before quoting.',
    highlights: [
      'Tests the 5% combined P&I + MIP reduction requirement',
      'Handles both term changes and rate changes',
      'No appraisal data required for streamline scenarios',
      'Clean output you can walk a client through',
    ],
    href: '/calculators/fha-streamline',
    cta: 'Open FHA Calculator',
    accent: '#2d6a4f',
  },
];

const comingSoonTools = [
  {
    title: 'DTI Calculator',
    description:
      'Calculate front-end and back-end debt-to-income ratios side by side for FHA, VA, and conventional loans with per-program thresholds highlighted.',
  },
  {
    title: 'ARM vs. Fixed Comparison',
    description:
      'Compare the total cost of an adjustable-rate mortgage against a fixed-rate loan over multiple time horizons. Includes breakeven analysis.',
  },
  {
    title: 'Refinance Break-Even Calculator',
    description:
      'Find out exactly how many months it takes to recoup closing costs through the monthly savings of a refinance — essential for client conversations.',
  },
];

const benefits = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#2d6a4f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: 'Real VA guidelines built in',
    description:
      'The VA residual income tables are pulled directly from the VA Lenders Handbook. No estimates, no approximations — the same thresholds underwriters use.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="#2d6a4f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: 'Clean, shareable outputs',
    description:
      'Results are formatted to be readable — not just a number, but a clear breakdown you can walk a client through or screenshot for a notes file.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M13 10V3L4 14h7v7l9-11h-7z" stroke="#2d6a4f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: 'No account required',
    description:
      'Open a calculator, run a scenario, close the tab. There is no login, no email capture, and no friction. Just the tool.',
  },
];

const proTips = [
  {
    number: '01',
    title: 'Run residual income before quoting a VA rate',
    tip: 'A VA loan that looks clean on DTI alone can still fall apart in underwriting if residual income is short. Run the residual income calc first so you know what you\'re working with before the client gets attached to a rate.',
  },
  {
    number: '02',
    title: 'Use the FHA Streamline calc as a qualification screener',
    tip: 'If a client is asking about refinancing their FHA loan, plug in their current and proposed payment first. The NTB check will tell you in seconds whether the scenario is even viable — saving you time before you pull credit or order a title report.',
  },
  {
    number: '03',
    title: 'Screenshot results for your file notes',
    tip: 'The calculators are designed to produce clean, readable output. A quick screenshot into your LOS or CRM notes creates a paper trail showing you ran the scenario — useful for compliance and for client follow-up conversations.',
  },
];

export default function BrokersPage() {
  return (
    <div className="bg-[#f9f8f6] min-h-screen">
      {/* Hero */}
      <section className="bg-[#1e2533]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="max-w-3xl">
            <p className="text-[#4ade80] text-sm font-semibold uppercase tracking-widest mb-4">
              For Mortgage Brokers
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Tools built for the way you work.
            </h1>
            <p className="text-lg sm:text-xl text-[#9ca3af] leading-relaxed mb-10">
              Fast scenario checks that apply real guidelines — no guesswork, no account, no waiting.
              When a client is sitting across from you, you need answers in seconds. These calculators
              are built to give you exactly that.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/calculators/va-residual-income"
                className="inline-block bg-[#2d6a4f] text-white font-semibold px-7 py-3.5 rounded-lg hover:bg-[#1a4a35] transition-colors text-base"
              >
                VA Residual Income Calculator
              </Link>
              <Link
                href="/calculators/fha-streamline"
                className="inline-block bg-white/10 text-white font-semibold px-7 py-3.5 rounded-lg hover:bg-white/20 transition-colors text-base border border-white/20"
              >
                FHA Streamline Calculator
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Tools */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="mb-10">
          <span className="inline-block text-[#2d6a4f] text-xs font-bold uppercase tracking-widest mb-3">
            Available Now
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1e2533] mb-3">Featured Tools</h2>
          <p className="text-[#6b7280] text-base sm:text-lg">
            Both calculators are live and ready to use. No setup required.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {featuredTools.map((tool) => (
            <div
              key={tool.href}
              className="bg-white rounded-2xl border border-[#e5e7eb] p-7 flex flex-col gap-5 hover:border-[#2d6a4f] hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-xl font-bold text-[#1e2533] leading-snug">{tool.title}</h3>
                <span
                  className="flex-shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: tool.badgeBg, color: tool.badgeColor }}
                >
                  {tool.badge}
                </span>
              </div>
              <p className="text-[#4b5563] text-sm leading-relaxed">{tool.description}</p>
              <ul className="space-y-2">
                {tool.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-[#374151]">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="mt-0.5 flex-shrink-0"
                      aria-hidden="true"
                    >
                      <path
                        d="M3.5 8.5l3 3 6-6"
                        stroke="#2d6a4f"
                        strokeWidth="1.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {h}
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-2">
                <Link
                  href={tool.href}
                  className="inline-block bg-[#2d6a4f] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#1a4a35] transition-colors text-sm"
                >
                  {tool.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Coming Soon */}
      <section className="bg-white border-y border-[#e5e7eb]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="mb-10">
            <span className="inline-block text-[#f4a261] text-xs font-bold uppercase tracking-widest mb-3">
              In Development
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1e2533] mb-3">Coming Soon</h2>
            <p className="text-[#6b7280] text-base sm:text-lg">
              More tools are in progress. These are the next three on the roadmap.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {comingSoonTools.map((tool) => (
              <div
                key={tool.title}
                className="bg-[#f9f8f6] rounded-2xl border border-dashed border-[#d1d5db] p-6 flex flex-col gap-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-base font-bold text-[#6b7280]">{tool.title}</h3>
                  <span className="text-xs font-semibold text-[#9ca3af] bg-[#e5e7eb] px-2.5 py-1 rounded-full whitespace-nowrap">
                    Coming Soon
                  </span>
                </div>
                <p className="text-sm text-[#9ca3af] leading-relaxed">{tool.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why brokers use Mortgage Treehouse */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="mb-10">
          <span className="inline-block text-[#2d6a4f] text-xs font-bold uppercase tracking-widest mb-3">
            Why It Works
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1e2533] mb-3">
            Why brokers use Mortgage Treehouse
          </h2>
          <p className="text-[#6b7280] text-base sm:text-lg">
            These tools are built for the specific frustrations brokers actually have.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="bg-white rounded-2xl border border-[#e5e7eb] p-6 flex flex-col gap-4"
            >
              <div className="w-10 h-10 bg-[#d1fae5] rounded-xl flex items-center justify-center">
                {benefit.icon}
              </div>
              <h3 className="text-base font-bold text-[#1e2533]">{benefit.title}</h3>
              <p className="text-sm text-[#6b7280] leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pro Tips */}
      <section className="bg-[#1e2533]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="mb-10">
            <span className="inline-block text-[#4ade80] text-xs font-bold uppercase tracking-widest mb-3">
              Pro Tips
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Using these tools in client conversations
            </h2>
            <p className="text-[#9ca3af] text-base sm:text-lg">
              A few practical ways experienced brokers get the most out of these calculators.
            </p>
          </div>
          <div className="space-y-6">
            {proTips.map((tip) => (
              <div
                key={tip.number}
                className="bg-white/5 rounded-2xl border border-white/10 p-6 sm:p-7 flex gap-5"
              >
                <span className="text-[#4ade80] font-bold text-lg leading-none mt-0.5 flex-shrink-0 font-mono">
                  {tip.number}
                </span>
                <div className="flex flex-col gap-2">
                  <h3 className="text-white font-bold text-base">{tip.title}</h3>
                  <p className="text-[#9ca3af] text-sm leading-relaxed">{tip.tip}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#1e2533] mb-4">
          Ready to run a scenario?
        </h2>
        <p className="text-[#6b7280] text-lg mb-8 max-w-xl mx-auto">
          Both calculators are live now. No login, no credit card, no clutter.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/calculators/va-residual-income"
            className="inline-block bg-[#2d6a4f] text-white font-semibold px-7 py-3.5 rounded-lg hover:bg-[#1a4a35] transition-colors text-base"
          >
            VA Residual Income Calculator
          </Link>
          <Link
            href="/calculators/fha-streamline"
            className="inline-block bg-white text-[#1e2533] font-semibold px-7 py-3.5 rounded-lg hover:bg-[#f3f4f6] transition-colors text-base border border-[#e5e7eb]"
          >
            FHA Streamline Calculator
          </Link>
        </div>
      </section>
    </div>
  );
}
