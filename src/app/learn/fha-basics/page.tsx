import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FHA Loans Explained",
  description:
    "Learn what an FHA loan is, who qualifies, how mortgage insurance works, and how FHA compares to conventional loans — in plain English.",
};

const toc = [
  { id: "what-is-fha", label: "What is an FHA loan?" },
  { id: "who-is-it-for", label: "Who is it for?" },
  { id: "key-requirements", label: "Key requirements" },
  { id: "what-is-mip", label: "What is MIP?" },
  { id: "fha-vs-conventional", label: "FHA vs Conventional" },
  { id: "what-this-means", label: "What this means for you" },
  { id: "why-it-matters", label: "Why it matters" },
  { id: "example", label: "Simple example" },
];

const relatedTopics = [
  { href: "/learn/va-basics", label: "VA Loans Explained" },
  { href: "/learn/conventional-basics", label: "Conventional Loans Explained" },
  { href: "/learn/refinance-guides", label: "Refinance Guides" },
  { href: "/learn/mortgage-glossary", label: "Mortgage Glossary" },
];

export default function FhaBasicsPage() {
  return (
    <div className="bg-[#f9f8f6] min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-[#e5e7eb]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="text-sm text-[#9ca3af]" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[#2d6a4f] transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/learn" className="hover:text-[#2d6a4f] transition-colors">Learn</Link>
            <span className="mx-2">/</span>
            <span className="text-[#1e2533]">FHA Basics</span>
          </nav>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="lg:grid lg:grid-cols-[1fr_260px] lg:gap-12">
          {/* Main content */}
          <div>
            {/* Page header */}
            <div className="mb-8">
              <span className="inline-block bg-[#edf7f1] text-[#2d6a4f] text-xs font-semibold px-3 py-1 rounded-full mb-3">
                FHA Loans
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold text-[#2d6a4f] mb-3">
                FHA Loans Explained
              </h1>
              <p className="text-[#4b5563] text-lg leading-relaxed">
                Everything you need to know about FHA loans — including who they are for, what mortgage insurance costs, and how they compare to other loan types.
              </p>
            </div>

            {/* Key Takeaways */}
            <div className="bg-[#edf7f1] border border-[#d3eddf] rounded-2xl p-6 mb-10">
              <h2 className="text-base font-bold text-[#2d6a4f] mb-3">Key Takeaways</h2>
              <ul className="space-y-2">
                {[
                  "FHA loans are backed by the federal government and easier to qualify for than conventional loans.",
                  "You can put down as little as 3.5% if your credit score is 580 or higher.",
                  "All FHA loans require mortgage insurance (MIP), which adds to your monthly cost.",
                  "FHA is often the best fit for first-time buyers or buyers with lower credit scores.",
                  "Once you have enough equity, you can refinance out of an FHA loan to remove mortgage insurance.",
                ].map((point) => (
                  <li key={point} className="flex items-start gap-2 text-sm text-[#4b5563]">
                    <span className="mt-1 w-2 h-2 rounded-full bg-[#2d6a4f] flex-shrink-0" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            {/* Prose content */}
            <div className="prose-content">
              <h2 id="what-is-fha">What is an FHA loan?</h2>
              <p>
                An FHA loan is a type of mortgage that is insured by the Federal Housing Administration, which is part of the U.S. Department of Housing and Urban Development (HUD). "Insured" here means that if you stop making payments, the government will repay the lender — not that the government gives you money directly.
              </p>
              <p>
                Because the lender is protected against loss, they are willing to offer loans to borrowers who might not qualify for a standard (conventional) mortgage. This makes FHA loans one of the most accessible paths to homeownership in the United States.
              </p>
              <p>
                FHA loans have been around since 1934. They were created during the Great Depression specifically to help more Americans buy homes when banks had tightened their lending standards. Today they remain one of the most popular loan programs for first-time homebuyers.
              </p>
              <p>
                One important thing to understand: FHA does not lend money directly. You still borrow from a bank, credit union, or mortgage company. FHA simply insures the loan, which changes the risk equation for the lender.
              </p>

              <h2 id="who-is-it-for">Who is it for?</h2>
              <p>
                FHA loans are well suited for buyers who have a limited down payment saved, a lower or shorter credit history, or who have experienced a past financial hardship like a bankruptcy or foreclosure. You do not have to be a first-time buyer — FHA loans are open to anyone buying a primary residence (the home you will live in).
              </p>
              <p>
                If your credit score is in the 580–679 range, an FHA loan will almost certainly offer you a better interest rate and a more reasonable approval process than a conventional loan. If your score is below 580, you may still qualify with a 10% down payment. Most conventional lenders want to see a score of at least 620, and they reward much higher scores with better rates.
              </p>
              <p>
                FHA is also helpful if your <strong>debt-to-income ratio (DTI)</strong> — which compares your monthly debt payments to your monthly income — is on the higher side. FHA generally allows a DTI of up to 57%, while conventional loans often cap it around 45–50%.
              </p>

              <h2 id="key-requirements">Key requirements</h2>

              <h3>Down payment</h3>
              <p>
                The minimum down payment is <strong>3.5%</strong> of the purchase price for borrowers with a credit score of 580 or higher. On a $300,000 home, that is $10,500. If your score is between 500 and 579, you will need to put down 10%.
              </p>
              <p>
                The down payment can come from your own savings, a gift from a family member, or certain down payment assistance programs. FHA has flexible rules about the source of your down payment compared to conventional loans.
              </p>

              <h3>Credit score</h3>
              <p>
                The FHA program itself sets the minimum at 500. However, most lenders who offer FHA loans apply their own stricter requirements — commonly 580 or 620 — to protect themselves from risk. Always ask the specific lender what their minimum is.
              </p>

              <h3>Mortgage Insurance Premium (MIP)</h3>
              <p>
                All FHA loans require mortgage insurance, which is called MIP. It comes in two parts: an upfront cost and an ongoing monthly cost. See the next section for a full explanation.
              </p>

              <h3>Loan limits</h3>
              <p>
                FHA sets maximum loan amounts that vary by county. In most areas in 2025, the limit is around $524,225 for a single-family home. In high-cost areas like San Francisco or New York City, the limit can be significantly higher. If your purchase price exceeds the limit, you would need a different loan type.
              </p>

              <h3>Property condition</h3>
              <p>
                The home must meet FHA's minimum property standards. This means it needs to be safe, sound, and secure. FHA appraisers check for things like a working roof, functional utilities, and no major structural issues. A home that needs significant repairs may not qualify for FHA financing — or you may need an FHA 203(k) renovation loan instead.
              </p>

              <h2 id="what-is-mip">What is Mortgage Insurance Premium (MIP)?</h2>
              <p>
                Mortgage Insurance Premium, or MIP, is the fee you pay for the government's guarantee on your FHA loan. Think of it as an insurance policy that protects the lender — not you — if you default (stop paying).
              </p>
              <p>
                MIP has two parts. The first is the <strong>Upfront MIP (UFMIP)</strong>: a one-time fee of 1.75% of your loan amount. On a $290,000 loan (after a 3.5% down payment on a $300,000 home), that is $5,075. This is usually rolled into your loan balance rather than paid at closing. The second part is the <strong>Annual MIP</strong>: an ongoing monthly fee, typically 0.55% of your loan balance per year (for most standard loans). On that same $290,000 loan, that works out to about $133 per month added to your payment.
              </p>
              <p>
                Here is the critical detail: if you put down less than 10%, MIP stays on your loan for the entire loan term — usually 30 years. If you put down 10% or more, MIP falls off after 11 years. This is very different from conventional loans, where private mortgage insurance (PMI) automatically drops once you reach 20% equity. Because of this, many FHA borrowers refinance into a conventional loan once they have built enough equity to eliminate the insurance cost.
              </p>

              <h2 id="fha-vs-conventional">FHA vs Conventional comparison</h2>
              <div className="overflow-x-auto my-6">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-[#2d6a4f] text-white">
                      <th className="text-left px-4 py-3 rounded-tl-lg font-semibold">Feature</th>
                      <th className="text-left px-4 py-3 font-semibold">FHA</th>
                      <th className="text-left px-4 py-3 rounded-tr-lg font-semibold">Conventional</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Minimum down payment", "3.5% (score ≥ 580)", "3% (score ≥ 620)"],
                      ["Minimum credit score", "500 (lender may require more)", "620 typical"],
                      ["Mortgage insurance", "Required on all loans (MIP)", "Required if down < 20% (PMI)"],
                      ["Mortgage insurance removal", "Never (< 10% down) or 11 years (≥ 10% down)", "Automatic at 20% equity"],
                      ["DTI limit", "Up to ~57%", "Up to ~45–50%"],
                      ["Loan limits", "Set by county (~$524K most areas)", "Conforming up to $806,500 (2025)"],
                      ["Property condition", "Stricter minimum standards", "More flexible"],
                      ["Best for", "Lower credit, limited savings", "Higher credit, more equity"],
                    ].map(([feature, fha, conv], i) => (
                      <tr key={feature} className={i % 2 === 0 ? "bg-white" : "bg-[#f9f8f6]"}>
                        <td className="px-4 py-3 font-medium text-[#1e2533] border-b border-[#e5e7eb]">{feature}</td>
                        <td className="px-4 py-3 text-[#4b5563] border-b border-[#e5e7eb]">{fha}</td>
                        <td className="px-4 py-3 text-[#4b5563] border-b border-[#e5e7eb]">{conv}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h2 id="what-this-means">What this means for you</h2>
              <p>
                If you are buying your first home, have a credit score below 680, or have less than 10% saved for a down payment, an FHA loan may be your most realistic path to homeownership right now. The lower bar to qualify means you do not have to wait years to save more or improve your credit before buying.
              </p>
              <p>
                The trade-off is the ongoing MIP cost. Over time, that monthly premium adds up. If you plan to stay in the home long-term, the smart move is often to use FHA to get in the door, then refinance to a conventional loan once your credit improves or your equity reaches 20%. Many homeowners do exactly this.
              </p>

              <h2 id="why-it-matters">Why it matters</h2>
              <p>
                Understanding MIP is probably the single most important thing about FHA loans. Many buyers are surprised to learn that mortgage insurance never goes away on their FHA loan (if they put down less than 10%), even after years of building equity. A conventional loan with PMI, by contrast, automatically removes the insurance when you hit 20% equity — so you could save hundreds of dollars per month at that point.
              </p>
              <p>
                This does not mean FHA is a bad deal. For buyers who need it, FHA opens doors that would otherwise be closed. But you should go in with a clear picture of the total cost, including the insurance, so you can plan ahead.
              </p>

              <h2 id="example">Simple example scenario</h2>
              <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl p-6 my-6">
                <p className="font-semibold text-[#1e2533] mb-2">Meet Sarah</p>
                <p>
                  Sarah is a nurse buying her first home. She has a credit score of 620 and has saved $12,000. She finds a home priced at $280,000.
                </p>
                <ul>
                  <li><strong>Down payment (3.5%):</strong> $9,800 — Sarah can afford this.</li>
                  <li><strong>Loan amount:</strong> $270,200</li>
                  <li><strong>Upfront MIP (1.75%):</strong> $4,729 rolled into the loan</li>
                  <li><strong>Monthly MIP (~0.55%/year):</strong> ≈ $124/month added to her payment</li>
                  <li><strong>Interest rate:</strong> Competitive because FHA is government-backed</li>
                </ul>
                <p>
                  Sarah closes on the home. In 5 years, her home has appreciated and she has paid down some of her balance. Once her loan-to-value ratio drops to 80%, she refinances into a conventional loan and drops the MIP entirely, saving over $100 per month going forward.
                </p>
              </div>
            </div>

            {/* Calculator CTA */}
            <div className="mt-10 bg-white border border-[#e5e7eb] rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="text-3xl">🧮</div>
              <div className="flex-1">
                <p className="font-semibold text-[#1e2533]">FHA Streamline Calculator</p>
                <p className="text-sm text-[#4b5563]">Already have an FHA loan? See if an FHA Streamline refinance could lower your rate or payment.</p>
              </div>
              <Link
                href="/calculators/fha-streamline"
                className="inline-block bg-[#2d6a4f] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-[#1a4a35] transition-colors whitespace-nowrap"
              >
                Open Calculator →
              </Link>
            </div>

            {/* Related Topics */}
            <div className="mt-10 pt-8 border-t border-[#e5e7eb]">
              <h3 className="text-base font-bold text-[#1e2533] mb-4">Related Topics</h3>
              <div className="flex flex-wrap gap-3">
                {relatedTopics.map((topic) => (
                  <Link
                    key={topic.href}
                    href={topic.href}
                    className="inline-block bg-white border border-[#e5e7eb] text-sm text-[#4b5563] px-4 py-2 rounded-lg hover:border-[#2d6a4f] hover:text-[#2d6a4f] transition-colors"
                  >
                    {topic.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Table of Contents */}
          <aside className="hidden lg:block">
            <div className="sticky top-8 bg-white border border-[#e5e7eb] rounded-2xl p-5">
              <p className="text-xs font-bold text-[#9ca3af] uppercase tracking-wider mb-3">On this page</p>
              <nav className="space-y-1">
                {toc.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="block text-sm text-[#4b5563] hover:text-[#2d6a4f] py-1 hover:pl-1 transition-all"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
