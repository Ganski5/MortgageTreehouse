'use client';

import { useState } from 'react';

const faqs = [
  {
    question: 'What credit score do I need to buy a home?',
    answer:
      'It depends on the loan type. For a conventional loan, most lenders want to see a credit score of at least 620, though you\'ll get better rates with a 740 or higher. FHA loans are more flexible — you can qualify with a score as low as 580 with a 3.5% down payment, or even 500 with a 10% down payment. VA loans don\'t have an official minimum score set by the VA, but most lenders require at least 580–620. The bottom line: a higher credit score opens more doors and lowers your interest rate. If your score needs work, it\'s worth spending a few months paying down debt and correcting any errors before applying.',
  },
  {
    question: 'How much do I need for a down payment?',
    answer:
      'Less than most people think. VA loans offer 0% down for eligible veterans and service members — that\'s zero down with no private mortgage insurance. USDA loans also offer 0% down for qualifying rural properties. FHA loans require just 3.5% down if your credit score is 580 or higher. Conventional loans can go as low as 3% down through certain programs, though you\'ll pay PMI until you reach 20% equity. The "you need 20% down" rule is a myth — it\'s just the threshold to avoid PMI on a conventional loan. That said, a larger down payment does reduce your monthly payment, your loan balance, and the total interest you\'ll pay over time.',
  },
  {
    question: 'What is PMI?',
    answer:
      'PMI stands for Private Mortgage Insurance. It\'s a monthly premium you pay when you put less than 20% down on a conventional loan. It protects the lender — not you — in case you default. PMI typically costs between 0.5% and 1.5% of your loan amount per year, which gets divided into monthly payments. On a $300,000 loan, that could mean an extra $125–$375 per month. The good news: PMI isn\'t permanent. Once your loan balance drops to 80% of the home\'s original appraised value, you can request cancellation. By law, your lender must automatically cancel PMI when your balance reaches 78%. FHA loans have their own version called MIP (Mortgage Insurance Premium), which works differently and may not go away — another reason some borrowers prefer conventional loans once they have enough equity.',
  },
  {
    question: 'What is the difference between pre-qualification and pre-approval?',
    answer:
      'Pre-qualification is a quick, informal estimate based on information you self-report — your income, assets, and debts. No documents are verified, and no credit pull is required. It\'s a useful starting point to understand a rough budget, but sellers won\'t take it seriously on its own. Pre-approval is a deeper, more meaningful step. The lender actually verifies your income, employment, and assets — and pulls your credit. A pre-approval letter tells sellers you\'re a serious buyer who has already been screened. In a competitive market, a strong pre-approval can be the difference between winning and losing a bid. Some lenders offer what\'s called a "fully underwritten pre-approval," which goes even further and is essentially a loan commitment contingent only on the property appraisal.',
  },
  {
    question: 'What is DTI and why does it matter?',
    answer:
      'DTI stands for Debt-to-Income ratio. It\'s one of the most important numbers in mortgage underwriting. Your DTI is calculated by dividing your total monthly debt payments by your gross monthly income. For example, if you earn $6,000 per month and pay $500 in student loans, $300 in car payments, and will have a $1,400 mortgage payment, your DTI is ($500 + $300 + $1,400) / $6,000 = 36.7%. Lenders use DTI to assess whether you can realistically afford the loan. Most conventional loans want a DTI below 43–45%. FHA loans can sometimes go up to 50% with compensating factors. VA loans are flexible but look for a residual income calculation in addition to DTI. Lowering your DTI — by paying off debt or increasing income — directly improves your borrowing power.',
  },
  {
    question: 'How does escrow work?',
    answer:
      'Escrow appears in two different contexts in a home purchase. First, the escrow account during your purchase holds your earnest money deposit (and sometimes other funds) while the deal is being finalized — it\'s a neutral third party protecting both buyer and seller. Second — and this is the one that affects your ongoing payment — most mortgages include an escrow impound account managed by your lender. Each month, a portion of your mortgage payment goes into this account to cover property taxes and homeowners insurance. When those bills come due, your lender pays them directly. This protects the lender from having an uninsured or tax-delinquent property as collateral, and it protects you from a surprise $6,000 tax bill you forgot to save for. Your lender will send you an annual escrow analysis to ensure the account is collecting the right amount.',
  },
  {
    question: 'What are closing costs?',
    answer:
      'Closing costs are the fees and expenses due at the end of your home purchase, separate from your down payment. They typically range from 2% to 5% of the loan amount and include: loan origination fees, appraisal fee, title search and title insurance, attorney fees (in some states), recording fees, prepaid interest, and setting up your escrow account with the first few months of taxes and insurance. On a $300,000 loan, you might pay $6,000–$15,000 in closing costs. Your lender is required to give you a Loan Estimate within three business days of applying, which itemizes these costs. You can sometimes negotiate with the seller to cover a portion of closing costs — this is called a "seller concession" — or roll some costs into the loan depending on the loan type and lender.',
  },
  {
    question: 'How do I choose between FHA and conventional?',
    answer:
      'It comes down to your credit score, down payment size, and how long you plan to keep the loan. FHA is often better if your credit score is below 680 or your down payment is below 5% — the mortgage insurance rates can be more competitive. But FHA has a significant downside: MIP (Mortgage Insurance Premium) usually lasts the life of the loan unless you refinance, and you\'re required to pay both an upfront MIP (1.75% of the loan amount) and monthly MIP. Conventional loans with PMI, on the other hand, let you cancel PMI once you hit 20% equity. If your credit is strong (720+) and you can put down at least 5–10%, conventional is often the better long-term choice because the PMI goes away. The smartest move: ask your lender to run both scenarios side by side so you can compare the total costs over your expected time in the home.',
  },
];

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="divide-y divide-[#e5e7eb]">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={index}>
            <button
              onClick={() => toggle(index)}
              aria-expanded={isOpen}
              className="w-full text-left flex items-start justify-between gap-4 py-5 px-1 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2d6a4f] focus-visible:ring-offset-2 rounded"
            >
              <span
                className={`text-base font-semibold leading-snug transition-colors ${
                  isOpen ? 'text-[#2d6a4f]' : 'text-[#1e2533] group-hover:text-[#2d6a4f]'
                }`}
              >
                {faq.question}
              </span>
              <span
                className={`flex-shrink-0 mt-0.5 w-6 h-6 flex items-center justify-center rounded-full transition-all duration-200 ${
                  isOpen
                    ? 'bg-[#2d6a4f] text-white'
                    : 'bg-[#e5e7eb] text-[#6b7280] group-hover:bg-[#d1fae5] group-hover:text-[#2d6a4f]'
                }`}
                aria-hidden="true"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease',
                  }}
                >
                  <path
                    d="M2 4L6 8L10 4"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </button>
            <div
              style={{
                overflow: 'hidden',
                maxHeight: isOpen ? '600px' : '0',
                transition: 'max-height 0.3s ease',
              }}
            >
              <p className="text-[#4b5563] leading-relaxed text-sm sm:text-base pb-5 px-1">
                {faq.answer}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
