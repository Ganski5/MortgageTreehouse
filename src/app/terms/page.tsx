import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Mortgage Treehouse terms of use — your rights and responsibilities when using this site.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <section style={{ background: "linear-gradient(135deg, #edf7f1 0%, #f9f8f6 60%)" }} className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <nav className="flex items-center gap-2 text-sm mb-5" style={{ color: "#9ca3af" }}>
            <Link href="/" className="hover:text-[#2d6a4f] transition-colors">Home</Link>
            <span>/</span>
            <span style={{ color: "#2d6a4f" }} className="font-medium">Terms of Use</span>
          </nav>
          <h1 className="text-3xl font-bold mb-2" style={{ color: "#1e2533" }}>Terms of Use</h1>
          <p className="text-sm" style={{ color: "#6b7280" }}>Last updated: March 1, 2026</p>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">

          {/* Prominent mortgage disclaimer */}
          <div
            className="rounded-2xl p-5 mb-10 flex gap-4"
            style={{ background: "#fffbeb", border: "1.5px solid #f59e0b" }}
          >
            <div className="flex-shrink-0 mt-0.5">
              <svg viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth={2} className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-sm mb-1" style={{ color: "#92400e" }}>Important Mortgage Disclaimer</p>
              <p className="text-sm" style={{ color: "#78350f" }}>
                Mortgage Treehouse is an educational platform. Nothing on this website — including calculator outputs, guides, articles, or any other content — constitutes financial advice, mortgage advice, or a commitment to lend. All calculator results are estimates only. Actual loan terms, eligibility, and costs depend on your individual circumstances and must be determined by a licensed mortgage professional. Always consult a licensed loan officer or financial advisor before making mortgage decisions.
              </p>
            </div>
          </div>

          <div className="prose-content">
            <p>
              These Terms of Use (&quot;Terms&quot;) govern your access to and use of the Mortgage Treehouse website (the &quot;Site&quot;). By accessing or using the Site, you agree to be bound by these Terms. If you do not agree, please do not use the Site.
            </p>

            <h2>1. Use of the Site</h2>
            <p>
              You may use this Site for lawful, personal or professional purposes. You agree not to:
            </p>
            <ul>
              <li>Use the Site in any way that violates applicable laws or regulations</li>
              <li>Attempt to gain unauthorized access to any part of the Site or its infrastructure</li>
              <li>Scrape, crawl, or systematically collect content without our written permission</li>
              <li>Use the Site to distribute spam, malware, or other harmful content</li>
              <li>Misrepresent the source of any content from this Site</li>
            </ul>

            <h2>2. No Financial Advice</h2>
            <p>
              The content on Mortgage Treehouse — including all articles, guides, definitions, and calculator outputs — is provided for general educational and informational purposes only. It does not constitute:
            </p>
            <ul>
              <li>Financial, mortgage, or investment advice</li>
              <li>A commitment, offer, or solicitation to lend</li>
              <li>A guarantee of loan eligibility, approval, or specific terms</li>
              <li>Legal advice of any kind</li>
            </ul>
            <p>
              Calculator outputs are estimates based on the inputs you provide and the assumptions described on each calculator page. Real loan amounts, rates, fees, and eligibility are determined by licensed lenders in accordance with current guidelines and your individual credit, income, and property profile. We strongly encourage you to verify any result with a licensed mortgage professional before acting on it.
            </p>

            <h2>3. Calculator Accuracy</h2>
            <p>
              We make reasonable efforts to ensure our calculators reflect current VA and FHA guidelines. However, guidelines change, and we cannot guarantee that calculator logic is current or error-free at all times. We are not responsible for decisions made based on calculator outputs. Threshold tables, refund schedules, and loan limits should always be verified against the most current official guidelines (VA Lenders Handbook, HUD Mortgagee Letters, etc.).
            </p>

            <h2>4. No Warranty</h2>
            <p>
              The Site and all content are provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind, express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, accuracy, or non-infringement.
            </p>
            <p>
              We do not warrant that the Site will be uninterrupted, error-free, or free of viruses or other harmful components.
            </p>

            <h2>5. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, Mortgage Treehouse and its operators shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of (or inability to use) the Site or any content on it. This includes, without limitation, any financial losses, loan denials, or decisions made in reliance on calculator outputs or educational content.
            </p>

            <h2>6. Intellectual Property</h2>
            <p>
              All content on this Site — including text, calculator logic, design elements, and code — is owned by Mortgage Treehouse or its licensors. You may share links to our content or quote brief excerpts for non-commercial educational purposes, with attribution. You may not reproduce, republish, or commercially distribute our content without written permission.
            </p>

            <h2>7. Third-Party Links</h2>
            <p>
              The Site may contain links to external websites. These links are provided for convenience. We do not endorse, control, or take responsibility for the content or practices of any linked sites. Visiting a third-party site is at your own risk.
            </p>

            <h2>8. Privacy</h2>
            <p>
              Your use of the Site is also governed by our <Link href="/privacy" className="underline" style={{ color: "#2d6a4f" }}>Privacy Policy</Link>, which is incorporated into these Terms by reference.
            </p>

            <h2>9. Changes to These Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. When we do, we will update the &quot;Last updated&quot; date above. Continued use of the Site after changes are posted constitutes acceptance of the updated Terms.
            </p>

            <h2>10. Contact</h2>
            <p>
              If you have questions about these Terms, please contact us through our <Link href="/contact" className="underline" style={{ color: "#2d6a4f" }}>contact page</Link>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
