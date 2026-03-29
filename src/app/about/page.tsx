import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description: "Mortgage Treehouse exists to make mortgage information easier to understand and give brokers the tools they actually need.",
};

const beliefs = [
  {
    title: "Clarity over complexity",
    body: "The mortgage industry is full of jargon, fine print, and confusing processes. We believe that doesn't have to be the case. Every piece of content we write is measured by one question: would a first-time homebuyer understand this?",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    title: "Tools that actually work",
    body: "We build calculators on real guidelines — actual VA threshold tables, real UFMIP refund schedules — not rough approximations. Brokers need to trust their tools, so accuracy isn't optional.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
      </svg>
    ),
  },
  {
    title: "Free and open",
    body: "Mortgage information shouldn't be locked behind subscriptions or lead forms. Mortgage Treehouse is free to use, no account required. We think better-informed borrowers and brokers make the entire housing market healthier.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section style={{ background: "linear-gradient(135deg, #edf7f1 0%, #f9f8f6 60%)" }} className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium mb-6" style={{ background: "#edf7f1", color: "#2d6a4f", border: "1px solid #d3eddf" }}>
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z" clipRule="evenodd" />
            </svg>
            Our Mission
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-5 leading-tight" style={{ color: "#1e2533" }}>
            Mortgages shouldn&apos;t require<br />a decoder ring.
          </h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: "#4b5563" }}>
            Mortgage Treehouse exists to make mortgage information easier to understand, give brokers the tools they actually need, and help people make better decisions about their homes.
          </p>
        </div>
      </section>

      {/* Our story */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-6" style={{ color: "#1e2533" }}>Our Story</h2>
          <div className="space-y-4 prose-content">
            <p>
              Anyone who has gone through the mortgage process knows the feeling: sitting at a closing table, signing dozens of documents, and realizing you don&apos;t fully understand half of what&apos;s in front of you. Or searching online for answers and finding articles that swap one set of jargon for another.
            </p>
            <p>
              That experience is what Mortgage Treehouse was built to address. The mortgage industry has great professionals in it — dedicated loan officers, diligent brokers, and hardworking underwriters. But the information available to borrowers often lags far behind. Plain-English explanations are rare. Tools built for everyday use are even rarer.
            </p>
            <p>
              We started with two goals: build a place where homebuyers can get real answers without jargon, and build tools that mortgage brokers can actually rely on during their workday. Not generic estimators — real calculators grounded in actual VA and FHA guidelines.
            </p>
            <p>
              The &quot;Treehouse&quot; in the name is intentional. A treehouse is a safe place. It&apos;s a place to learn, explore, and figure things out — without judgment. That&apos;s what we want this to be for anyone navigating a mortgage, whether it&apos;s their first home or their fiftieth transaction.
            </p>
          </div>
        </div>
      </section>

      {/* What we believe */}
      <section className="py-16 px-4" style={{ background: "#f9f8f6" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold" style={{ color: "#1e2533" }}>What We Believe</h2>
            <p className="mt-2" style={{ color: "#4b5563" }}>The principles that drive every decision we make.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {beliefs.map((b) => (
              <div
                key={b.title}
                className="rounded-2xl p-6"
                style={{ background: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: "#edf7f1", color: "#2d6a4f" }}>
                  {b.icon}
                </div>
                <h3 className="font-bold mb-2" style={{ color: "#1e2533" }}>{b.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#4b5563" }}>{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What we're building */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-4" style={{ color: "#1e2533" }}>What We&apos;re Building</h2>
          <p className="mb-4" style={{ color: "#4b5563" }}>
            Mortgage Treehouse is still growing. Right now, we have two production-ready calculators — VA Residual Income and FHA Streamline — and an educational content library covering the most common loan types and concepts.
          </p>
          <p className="mb-4" style={{ color: "#4b5563" }}>
            Coming next: more calculators (DTI, ARM vs. Fixed, refinance break-even), a broader glossary, and deeper guides on topics like credit score improvement, escrow, and title insurance.
          </p>
          <p style={{ color: "#4b5563" }}>
            If there&apos;s a tool you need or a topic you&apos;d like us to cover, we want to hear from you.{" "}
            <Link href="/contact" className="font-medium underline" style={{ color: "#2d6a4f" }}>Send us a message.</Link>
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 px-4" style={{ background: "#edf7f1" }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-xl font-bold mb-3" style={{ color: "#1e2533" }}>Ready to explore?</h2>
          <p className="mb-6" style={{ color: "#4b5563" }}>Whether you&apos;re a homebuyer learning the basics or a broker running a quick scenario, there&apos;s something here for you.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/homebuyers" className="px-5 py-3 rounded-xl text-sm font-semibold text-white" style={{ background: "#2d6a4f" }}>
              Homebuyer Guides
            </Link>
            <Link href="/calculators" className="px-5 py-3 rounded-xl text-sm font-semibold" style={{ background: "white", color: "#2d6a4f", border: "1.5px solid #2d6a4f" }}>
              Broker Calculators
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
