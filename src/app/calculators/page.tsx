import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Mortgage Calculators",
  description: "Fast, reliable mortgage calculators built on real VA and FHA guidelines. VA Residual Income, FHA Streamline, and more.",
};

const available = [
  {
    href: "/calculators/va-residual-income",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    badge: "Broker Tool",
    badgeColor: "#2d6a4f",
    title: "VA Residual Income Calculator",
    description:
      "Determine whether a VA loan borrower meets the residual income requirement. Enter income, debts, housing costs, region, and family size to get an instant pass/fail result against official VA thresholds.",
    features: ["Region-based VA thresholds", "Family size scaling", "Full deduction breakdown", "Pass / Fail indicator"],
    cta: "Open Calculator",
    ctaBg: "#2d6a4f",
  },
  {
    href: "/calculators/fha-streamline",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
      </svg>
    ),
    badge: "Broker Tool",
    badgeColor: "#2d6a4f",
    title: "FHA Streamline Refinance Calculator",
    description:
      "Calculate estimated UFMIP refund credit, new loan amount, and monthly payment change for an FHA-to-FHA streamline refinance. Shows the full refund schedule and net MIP impact.",
    features: ["UFMIP refund schedule", "Net MIP after credit", "Payment comparison", "Eligibility notes"],
    cta: "Open Calculator",
    ctaBg: "#2d6a4f",
  },
];

const coming = [
  {
    title: "DTI Calculator",
    description: "Calculate debt-to-income ratio for conventional, FHA, and VA loan scenarios.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
  },
  {
    title: "ARM vs. Fixed Comparison",
    description: "Compare adjustable-rate and fixed-rate mortgages over time with real amortization data.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
      </svg>
    ),
  },
  {
    title: "Refinance Break-Even",
    description: "Find out how many months it takes to recoup refinance closing costs through monthly savings.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

export default function CalculatorsPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <section style={{ background: "linear-gradient(135deg, #edf7f1 0%, #f9f8f6 60%)" }} className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <nav className="flex items-center gap-2 text-sm mb-6" style={{ color: "#9ca3af" }}>
            <Link href="/" className="hover:text-[#2d6a4f] transition-colors">Home</Link>
            <span>/</span>
            <span style={{ color: "#2d6a4f" }} className="font-medium">Calculators</span>
          </nav>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#2d6a4f", color: "white" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V13.5zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V18zm2.498-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zM8.25 6h7.5v2.25h-7.5V6zM12 2.25c-1.892 0-3.758.35-5.45 1.004a.75.75 0 01-.6-.15C4.8 2.5 3.75 1.758 3.75 2.25v19.5c0 .414.336.75.75.75h15a.75.75 0 00.75-.75V2.25c0-.492-1.05.25-2.2.854a.75.75 0 01-.6.15A14.948 14.948 0 0012 2.25z" />
              </svg>
            </div>
            <span className="text-sm font-medium px-3 py-1 rounded-full" style={{ background: "#edf7f1", color: "#2d6a4f" }}>Free Tools</span>
          </div>
          <h1 className="text-4xl font-bold mb-3" style={{ color: "#1e2533" }}>Mortgage Calculators</h1>
          <p className="text-lg max-w-2xl" style={{ color: "#4b5563" }}>
            Fast, reliable tools built on real VA and FHA guidelines. Use them during client conversations or as a quick sanity check before you run numbers through your LOS.
          </p>
        </div>
      </section>

      {/* Available Calculators */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-2" style={{ color: "#1e2533" }}>Available Now</h2>
          <p className="mb-8" style={{ color: "#4b5563" }}>Production-ready calculators with real guideline logic built in.</p>
          <div className="grid gap-6 md:grid-cols-2">
            {available.map((calc) => (
              <div
                key={calc.href}
                className="rounded-2xl border p-6 flex flex-col gap-4"
                style={{ background: "white", borderColor: "#e5e7eb", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
              >
                <div className="flex items-start justify-between">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ background: "#edf7f1", color: "#2d6a4f" }}
                  >
                    {calc.icon}
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: "#edf7f1", color: "#2d6a4f" }}>
                    {calc.badge}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: "#1e2533" }}>{calc.title}</h3>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: "#4b5563" }}>{calc.description}</p>
                  <ul className="space-y-1.5 mb-5">
                    {calc.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm" style={{ color: "#4b5563" }}>
                        <span className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "#edf7f1" }}>
                          <svg viewBox="0 0 10 10" fill="none" className="w-2.5 h-2.5" stroke="#2d6a4f" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M1.5 5.5l2 2 5-4" />
                          </svg>
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link
                  href={calc.href}
                  className="mt-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 hover:-translate-y-0.5"
                  style={{ background: calc.ctaBg }}
                >
                  {calc.cta}
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coming Soon */}
      <section className="py-12 px-4" style={{ background: "#f9f8f6" }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-bold" style={{ color: "#1e2533" }}>Coming Soon</h2>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: "#fff3e0", color: "#f4a261" }}>In Development</span>
          </div>
          <p className="mb-8" style={{ color: "#4b5563" }}>More tools are on the way. Have a calculator in mind? <Link href="/contact" className="font-medium underline" style={{ color: "#2d6a4f" }}>Let us know.</Link></p>
          <div className="grid gap-4 md:grid-cols-3">
            {coming.map((c) => (
              <div
                key={c.title}
                className="rounded-2xl border p-5"
                style={{ background: "white", borderColor: "#e5e7eb", borderStyle: "dashed", opacity: 0.8 }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: "#f3f4f6", color: "#9ca3af" }}>
                  {c.icon}
                </div>
                <h3 className="font-semibold mb-1" style={{ color: "#6b7280" }}>{c.title}</h3>
                <p className="text-sm" style={{ color: "#9ca3af" }}>{c.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-lg font-medium mb-2" style={{ color: "#1e2533" }}>Need a specific calculator?</p>
          <p className="mb-5" style={{ color: "#4b5563" }}>We build based on what brokers and buyers actually need. Send us a request.</p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ background: "#2d6a4f" }}
          >
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
}
