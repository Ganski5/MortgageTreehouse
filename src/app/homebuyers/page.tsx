import type { Metadata } from 'next';
import Link from 'next/link';
import FaqAccordion from '@/components/homebuyers/FaqAccordion';

export const metadata: Metadata = {
  title: 'Homebuyers Guide — Mortgage Education in Plain English',
  description:
    'Everything you need to understand your mortgage — loan types, key terms, down payments, PMI, and more. No jargon, no pressure.',
};

const paths = [
  {
    icon: '🏠',
    title: "I'm buying my first home",
    description: 'Start with the fundamentals — what to expect, what lenders look for, and how to prepare.',
    href: '/learn/fha-basics',
  },
  {
    icon: '📋',
    title: 'I want to understand loan types',
    description: 'Compare FHA, VA, conventional, and USDA loans side by side in plain language.',
    href: '/learn',
  },
  {
    icon: '📖',
    title: 'I want to learn key terms',
    description: 'DTI, LTV, PMI, MIP — every acronym explained clearly before your lender uses it.',
    href: '/learn/mortgage-glossary',
  },
  {
    icon: '🔄',
    title: 'I want to refinance',
    description: 'Learn when refinancing makes sense, how to calculate your break-even, and what to watch out for.',
    href: '/learn/refinance-guides',
  },
];

const guides = [
  {
    title: 'FHA Basics',
    description:
      'FHA loans are backed by the federal government and require as little as 3.5% down. If your credit score is below 700 or you\'re short on savings, this may be the right starting point.',
    href: '/learn/fha-basics',
    tag: 'Popular for first-time buyers',
    tagColor: '#d1fae5',
    tagTextColor: '#065f46',
  },
  {
    title: 'VA Basics',
    description:
      'VA loans offer 0% down, no PMI, and competitive rates for eligible veterans, active-duty service members, and surviving spouses. One of the best loan products available.',
    href: '/learn/va-basics',
    tag: 'Zero down payment',
    tagColor: '#fef3c7',
    tagTextColor: '#92400e',
  },
  {
    title: 'Conventional Basics',
    description:
      'Not government-backed, but highly flexible. Conventional loans are ideal if you have strong credit and can put down at least 5–20%, and PMI can be removed once you build equity.',
    href: '/learn/conventional-basics',
    tag: 'Best for strong credit',
    tagColor: '#ede9fe',
    tagTextColor: '#5b21b6',
  },
];

export default function HomebuyersPage() {
  return (
    <div className="bg-[#f9f8f6] min-h-screen">
      {/* Hero */}
      <section className="bg-[#2d6a4f]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="max-w-3xl">
            <p className="text-[#a7f3d0] text-sm font-semibold uppercase tracking-widest mb-4">
              For Homebuyers
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Everything you need to understand your mortgage.
            </h1>
            <p className="text-lg sm:text-xl text-[#b7e4cc] leading-relaxed mb-10">
              Buying a home is one of the biggest financial decisions you'll ever make. We cut through
              the jargon so you can walk into any lender conversation knowing exactly what you're
              being offered — and why it matters.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/learn"
                className="inline-block bg-[#f4a261] text-white font-semibold px-7 py-3.5 rounded-lg hover:bg-[#e07b3c] transition-colors text-base"
              >
                Start Learning
              </Link>
              <Link
                href="/learn/mortgage-glossary"
                className="inline-block bg-white/10 text-white font-semibold px-7 py-3.5 rounded-lg hover:bg-white/20 transition-colors text-base border border-white/20"
              >
                Browse Glossary
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Where would you like to start */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#1e2533] mb-3">
          Where would you like to start?
        </h2>
        <p className="text-[#6b7280] mb-10 text-base sm:text-lg">
          Pick the path that matches where you are right now.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {paths.map((path) => (
            <Link
              key={path.href}
              href={path.href}
              className="group bg-white rounded-2xl border border-[#e5e7eb] p-7 flex flex-col gap-3 hover:border-[#2d6a4f] hover:shadow-md transition-all duration-200"
            >
              <span className="text-3xl">{path.icon}</span>
              <h3 className="text-lg font-bold text-[#1e2533] group-hover:text-[#2d6a4f] transition-colors">
                {path.title}
              </h3>
              <p className="text-sm text-[#6b7280] leading-relaxed flex-1">{path.description}</p>
              <span className="text-sm font-semibold text-[#2d6a4f] mt-1 flex items-center gap-1">
                Go <span aria-hidden="true">→</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Start Here Guides */}
      <section className="bg-white border-y border-[#e5e7eb]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="mb-10">
            <span className="inline-block text-[#2d6a4f] text-xs font-bold uppercase tracking-widest mb-3">
              Start Here
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1e2533] mb-3">Featured Guides</h2>
            <p className="text-[#6b7280] text-base sm:text-lg">
              These three guides cover the loan types most homebuyers encounter. Read one or all three.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {guides.map((guide) => (
              <div
                key={guide.href}
                className="bg-[#f9f8f6] rounded-2xl border border-[#e5e7eb] p-6 flex flex-col gap-4"
              >
                <div>
                  <span
                    className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-4"
                    style={{ backgroundColor: guide.tagColor, color: guide.tagTextColor }}
                  >
                    {guide.tag}
                  </span>
                  <h3 className="text-lg font-bold text-[#1e2533] mb-2">{guide.title}</h3>
                  <p className="text-sm text-[#6b7280] leading-relaxed">{guide.description}</p>
                </div>
                <Link
                  href={guide.href}
                  className="mt-auto inline-block text-sm font-semibold text-[#2d6a4f] hover:text-[#1a4a35] transition-colors"
                >
                  Read the Guide →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="max-w-3xl">
          <span className="inline-block text-[#2d6a4f] text-xs font-bold uppercase tracking-widest mb-3">
            Common Questions
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1e2533] mb-3">
            Homebuyer FAQ
          </h2>
          <p className="text-[#6b7280] text-base sm:text-lg mb-10">
            These are the questions buyers ask most often. We've answered them honestly, without the
            marketing spin.
          </p>
          <div className="bg-white rounded-2xl border border-[#e5e7eb] px-6 sm:px-8 py-2">
            <FaqAccordion />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#2d6a4f]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Ready to go deeper?
          </h2>
          <p className="text-[#b7e4cc] text-lg mb-8 max-w-xl mx-auto">
            Browse our full library of mortgage guides — from loan basics to refinancing — all written
            in plain English.
          </p>
          <Link
            href="/learn"
            className="inline-block bg-[#f4a261] text-white font-semibold px-8 py-4 rounded-lg hover:bg-[#e07b3c] transition-colors text-base"
          >
            Explore the Learn Section →
          </Link>
        </div>
      </section>
    </div>
  );
}
