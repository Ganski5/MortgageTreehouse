import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Conventional Loans Explained",
  description:
    "Learn what a conventional loan is, how conforming and jumbo loans differ, when you need to pay PMI, and what credit scores lenders are looking for.",
};

const toc = [
  { id: "what-is-conventional", label: "What is a conventional loan?" },
  { id: "conforming-vs-jumbo", label: "Conforming vs jumbo" },
  { id: "down-payment", label: "Down payment requirements" },
  { id: "pmi", label: "What is PMI?" },
  { id: "credit-score", label: "Credit score requirements" },
  { id: "fannie-freddie", label: "Fannie Mae & Freddie Mac" },
  { id: "what-this-means", label: "What this means for you" },
  { id: "why-it-matters", label: "Why it matters" },
];

const relatedTopics = [
  { href: "/learn/fha-basics", label: "FHA Loans Explained" },
  { href: "/learn/va-basics", label: "VA Loans Explained" },
  { href: "/learn/refinance-guides", label: "Refinance Guides" },
  { href: "/learn/mortgage-glossary", label: "Mortgage Glossary" },
];

export default function ConventionalBasicsPage() {
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
            <span className="text-[#1e2533]">Conventional Basics</span>
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
                Conventional Loans
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold text-[#2d6a4f] mb-3">
                Conventional Loans Explained
              </h1>
              <p className="text-[#4b5563] text-lg leading-relaxed">
                Conventional loans are the most common type of mortgage in America. Here is a plain-English guide to how they work, what they cost, and who they are best suited for.
              </p>
            </div>

            {/* Key Takeaways */}
            <div className="bg-[#edf7f1] border border-[#d3eddf] rounded-2xl p-6 mb-10">
              <h2 className="text-base font-bold text-[#2d6a4f] mb-3">Key Takeaways</h2>
              <ul className="space-y-2">
                {[
                  "Conventional loans are not backed by the government — they follow guidelines set by Fannie Mae and Freddie Mac.",
                  "You can put down as little as 3%, though 20% lets you avoid private mortgage insurance (PMI).",
                  "Most lenders require a credit score of at least 620, but higher scores get significantly better rates.",
                  "PMI is automatically removed when your loan balance drops to 80% of the home's value.",
                  "Loans above $806,500 (in 2025) in most counties are called jumbo loans and have stricter requirements.",
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
              <h2 id="what-is-conventional">What is a conventional loan?</h2>
              <p>
                A conventional loan is any mortgage that is not backed or insured by a government agency. Unlike FHA loans (backed by the Federal Housing Administration) or VA loans (guaranteed by the Department of Veterans Affairs), conventional loans are funded and guaranteed entirely by private lenders and investors.
              </p>
              <p>
                Because there is no government guarantee protecting the lender, lenders typically set stricter requirements for conventional loans — particularly around credit scores and down payments. In return, borrowers with strong financial profiles often get better rates and more flexibility with loan amounts, property types, and the removal of mortgage insurance.
              </p>
              <p>
                Conventional loans are the most widely used mortgage type in the country. According to the Urban Institute, they account for the majority of all home purchase mortgages. If you have a solid credit history and a down payment saved, a conventional loan is worth comparing carefully against FHA.
              </p>

              <h2 id="conforming-vs-jumbo">Conforming vs jumbo loans</h2>
              <p>
                Not all conventional loans are treated the same. There is an important dividing line called the <strong>conforming loan limit</strong>. This is the maximum loan amount that can be purchased by Fannie Mae or Freddie Mac — the two government-sponsored companies that buy most U.S. mortgages from lenders. In 2025, the conforming loan limit is <strong>$806,500</strong> for a single-family home in most counties (higher in designated high-cost areas).
              </p>
              <p>
                A <strong>conforming loan</strong> is a conventional loan that stays at or below this limit. Because it can be sold to Fannie or Freddie, lenders can offer it at lower interest rates and with more flexible underwriting guidelines. Most homebuyers take conforming conventional loans.
              </p>
              <p>
                A <strong>jumbo loan</strong> is a conventional loan that exceeds the conforming limit. Because Fannie and Freddie will not buy it, the lender has to hold it on their own books or find a private investor. This means jumbo loans usually require:
              </p>
              <ul>
                <li>A higher credit score (often 700 or above)</li>
                <li>A larger down payment (often 10–20%)</li>
                <li>More cash reserves after closing</li>
                <li>A lower debt-to-income ratio</li>
              </ul>
              <p>
                Jumbo rates can be higher or lower than conforming rates depending on market conditions, but the qualification bar is clearly higher.
              </p>

              <h2 id="down-payment">Down payment requirements</h2>
              <p>
                The minimum down payment on a conventional loan is <strong>3%</strong> for some first-time buyers (through programs like Fannie Mae's HomeReady or Freddie Mac's Home Possible). Most other conventional borrowers need at least <strong>5%</strong>. Higher down payments unlock lower rates and, most importantly, eliminate or reduce mortgage insurance.
              </p>
              <div className="overflow-x-auto my-6">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-[#2d6a4f] text-white">
                      <th className="text-left px-4 py-3 rounded-tl-lg font-semibold">Down Payment</th>
                      <th className="text-left px-4 py-3 font-semibold">PMI Required?</th>
                      <th className="text-left px-4 py-3 rounded-tr-lg font-semibold">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["3%", "Yes", "HomeReady / Home Possible programs only"],
                      ["5–9%", "Yes", "Standard minimum for most borrowers"],
                      ["10–19%", "Yes", "PMI rate decreases as down payment increases"],
                      ["20% or more", "No", "No PMI required — best monthly payment"],
                    ].map(([dp, pmi, notes], i) => (
                      <tr key={dp} className={i % 2 === 0 ? "bg-white" : "bg-[#f9f8f6]"}>
                        <td className="px-4 py-3 font-medium text-[#1e2533] border-b border-[#e5e7eb]">{dp}</td>
                        <td className="px-4 py-3 text-[#4b5563] border-b border-[#e5e7eb]">{pmi}</td>
                        <td className="px-4 py-3 text-[#4b5563] border-b border-[#e5e7eb]">{notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h2 id="pmi">What is PMI?</h2>
              <p>
                <strong>Private Mortgage Insurance (PMI)</strong> is an insurance policy that protects the lender (not you) if you stop making payments. It is required on conventional loans whenever your down payment is less than 20% of the home's purchase price.
              </p>
              <p>
                PMI typically costs between 0.5% and 1.5% of your loan amount per year, depending on your credit score and loan-to-value ratio (<strong>LTV</strong> — the percentage of the home's value you are borrowing). On a $300,000 loan, PMI might run $125–$375 per month. It shows up as a separate line on your monthly mortgage statement.
              </p>
              <p>
                The good news about PMI on conventional loans: it is <strong>automatically removed</strong> once your loan balance reaches 80% of the home's original value. You can also request removal once you reach 20% equity through payments or home appreciation (you may need a new appraisal). This is a key advantage over FHA loans, where MIP can last the entire 30-year term if you put less than 10% down.
              </p>

              <h2 id="credit-score">Credit score requirements</h2>
              <p>
                Most conventional lenders require a minimum credit score of <strong>620</strong>. However, a score of 620 is the floor — not the ideal. The interest rate you receive on a conventional loan is heavily influenced by your credit score. The higher your score, the lower your rate.
              </p>
              <p>
                Lenders use tiered pricing called <strong>loan-level price adjustments (LLPAs)</strong> — a Fannie/Freddie system that adds small fees to your rate based on your credit score and loan-to-value ratio. A borrower with a 760 score and 20% down will get noticeably better pricing than a borrower with a 640 score and 5% down, even from the same lender.
              </p>
              <p>
                As a rough guide: scores above 740 unlock the best conventional rates. Scores 700–739 are solid. Scores 660–699 are workable. Below 660, FHA often becomes more competitive than conventional. Below 620, conventional is generally not available.
              </p>

              <h2 id="fannie-freddie">Fannie Mae and Freddie Mac basics</h2>
              <p>
                Fannie Mae (Federal National Mortgage Association) and Freddie Mac (Federal Home Loan Mortgage Corporation) are two government-sponsored enterprises (GSEs) that exist to make mortgage credit available across the country. They do not lend money directly to homebuyers. Instead, they buy mortgages from banks and lenders, package them into investments, and sell them to investors worldwide.
              </p>
              <p>
                This system allows the bank that gave you your mortgage to free up capital to lend to the next borrower. Without Fannie and Freddie, most banks would run out of money to lend fairly quickly. The downside is that to sell a loan to Fannie or Freddie, the lender must follow their underwriting guidelines — which sets the rules for what qualifies as a conforming conventional loan.
              </p>
              <p>
                When lenders talk about "conventional guidelines," they almost always mean Fannie and Freddie guidelines. Understanding this helps you understand why lenders are so particular about documentation, income calculations, and property conditions on conventional loans.
              </p>

              <h2 id="what-this-means">What this means for you</h2>
              <p>
                If your credit score is 680 or above and you have at least 5–10% for a down payment, a conventional loan is worth strong consideration. You will likely get a competitive rate, and if you can put down 20%, you will have no mortgage insurance at all — which keeps your monthly payment lean.
              </p>
              <p>
                If your credit score is below 660 or your down payment is under 5%, run the numbers on FHA as well. In many situations, FHA will offer a better rate for lower-credit borrowers, and the slightly higher mortgage insurance cost can be outweighed by the rate savings. The best approach is to get quotes for both and compare the total monthly cost and total loan cost.
              </p>

              <h2 id="why-it-matters">Why it matters</h2>
              <p>
                Understanding how PMI works — and specifically when it goes away — is the most important piece of knowledge for conventional loan borrowers. Many buyers assume mortgage insurance is permanent; it is not on conventional loans. Once you reach 20% equity (whether through paying down the loan, home appreciation, or both), you can eliminate that cost entirely.
              </p>
              <p>
                Knowing the conforming loan limit also matters if you are buying in a higher-cost area. If your loan will be above the limit, you should expect stricter qualifying standards and potentially a higher rate. Planning your purchase price or down payment around the conforming limit can sometimes make a meaningful difference in your rate and terms.
              </p>
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
