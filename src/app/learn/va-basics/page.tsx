import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "VA Loans Explained",
  description:
    "Learn what a VA loan is, who qualifies, how the VA Funding Fee works, and why VA loans are one of the best mortgage benefits available to veterans.",
};

const toc = [
  { id: "what-is-va", label: "What is a VA loan?" },
  { id: "who-qualifies", label: "Who qualifies?" },
  { id: "key-benefits", label: "Key benefits" },
  { id: "residual-income", label: "What is residual income?" },
  { id: "funding-fee", label: "VA Funding Fee" },
  { id: "what-this-means", label: "What this means for you" },
  { id: "why-it-matters", label: "Why it matters" },
  { id: "example", label: "Simple example" },
];

const relatedTopics = [
  { href: "/learn/fha-basics", label: "FHA Loans Explained" },
  { href: "/learn/conventional-basics", label: "Conventional Loans Explained" },
  { href: "/learn/refinance-guides", label: "Refinance Guides" },
  { href: "/learn/mortgage-glossary", label: "Mortgage Glossary" },
];

export default function VaBasicsPage() {
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
            <span className="text-[#1e2533]">VA Basics</span>
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
                VA Loans
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold text-[#2d6a4f] mb-3">
                VA Loans Explained
              </h1>
              <p className="text-[#4b5563] text-lg leading-relaxed">
                VA loans are one of the most powerful homebuying benefits available to eligible veterans and service members. Here is everything you need to know.
              </p>
            </div>

            {/* Key Takeaways */}
            <div className="bg-[#edf7f1] border border-[#d3eddf] rounded-2xl p-6 mb-10">
              <h2 className="text-base font-bold text-[#2d6a4f] mb-3">Key Takeaways</h2>
              <ul className="space-y-2">
                {[
                  "VA loans are available to eligible veterans, active-duty service members, reservists, and surviving spouses.",
                  "No down payment required — you can borrow up to the full purchase price.",
                  "No private mortgage insurance (PMI), which saves you money every month compared to FHA and some conventional loans.",
                  "VA loans require a one-time VA Funding Fee, which can be rolled into the loan.",
                  "VA uses a unique qualifying measure called residual income in addition to standard debt ratios.",
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
              <h2 id="what-is-va">What is a VA loan?</h2>
              <p>
                A VA loan is a mortgage loan guaranteed by the U.S. Department of Veterans Affairs (VA). Similar to FHA, the VA does not lend money directly — it guarantees a portion of the loan, which protects the lender if you default. Because of this guarantee, lenders can offer very favorable terms to qualified borrowers.
              </p>
              <p>
                VA loans have been available since 1944, when they were created as part of the original GI Bill to help World War II veterans buy homes, farms, and businesses. Today the VA home loan program is widely considered the single best mortgage benefit available to those who serve or have served in the U.S. military.
              </p>
              <p>
                The two biggest advantages that set VA loans apart are zero down payment and no ongoing mortgage insurance. On a $350,000 home, not having to put down 5% saves you $17,500 upfront, and not paying PMI can save you $150–$200 per month every month for years. Over the life of a loan, this adds up to a significant sum.
              </p>

              <h2 id="who-qualifies">Who qualifies?</h2>
              <p>
                VA loan eligibility is based on your military service history. You generally qualify if you are one of the following:
              </p>
              <ul>
                <li>A veteran who served a minimum period on active duty (usually 90 days during wartime or 181 days during peacetime)</li>
                <li>An active-duty service member who has served at least 90 continuous days</li>
                <li>A member of the National Guard or Reserves with at least 6 years of service, or 90 days of active duty under certain orders</li>
                <li>The surviving spouse of a service member who died in the line of duty or from a service-connected disability</li>
              </ul>
              <p>
                To use your VA loan benefit, you need a <strong>Certificate of Eligibility (COE)</strong>. Think of the COE as your proof of eligibility — it tells the lender that the VA has confirmed you qualify. Most lenders can pull your COE electronically in minutes through the VA's system. You can also request it yourself at VA.gov or through your local VA office.
              </p>
              <p>
                Having a COE does not guarantee loan approval — you still need to meet the lender's income, credit, and property requirements. But it is the starting point for any VA loan.
              </p>

              <h2 id="key-benefits">Key benefits</h2>

              <h3>No down payment required</h3>
              <p>
                This is the headline benefit. You can buy a home with zero dollars down up to the conforming loan limit in your area (in most counties, $806,500 in 2025). You can borrow above that limit with a small down payment. Saving a down payment is one of the biggest barriers to homeownership for most people — VA loans eliminate it entirely.
              </p>

              <h3>No private mortgage insurance (PMI)</h3>
              <p>
                On conventional loans, if you put down less than 20%, you pay PMI — private mortgage insurance. On FHA loans, you always pay MIP. VA loans have neither. This alone can save most borrowers $100–$250 per month, every month, for the entire time they have the loan.
              </p>

              <h3>Competitive interest rates</h3>
              <p>
                Because the VA guarantees a portion of every loan, lenders take on less risk. They typically pass that savings along as lower interest rates. VA rates are consistently among the lowest available for any mortgage product, often 0.25–0.50% lower than comparable conventional rates.
              </p>

              <h3>Flexible credit requirements</h3>
              <p>
                The VA does not set a minimum credit score, though individual lenders typically require 580–620. More importantly, VA loans are often more forgiving of past credit issues than conventional loans, as long as you have demonstrated a pattern of responsible financial behavior recently.
              </p>

              <h3>Limits on closing costs</h3>
              <p>
                The VA restricts the types of fees lenders can charge to VA borrowers. Sellers can also pay all of the buyer's VA-related closing costs. This means a VA buyer can sometimes close on a home with very little money out of pocket.
              </p>

              <h2 id="residual-income">What is residual income?</h2>
              <p>
                Residual income is a VA-specific qualifying standard that most other loan programs do not use. It measures how much money you have left over each month after paying your major bills — including your new mortgage payment, other debts, taxes, and estimated living expenses based on your family size and where you live.
              </p>
              <p>
                The VA sets minimum residual income thresholds by region and family size. For example, a family of four in the South might need to show at least $1,003 per month in residual income. A family of four in the Northeast might need $1,117. These numbers are designed to ensure you will genuinely be able to afford the home you are buying.
              </p>
              <p>
                This is actually a borrower-friendly feature. It is designed to prevent you from getting into a mortgage that stretches you too thin. In practice, most borrowers who meet standard income and debt requirements will also meet the residual income standard — but it is worth knowing about because lenders will always check it.
              </p>

              <h2 id="funding-fee">VA Funding Fee</h2>
              <p>
                The VA Funding Fee is a one-time fee charged on most VA loans. It helps keep the VA loan program running without requiring taxpayer funding. Think of it as the cost of the VA guarantee — it is how the program sustains itself so that future veterans can also use it.
              </p>
              <p>
                The fee is a percentage of the loan amount and varies based on your down payment and whether this is your first time using your VA benefit. For a first-time VA buyer with no down payment, the fee is 2.15% of the loan amount. On a $300,000 loan, that is $6,450. The fee decreases if you make a down payment of 5% or more. If you use your VA benefit again on a future home, the fee rises to 3.3%.
              </p>
              <p>
                Importantly, the funding fee can be <strong>rolled into your loan balance</strong> — you do not need to bring cash to closing to cover it. This keeps the upfront cost at zero for most VA buyers.
              </p>
              <p>
                Some veterans are <strong>exempt from the funding fee entirely</strong>: those receiving VA disability compensation, surviving spouses of veterans who died in service or from a service-connected disability, and certain other categories. Ask your lender or the VA to confirm your status.
              </p>

              <h2 id="what-this-means">What this means for you</h2>
              <p>
                If you have served and you qualify, a VA loan should almost always be your first choice for a home purchase. The combination of no down payment, no PMI, and competitive rates means your monthly payment will be lower and your out-of-pocket cost at closing will be dramatically reduced compared to other loan types.
              </p>
              <p>
                The only scenario where another loan type might make more sense is if you have substantial savings for a down payment (20% or more) and an excellent credit score. In that case, a conventional loan might offer a very similar rate without the funding fee. But for the majority of eligible veterans, especially first-time buyers, the VA loan wins.
              </p>

              <h2 id="why-it-matters">Why it matters</h2>
              <p>
                Understanding the VA funding fee and residual income requirements up front will help you avoid surprises in the lending process. Many veterans are pleasantly surprised when they learn what they qualify for. Others are caught off guard by the funding fee if a lender does not explain it clearly.
              </p>
              <p>
                Also: your VA home loan benefit does not expire. You can use it more than once, and you can have your entitlement (your borrowing capacity) restored after you sell a home and pay off a previous VA loan. This makes it a lifetime benefit worth understanding thoroughly.
              </p>

              <h2 id="example">Simple example scenario</h2>
              <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl p-6 my-6">
                <p className="font-semibold text-[#1e2533] mb-2">Meet James</p>
                <p>
                  James is a Marine Corps veteran with a credit score of 660. He has $8,000 in savings and is looking at a home priced at $320,000.
                </p>
                <ul>
                  <li><strong>Down payment needed:</strong> $0 — James uses his VA benefit</li>
                  <li><strong>Loan amount:</strong> $320,000</li>
                  <li><strong>VA Funding Fee (2.15%):</strong> $6,880 rolled into the loan → total loan $326,880</li>
                  <li><strong>Monthly PMI:</strong> $0 — VA loans have no PMI</li>
                  <li><strong>Savings used at closing:</strong> Minimal — just prepaid taxes, insurance, and some title fees</li>
                </ul>
                <p>
                  James keeps most of his $8,000 in savings as an emergency fund. His monthly payment is lower than it would have been with an FHA loan because he has no mortgage insurance at all. Over 30 years, the absence of PMI saves him tens of thousands of dollars.
                </p>
              </div>
            </div>

            {/* Calculator CTA */}
            <div className="mt-10 bg-white border border-[#e5e7eb] rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="text-3xl">🧮</div>
              <div className="flex-1">
                <p className="font-semibold text-[#1e2533]">VA Residual Income Calculator</p>
                <p className="text-sm text-[#4b5563]">See if your income meets the VA's residual income requirement for your family size and region.</p>
              </div>
              <Link
                href="/calculators/va-residual-income"
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
