import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Learn the Mortgage Basics",
  description:
    "Plain-English guides to help you understand FHA loans, VA loans, conventional mortgages, and more before you talk to a lender.",
};

const topics = [
  {
    href: "/learn/fha-basics",
    icon: "🏠",
    title: "FHA Basics",
    description:
      "FHA loans are backed by the federal government and allow down payments as low as 3.5%. A great starting point if your credit score is under 700 or your savings are limited.",
  },
  {
    href: "/learn/va-basics",
    icon: "🎖️",
    title: "VA Basics",
    description:
      "VA loans are available to eligible veterans, active-duty service members, and surviving spouses. They offer zero down payment and no private mortgage insurance.",
  },
  {
    href: "/learn/conventional-basics",
    icon: "📋",
    title: "Conventional Basics",
    description:
      "Conventional loans are not government-backed. They typically require a higher credit score but offer more flexibility in loan amounts and property types.",
  },
  {
    href: "/learn/mortgage-glossary",
    icon: "📖",
    title: "Mortgage Glossary",
    description:
      "Every mortgage term explained in plain English — from APR and amortization to LTV, PMI, and underwriting. Search the full A-Z list.",
  },
  {
    href: "/learn/refinance-guides",
    icon: "🔄",
    title: "Refinance Guides",
    description:
      "Thinking about refinancing? Learn when it makes sense, how to calculate your break-even point, and the difference between rate-and-term and cash-out refinances.",
  },
];

const featuredTopics = [
  {
    href: "/learn/fha-basics#what-is-mip",
    label: "What is Mortgage Insurance Premium (MIP)?",
  },
  {
    href: "/learn/va-basics#funding-fee",
    label: "How does the VA Funding Fee work?",
  },
  {
    href: "/learn/conventional-basics#pmi",
    label: "When do I have to pay PMI?",
  },
  {
    href: "/learn/refinance-guides#break-even",
    label: "How do I calculate my refinance break-even point?",
  },
  {
    href: "/learn/mortgage-glossary",
    label: "What does DTI mean?",
  },
];

export default function LearnHubPage() {
  return (
    <div className="bg-[#f9f8f6] min-h-screen">
      {/* Hero */}
      <section className="bg-white border-b border-[#e5e7eb]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <nav className="text-sm text-[#9ca3af] mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[#2d6a4f] transition-colors">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-[#1e2533]">Learn</span>
          </nav>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#2d6a4f] leading-tight mb-4">
            Learn the Mortgage Basics
          </h1>
          <p className="text-lg sm:text-xl text-[#4b5563] max-w-2xl">
            Plain-English guides to help you understand mortgages before you
            talk to a lender. No confusing jargon — just clear explanations.
          </p>
          {/* Search hint */}
          <div className="mt-8 flex items-center gap-3 bg-[#edf7f1] border border-[#d3eddf] rounded-xl px-5 py-4 max-w-lg">
            <span className="text-xl">🔍</span>
            <p className="text-sm text-[#4b5563]">
              Looking for a specific term?{" "}
              <Link
                href="/learn/mortgage-glossary"
                className="text-[#2d6a4f] font-semibold underline underline-offset-2 hover:text-[#1a4a35]"
              >
                Browse the full A-Z Mortgage Glossary →
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Topic Cards */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <h2 className="text-2xl font-bold text-[#1e2533] mb-8">
          Browse by Topic
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((topic) => (
            <Link
              key={topic.href}
              href={topic.href}
              className="group bg-white rounded-2xl border border-[#e5e7eb] p-6 flex flex-col gap-3 hover:border-[#2d6a4f] hover:shadow-md transition-all duration-200"
            >
              <span className="text-3xl">{topic.icon}</span>
              <h3 className="text-lg font-bold text-[#1e2533] group-hover:text-[#2d6a4f] transition-colors">
                {topic.title}
              </h3>
              <p className="text-sm text-[#4b5563] leading-relaxed flex-1">
                {topic.description}
              </p>
              <span className="text-sm font-semibold text-[#2d6a4f] mt-auto">
                Read Guide →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Topics */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-white rounded-2xl border border-[#e5e7eb] p-8">
          <h2 className="text-xl font-bold text-[#1e2533] mb-2">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-[#9ca3af] mb-6">
            Jump straight to the answers borrowers ask most often.
          </p>
          <ul className="space-y-3">
            {featuredTopics.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center gap-3 text-sm text-[#4b5563] hover:text-[#2d6a4f] transition-colors group"
                >
                  <span className="w-2 h-2 rounded-full bg-[#2d6a4f] flex-shrink-0 group-hover:scale-125 transition-transform" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
