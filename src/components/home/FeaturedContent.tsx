import Link from "next/link";

interface ArticleCardProps {
  title: string;
  description: string;
  readTime: string;
  href: string;
  icon: React.ReactNode;
}

function ArticleCard({ title, description, readTime, href, icon }: ArticleCardProps) {
  return (
    <div className="flex flex-col rounded-xl border border-[#e5e7eb] bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-[#edf7f1] text-[#2d6a4f]">
        {icon}
      </div>

      <div className="mb-2 flex items-center gap-2">
        <span className="inline-flex items-center rounded-full bg-[#edf7f1] px-2.5 py-0.5 text-xs font-medium text-[#2d6a4f]">
          {readTime}
        </span>
      </div>

      <h3 className="mb-2 text-base font-semibold text-[#1e2533]">{title}</h3>

      <p className="flex-1 text-sm leading-6 text-[#6b7280]">{description}</p>

      <div className="mt-5">
        <Link
          href={href}
          className="inline-flex items-center text-sm font-semibold text-[#2d6a4f] transition-colors hover:text-[#245a41]"
        >
          Read More
          <svg className="ml-1.5 h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

function FHAIcon() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function VAIcon() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 21h18M3 7v1a3 3 0 006 0V7m0 1a3 3 0 006 0V7m0 1a3 3 0 006 0V7M3 7l2.5-4h13L21 7M12 21V12" />
    </svg>
  );
}

function ConventionalIcon() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
      <path d="M9 21V12h6v9" />
    </svg>
  );
}

export default function FeaturedContent() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-6">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-[#1e2533] sm:text-4xl">
              Learn the Basics
            </h2>
            <p className="mt-2 text-lg text-[#6b7280]">
              Plain-English guides that cut through the mortgage noise.
            </p>
          </div>
          <Link
            href="/learn"
            className="inline-flex flex-shrink-0 items-center text-sm font-semibold text-[#2d6a4f] transition-colors hover:text-[#245a41]"
          >
            Browse all guides
            <svg className="ml-1.5 h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>

        {/* Article cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <ArticleCard
            title="What is an FHA Loan?"
            description="FHA loans are backed by the federal government and designed for buyers with lower credit scores or smaller down payments. Learn how they work and who qualifies."
            readTime="5 min read"
            href="/learn/fha-basics"
            icon={<FHAIcon />}
          />
          <ArticleCard
            title="Understanding VA Loans"
            description="VA loans offer eligible veterans and service members competitive rates with no down payment required. Discover the unique benefits and eligibility requirements."
            readTime="5 min read"
            href="/learn/va-basics"
            icon={<VAIcon />}
          />
          <ArticleCard
            title="Conventional Loans Explained"
            description="Conventional loans are not government-backed, but they offer flexibility for borrowers with strong credit. Understand the key differences from FHA and VA options."
            readTime="5 min read"
            href="/learn/conventional-basics"
            icon={<ConventionalIcon />}
          />
        </div>
      </div>
    </section>
  );
}
