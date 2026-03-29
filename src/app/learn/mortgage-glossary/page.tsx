"use client";

import Link from "next/link";
import { useState, useMemo } from "react";

const glossaryTerms: { term: string; definition: string }[] = [
  {
    term: "APR (Annual Percentage Rate)",
    definition:
      "APR is the true annual cost of your loan expressed as a percentage. It includes both the interest rate and most of the fees and costs of getting the loan (like origination fees and mortgage insurance). Because it bundles in those costs, APR is almost always higher than the stated interest rate — and it is the number you should compare when shopping lenders.",
  },
  {
    term: "Amortization",
    definition:
      "Amortization is the process of paying off a loan through regular scheduled payments over time. Each monthly payment covers some interest and some principal (the original loan balance). In the early years of a mortgage, most of each payment goes toward interest. As time goes on, more of each payment goes toward principal — until the loan is fully paid off at the end of the term.",
  },
  {
    term: "Appraisal",
    definition:
      "An appraisal is an independent estimate of a home's market value, performed by a licensed appraiser. Lenders require an appraisal before approving a mortgage to confirm the home is worth at least as much as the loan amount. The appraiser visits the property, compares it to recent similar home sales in the area, and issues a written report.",
  },
  {
    term: "ARM (Adjustable-Rate Mortgage)",
    definition:
      "An ARM is a mortgage where the interest rate is fixed for an initial period (commonly 5, 7, or 10 years) and then adjusts periodically based on a market index. For example, a 5/1 ARM has a fixed rate for 5 years, then adjusts every 1 year after that. ARMs can offer lower initial rates than fixed-rate mortgages, but your payment can change — up or down — after the fixed period ends.",
  },
  {
    term: "Closing Costs",
    definition:
      "Closing costs are the fees and expenses you pay when a home purchase or refinance is finalized. They typically run 2–5% of the loan amount and include charges like lender origination fees, title insurance, appraisal, prepaid property taxes, and homeowners insurance. Some costs are negotiable or paid by the seller.",
  },
  {
    term: "COE (Certificate of Eligibility)",
    definition:
      "A COE is the document the VA provides to confirm that a veteran, service member, or surviving spouse meets the service requirements to use a VA home loan. Lenders need to see a COE before approving a VA loan. Most lenders can request the COE electronically in minutes through the VA's system, or borrowers can request it directly at VA.gov.",
  },
  {
    term: "Conforming Loan",
    definition:
      "A conforming loan is a conventional mortgage that meets the size and underwriting guidelines set by Fannie Mae and Freddie Mac. In 2025, the conforming loan limit is $806,500 for a single-family home in most U.S. counties. Conforming loans typically offer lower rates because lenders can sell them to Fannie or Freddie, which reduces the lender's risk.",
  },
  {
    term: "Credit Score",
    definition:
      "A credit score is a three-digit number (typically ranging from 300 to 850) that summarizes your credit history. Lenders use it to gauge how likely you are to repay a loan. The most common scoring model is the FICO score. Higher scores mean lower risk to the lender, which usually translates to better interest rates and easier approval. For mortgages, scores above 740 unlock the best conventional pricing.",
  },
  {
    term: "DTI (Debt-to-Income Ratio)",
    definition:
      "DTI is the percentage of your gross monthly income (before taxes) that goes toward debt payments. Lenders calculate it by adding up your monthly debt obligations — including the new mortgage payment, car loans, student loans, credit cards — and dividing by your gross monthly income. A DTI of 43% or below is typical for most loan programs; lower is better.",
  },
  {
    term: "Down Payment",
    definition:
      "The down payment is the amount of money you pay upfront toward the purchase price of a home. It is the difference between the purchase price and the loan amount. A larger down payment means a smaller loan, lower monthly payments, and potentially no mortgage insurance. Common minimums: 3.5% for FHA, 0% for VA, and 3–5% for conventional loans.",
  },
  {
    term: "Escrow",
    definition:
      "Escrow has two meanings in mortgages. At closing, an escrow account is a neutral third-party account that holds funds — like your down payment — until the transaction is complete. After closing, your servicer often maintains an escrow account where part of each monthly payment is held to pay your property taxes and homeowners insurance when they come due.",
  },
  {
    term: "FHA Loan",
    definition:
      "An FHA loan is a mortgage insured by the Federal Housing Administration. Because the government backs it, lenders can offer it to borrowers with lower credit scores and smaller down payments — as low as 3.5% with a 580 credit score. All FHA loans require mortgage insurance (MIP), which is an added monthly cost. FHA loans are popular with first-time buyers.",
  },
  {
    term: "Fixed Rate",
    definition:
      "A fixed-rate mortgage has an interest rate that stays the same for the entire loan term — typically 15 or 30 years. This means your principal and interest payment never changes, making budgeting predictable. Fixed rates are higher than the initial rates on adjustable-rate mortgages, but you are protected from rate increases over time.",
  },
  {
    term: "Funding Fee (VA)",
    definition:
      "The VA Funding Fee is a one-time fee charged on most VA loans to help fund the VA home loan program. It is a percentage of the loan amount — 2.15% for first-time VA buyers with no down payment in 2025 — and can be rolled into the loan balance. Veterans receiving VA disability compensation are typically exempt from this fee.",
  },
  {
    term: "HUD (Department of Housing and Urban Development)",
    definition:
      "HUD is the U.S. federal agency responsible for national housing policies and programs. It oversees the FHA loan program, housing vouchers, fair housing enforcement, and more. When lenders talk about FHA guidelines, those guidelines come from HUD. HUD's mission is to help more Americans achieve safe, affordable housing.",
  },
  {
    term: "Interest Rate",
    definition:
      "The interest rate is the annual cost of borrowing the loan principal, expressed as a percentage. It determines how much you pay the lender for the use of their money. It does not include fees, which is why APR (which does include fees) is the more complete number for comparisons. Even a small difference in interest rate — say 0.25% — can add up to tens of thousands of dollars over a 30-year loan.",
  },
  {
    term: "Jumbo Loan",
    definition:
      "A jumbo loan is a conventional mortgage that exceeds the conforming loan limit set by Fannie Mae and Freddie Mac ($806,500 in most counties in 2025). Because jumbo loans cannot be sold to Fannie or Freddie, lenders take on more risk and typically require higher credit scores (often 700+), larger down payments, and more cash reserves.",
  },
  {
    term: "LTV (Loan-to-Value Ratio)",
    definition:
      "LTV is the ratio of your loan amount to the appraised value of the home, expressed as a percentage. If you borrow $270,000 to buy a $300,000 home, your LTV is 90%. LTV matters because it affects your interest rate, whether you need mortgage insurance, and whether you qualify for certain programs. An LTV of 80% (20% equity) is often the threshold that eliminates PMI on conventional loans.",
  },
  {
    term: "MIP (Mortgage Insurance Premium)",
    definition:
      "MIP is the mortgage insurance required on all FHA loans. It comes in two parts: an upfront MIP of 1.75% of the loan amount (usually rolled into the loan), and an annual MIP paid monthly (typically around 0.55% per year). Unlike PMI on conventional loans, MIP does not automatically cancel at 20% equity — it stays for the life of the loan if you put down less than 10%.",
  },
  {
    term: "Mortgage Insurance",
    definition:
      "Mortgage insurance is a policy that protects the lender if a borrower stops making payments. It is required when a borrower puts down less than 20%. On FHA loans it is called MIP; on conventional loans it is called PMI. Despite the name, mortgage insurance does not protect you — it protects the lender. You pay for it, but the lender collects if you default.",
  },
  {
    term: "PMI (Private Mortgage Insurance)",
    definition:
      "PMI is the mortgage insurance required on conventional loans when the down payment is less than 20%. It typically costs 0.5–1.5% of the loan amount per year, added to your monthly payment. Unlike FHA's MIP, PMI is automatically canceled once your loan balance drops to 80% of the home's original value — or you can request removal when you reach 20% equity.",
  },
  {
    term: "Points",
    definition:
      "Points (also called discount points) are upfront fees you pay at closing to buy down your interest rate. One point equals 1% of your loan amount. Paying one point on a $300,000 loan costs $3,000 at closing but permanently lowers your interest rate — often by 0.25%. Points make sense if you plan to stay in the home long enough that the monthly savings outweigh the upfront cost.",
  },
  {
    term: "Principal",
    definition:
      "The principal is the original amount of money you borrowed — the loan balance before interest. When you make mortgage payments, a portion pays interest and the rest reduces the principal. As your principal balance decreases over time, you build equity in your home. On amortizing loans, the portion of each payment going to principal grows larger with each passing month.",
  },
  {
    term: "Rate Lock",
    definition:
      "A rate lock is an agreement with your lender that guarantees a specific interest rate for a set period — typically 30, 45, or 60 days — while your loan is being processed. This protects you from rising rates during the time between your loan application and closing. If rates drop during the lock period, you generally cannot automatically get the lower rate unless your lock includes a float-down option.",
  },
  {
    term: "Refinance",
    definition:
      "Refinancing means replacing your existing mortgage with a new one — typically to get a lower interest rate, reduce your monthly payment, change your loan term, or take cash out of your equity. You go through a new loan application and closing process. Refinancing usually makes sense when the new rate is meaningfully lower than your current rate and you plan to stay in the home long enough to recoup the closing costs.",
  },
  {
    term: "Residual Income",
    definition:
      "Residual income is the money you have left each month after paying all your major monthly obligations — mortgage, debts, taxes, and estimated living expenses. The VA uses residual income as a key qualifying criterion for VA loans. The VA sets minimum residual income thresholds by family size and region. It is designed to ensure borrowers genuinely have enough money left over to live comfortably.",
  },
  {
    term: "Title Insurance",
    definition:
      "Title insurance protects against problems with a property's ownership history (called the title). Before closing, a title company researches public records to confirm the seller legally owns the home and there are no outstanding liens, unpaid taxes, or ownership disputes. If a problem surfaces later, title insurance covers the cost of defending your ownership and resolving the issue. There are two types: lender's title insurance (required) and owner's title insurance (optional but recommended).",
  },
  {
    term: "UFMIP (Upfront Mortgage Insurance Premium)",
    definition:
      "UFMIP is the one-time, upfront portion of the mortgage insurance premium charged on FHA loans. It is 1.75% of the base loan amount and is usually rolled into the loan balance (not paid out of pocket at closing). For example, on a $270,000 FHA loan, the UFMIP would be $4,725. It is separate from the ongoing annual MIP, which is added to your monthly payment.",
  },
  {
    term: "Underwriting",
    definition:
      "Underwriting is the process a lender uses to evaluate the risk of giving you a mortgage. An underwriter reviews your income, employment history, credit report, assets, the property appraisal, and other documents to decide whether to approve, suspend, or deny your loan. Most borrowers never interact directly with the underwriter — they work through the loan officer — but underwriting is the most critical step in the mortgage approval process.",
  },
  {
    term: "VA Loan",
    definition:
      "A VA loan is a mortgage guaranteed by the U.S. Department of Veterans Affairs. It is available to eligible veterans, active-duty service members, and surviving spouses. VA loans offer major benefits: no down payment required, no private mortgage insurance, and competitive interest rates. A one-time VA Funding Fee applies to most borrowers, but veterans with a service-connected disability rating are typically exempt.",
  },
];

const relatedTopics = [
  { href: "/learn/fha-basics", label: "FHA Loans Explained" },
  { href: "/learn/va-basics", label: "VA Loans Explained" },
  { href: "/learn/conventional-basics", label: "Conventional Loans Explained" },
  { href: "/learn/refinance-guides", label: "Refinance Guides" },
];

export default function MortgageGlossaryPage() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return glossaryTerms;
    return glossaryTerms.filter(
      (t) =>
        t.term.toLowerCase().includes(q) ||
        t.definition.toLowerCase().includes(q)
    );
  }, [query]);

  const letters = useMemo(() => {
    return Array.from(
      new Set(filtered.map((t) => t.term[0].toUpperCase()))
    ).sort();
  }, [filtered]);

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
            <span className="text-[#1e2533]">Mortgage Glossary</span>
          </nav>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Page header */}
        <div className="mb-8">
          <span className="inline-block bg-[#edf7f1] text-[#2d6a4f] text-xs font-semibold px-3 py-1 rounded-full mb-3">
            Reference
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#2d6a4f] mb-3">
            Mortgage Glossary
          </h1>
          <p className="text-[#4b5563] text-lg leading-relaxed">
            Every mortgage term explained in plain English. Search below or scroll through the full A-Z list.
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9ca3af] text-lg pointer-events-none">
              🔍
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search terms, e.g. PMI, DTI, escrow..."
              className="w-full pl-11 pr-4 py-3.5 bg-white border border-[#e5e7eb] rounded-xl text-[#1e2533] placeholder-[#9ca3af] focus:outline-none focus:border-[#2d6a4f] focus:ring-2 focus:ring-[#2d6a4f]/20 text-sm transition-all"
            />
          </div>
          {query && (
            <p className="mt-2 text-sm text-[#9ca3af]">
              {filtered.length === 0
                ? "No terms match your search."
                : `Showing ${filtered.length} term${filtered.length === 1 ? "" : "s"} matching "${query}"`}
            </p>
          )}
        </div>

        {/* Letter anchors */}
        {!query && (
          <div className="flex flex-wrap gap-2 mb-8">
            {letters.map((letter) => (
              <a
                key={letter}
                href={`#letter-${letter}`}
                className="w-8 h-8 flex items-center justify-center bg-white border border-[#e5e7eb] rounded-lg text-sm font-semibold text-[#4b5563] hover:bg-[#2d6a4f] hover:text-white hover:border-[#2d6a4f] transition-all"
              >
                {letter}
              </a>
            ))}
          </div>
        )}

        {/* Terms list */}
        <div className="space-y-2">
          {filtered.length === 0 ? (
            <div className="bg-white border border-[#e5e7eb] rounded-2xl p-10 text-center">
              <p className="text-[#9ca3af] text-sm">No terms found. Try a different search.</p>
            </div>
          ) : (
            (() => {
              const groups: Record<string, typeof filtered> = {};
              filtered.forEach((t) => {
                const l = t.term[0].toUpperCase();
                if (!groups[l]) groups[l] = [];
                groups[l].push(t);
              });
              return Object.entries(groups)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([letter, terms]) => (
                  <div key={letter}>
                    {!query && (
                      <div
                        id={`letter-${letter}`}
                        className="flex items-center gap-3 mb-4 mt-8 first:mt-0 scroll-mt-6"
                      >
                        <span className="text-2xl font-bold text-[#2d6a4f]">{letter}</span>
                        <div className="flex-1 h-px bg-[#e5e7eb]" />
                      </div>
                    )}
                    {terms.map((item) => (
                      <div
                        key={item.term}
                        className="bg-white border border-[#e5e7eb] rounded-xl p-5 mb-3 hover:border-[#2d6a4f]/30 transition-colors"
                      >
                        <p className="font-bold text-[#1e2533] mb-1">{item.term}</p>
                        <p className="text-sm text-[#4b5563] leading-relaxed">{item.definition}</p>
                      </div>
                    ))}
                  </div>
                ));
            })()
          )}
        </div>

        {/* Related Topics */}
        <div className="mt-12 pt-8 border-t border-[#e5e7eb]">
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
    </div>
  );
}
