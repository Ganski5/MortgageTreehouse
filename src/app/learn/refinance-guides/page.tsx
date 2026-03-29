import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Refinance Guides",
  description: "Plain-English guides to refinancing your mortgage. Learn when it makes sense, what types exist, and what questions to ask.",
};

const toc = [
  { id: "when-to-refi", label: "When does refinancing make sense?" },
  { id: "rate-term", label: "Rate-and-term refinance" },
  { id: "cash-out", label: "Cash-out refinance" },
  { id: "fha-streamline", label: "FHA Streamline refinance" },
  { id: "va-irrrl", label: "VA IRRRL" },
  { id: "break-even", label: "The break-even point" },
  { id: "questions", label: "Questions to ask first" },
];

export default function RefinanceGuidesPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section style={{ background: "linear-gradient(135deg, #edf7f1 0%, #f9f8f6 60%)" }} className="py-14 px-4">
        <div className="max-w-5xl mx-auto">
          <nav className="flex items-center gap-2 text-sm mb-5" style={{ color: "#9ca3af" }}>
            <Link href="/" className="hover:text-[#2d6a4f] transition-colors">Home</Link>
            <span>/</span>
            <Link href="/learn" className="hover:text-[#2d6a4f] transition-colors">Learn</Link>
            <span>/</span>
            <span style={{ color: "#2d6a4f" }} className="font-medium">Refinance Guides</span>
          </nav>
          <span className="text-xs font-semibold px-3 py-1 rounded-full inline-block mb-4" style={{ background: "#edf7f1", color: "#2d6a4f" }}>8 min read</span>
          <h1 className="text-4xl font-bold mb-3" style={{ color: "#1e2533" }}>Refinance Guides</h1>
          <p className="text-lg max-w-2xl" style={{ color: "#4b5563" }}>
            Thinking about refinancing? Here&apos;s everything you need to know — in plain English — before you make a move.
          </p>
        </div>
      </section>

      {/* Key Takeaways */}
      <section className="px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-2xl p-6 border" style={{ background: "#edf7f1", borderColor: "#d3eddf" }}>
            <h2 className="font-bold text-lg mb-3" style={{ color: "#1e2533" }}>Key Takeaways</h2>
            <ul className="space-y-2">
              {[
                "Refinancing replaces your current mortgage with a new one — ideally at better terms.",
                "The most common reason to refinance is to lower your interest rate.",
                "There are costs involved, so calculate your break-even point before deciding.",
                "FHA Streamline and VA IRRRL are simplified options for existing government-loan borrowers.",
                "Cash-out refinancing lets you tap home equity, but increases your loan balance.",
              ].map((pt) => (
                <li key={pt} className="flex items-start gap-2 text-sm" style={{ color: "#1e2533" }}>
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#2d6a4f" }} />
                  {pt}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Content + TOC */}
      <div className="max-w-5xl mx-auto px-4 pb-16 flex flex-col lg:flex-row gap-10">
        {/* Main content */}
        <article className="flex-1 min-w-0 prose-content">

          <section id="when-to-refi" className="mb-10">
            <h2>When Does Refinancing Make Sense?</h2>
            <p>
              Refinancing means taking out a new mortgage to replace your existing one. Done right, it can save you thousands of dollars over the life of your loan. Done at the wrong time — or for the wrong reasons — it can cost you more than it saves.
            </p>
            <p>
              The most common reason people refinance is to get a lower interest rate. Even dropping your rate by 0.5% to 1% can meaningfully reduce your monthly payment and total interest paid. Other good reasons include shortening your loan term (say, from 30 years to 15) or switching from an adjustable-rate mortgage to a fixed rate for predictability.
            </p>
            <p>
              Refinancing typically makes less sense if you plan to sell in the near future, if rates have risen since you originally closed, or if your credit score has dropped significantly.
            </p>
            <h3>What this means for you</h3>
            <p>
              Before you call a lender, ask yourself: How long do I plan to stay in this home? What is my current rate, and what could I get today? What will the refinance cost me in closing fees? The answers to those questions — especially the break-even calculation — will tell you most of what you need to know.
            </p>
            <h3>Why it matters</h3>
            <p>
              A refinance is not just about the rate. It resets your loan term, so refinancing a 28-year-old loan back to 30 years means you&apos;re extending your payoff date — even if your payment drops. Understanding the full picture prevents surprises.
            </p>
          </section>

          <section id="rate-term" className="mb-10">
            <h2>Rate-and-Term Refinance</h2>
            <p>
              A rate-and-term refinance is the most straightforward type. You&apos;re simply replacing your existing mortgage with a new one that has a different interest rate, a different loan term, or both. You&apos;re not taking any cash out — you&apos;re just improving the structure of your loan.
            </p>
            <p>
              <strong>Example:</strong> You have a $350,000 mortgage at 7.25% with 27 years remaining. Rates have dropped and you can refinance to a 30-year loan at 6.00%. Your monthly payment drops by around $290, and you&apos;ll pay significantly less in total interest — though your payoff date extends by three years.
            </p>
            <p>
              Rate-and-term refinances are available for conventional, FHA, and VA loans. They generally require a full credit check, income verification, and an appraisal (though some streamlined programs waive the appraisal).
            </p>
          </section>

          <section id="cash-out" className="mb-10">
            <h2>Cash-Out Refinance</h2>
            <p>
              A cash-out refinance lets you borrow more than you currently owe on your mortgage and pocket the difference as cash. If your home is worth $500,000 and you owe $300,000, you might refinance to a $380,000 mortgage and receive $80,000 in cash (minus closing costs).
            </p>
            <p>
              People use cash-out refinances to pay for home renovations, consolidate high-interest debt, cover large expenses, or fund investments. The key tradeoff: your loan balance goes up, and so do your monthly payments.
            </p>
            <p>
              Most lenders allow you to borrow up to 80% of your home&apos;s value (LTV) on a conventional cash-out refinance. VA loans allow up to 90% in some cases. FHA cash-out refinances are limited to 80% LTV.
            </p>
            <h3>Why it matters</h3>
            <p>
              Using home equity for debt consolidation can make financial sense if the mortgage rate is lower than your credit card APR. But if you consolidate unsecured debt into a secured mortgage and can&apos;t make payments, you now risk your home. Use cash-out refinancing deliberately.
            </p>
          </section>

          <section id="fha-streamline" className="mb-10">
            <h2>FHA Streamline Refinance</h2>
            <p>
              The FHA Streamline is a special refinance program for borrowers who already have an FHA loan. It&apos;s designed to make the refinance process faster and simpler — typically no appraisal, limited income documentation, and reduced paperwork.
            </p>
            <p>
              To qualify, you must be refinancing an existing FHA loan into another FHA loan, and you must demonstrate a &quot;net tangible benefit&quot; — usually a lower interest rate or reduced mortgage insurance premium.
            </p>
            <p>
              One of the biggest advantages is the <strong>UFMIP (Upfront Mortgage Insurance Premium) refund</strong>. If you refinance within 36 months of your original FHA closing, you may receive a partial credit toward the new UFMIP due. The refund starts at 80% of the original UFMIP in month 1 and decreases by roughly 2% per month through month 36.
            </p>
            <div className="mt-4 p-4 rounded-xl" style={{ background: "#edf7f1", borderLeft: "4px solid #2d6a4f" }}>
              <p className="text-sm font-medium" style={{ color: "#2d6a4f" }}>
                Use our <Link href="/calculators/fha-streamline" className="underline">FHA Streamline Calculator</Link> to estimate the UFMIP refund and new loan amount for your client.
              </p>
            </div>
          </section>

          <section id="va-irrrl" className="mb-10">
            <h2>VA IRRRL (Interest Rate Reduction Refinance Loan)</h2>
            <p>
              The VA IRRRL — often called the VA Streamline — is the VA&apos;s version of a simplified refinance. It&apos;s available to veterans and service members who already have a VA loan and want to refinance into another VA loan at a lower rate.
            </p>
            <p>
              Like the FHA Streamline, the IRRRL is designed for speed and simplicity. In most cases, no appraisal is required, income documentation is minimal, and closing costs can often be rolled into the new loan.
            </p>
            <p>
              There is no maximum loan-to-value ratio for the VA IRRRL, which can make it useful for borrowers who are underwater or have minimal equity. The VA Funding Fee still applies (at a reduced rate of 0.5%), though eligible veterans may be exempt based on service-connected disability status.
            </p>
            <h3>What this means for you</h3>
            <p>
              The IRRRL is one of the cleanest refinance products available to eligible borrowers. If you have a VA loan and rates have dropped since you closed, it&apos;s worth running the numbers. The low documentation requirements and no-appraisal option make it significantly faster than a traditional refinance.
            </p>
          </section>

          <section id="break-even" className="mb-10">
            <h2>The Break-Even Point</h2>
            <p>
              Refinancing isn&apos;t free. Expect to pay 2% to 5% of your loan amount in closing costs — things like origination fees, title insurance, appraisal fees, and prepaid interest. These costs can be paid upfront or sometimes rolled into the loan.
            </p>
            <p>
              The break-even point is how long it takes for your monthly savings to outweigh the cost of refinancing.
            </p>
            <p>
              <strong>Simple formula:</strong> Closing costs ÷ Monthly savings = Break-even in months.
            </p>
            <p>
              <strong>Example:</strong> You&apos;re spending $6,000 to close a refinance that saves you $200/month. $6,000 ÷ $200 = 30 months. If you plan to stay in the home longer than 30 months, the refinance makes financial sense.
            </p>
            <h3>Why it matters</h3>
            <p>
              Too many borrowers refinance without calculating the break-even. They see a lower rate and assume it&apos;s a good deal. If you&apos;re moving in 18 months and your break-even is 30 months, you&apos;re paying to refinance and not staying long enough to benefit.
            </p>
          </section>

          <section id="questions" className="mb-10">
            <h2>Questions to Ask Before You Refinance</h2>
            <ul>
              <li>What is my current interest rate, and what rate can I qualify for today?</li>
              <li>What are the total closing costs, and can any be rolled into the loan?</li>
              <li>How long do I plan to stay in this home?</li>
              <li>What is my break-even point?</li>
              <li>Am I extending my loan term, and am I comfortable with that?</li>
              <li>If I have an FHA or VA loan, do I qualify for a streamlined program?</li>
              <li>Will I lose a UFMIP refund by waiting longer?</li>
              <li>Is my credit score in good shape to qualify for the best rate?</li>
            </ul>
          </section>
        </article>

        {/* Table of Contents */}
        <aside className="hidden lg:block w-56 flex-shrink-0">
          <div className="sticky top-24">
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#9ca3af" }}>On this page</p>
            <ul className="space-y-2">
              {toc.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="block text-sm py-1 transition-colors hover:text-[#2d6a4f]"
                    style={{ color: "#6b7280" }}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      {/* Related */}
      <section className="py-10 px-4" style={{ background: "#f3f4f6" }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-lg font-semibold mb-5" style={{ color: "#1e2533" }}>Related Resources</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { href: "/calculators/fha-streamline", label: "FHA Streamline Calculator", desc: "Calculate your UFMIP refund and new loan amount." },
              { href: "/calculators/va-residual-income", label: "VA Residual Income Calculator", desc: "Check residual income for VA loan eligibility." },
              { href: "/learn/fha-basics", label: "FHA Loan Basics", desc: "Understand how FHA loans work." },
            ].map((r) => (
              <Link
                key={r.href}
                href={r.href}
                className="block rounded-xl border p-4 transition-all hover:-translate-y-0.5 hover:shadow-md"
                style={{ background: "white", borderColor: "#e5e7eb" }}
              >
                <p className="font-semibold text-sm mb-1" style={{ color: "#2d6a4f" }}>{r.label}</p>
                <p className="text-xs" style={{ color: "#6b7280" }}>{r.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
