import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Mortgage Treehouse privacy policy — how we collect, use, and protect information.",
};

const sections = [
  {
    id: "information-we-collect",
    title: "Information We Collect",
    content: `We collect information you provide directly to us, such as when you fill out our contact form. This may include your name, email address, and the content of your message.

We also automatically collect certain technical information when you visit our site, including your IP address, browser type, operating system, referring URL, and pages visited. This information is collected through standard web server logs and analytics tools.

We do not collect financial information (loan amounts, income, debt figures) that you enter into our calculators. Calculator inputs are processed entirely in your browser and are not transmitted to or stored on our servers.`,
  },
  {
    id: "how-we-use-information",
    title: "How We Use Information",
    content: `We use the information we collect to:

- Respond to your questions and messages submitted through the contact form
- Understand how visitors use our site so we can improve content and functionality
- Monitor for technical errors and security issues
- Comply with legal obligations

We do not sell, rent, or share your personal information with third parties for their marketing purposes.`,
  },
  {
    id: "cookies",
    title: "Cookies and Tracking",
    content: `We use cookies and similar technologies to operate and improve our website. These include:

- Essential cookies: Required for basic site functionality, such as maintaining session state.
- Analytics cookies: We use privacy-respecting analytics to understand site traffic and page performance. These tools may collect anonymized data about how visitors interact with the site.

You can control cookies through your browser settings. Disabling cookies may affect some site functionality.`,
  },
  {
    id: "third-parties",
    title: "Third-Party Services",
    content: `Our website may use the following third-party services:

- Analytics providers (such as aggregated traffic analytics) to help us understand site usage
- Hosting and infrastructure providers to serve our website

These providers may process limited technical data as part of their services. We choose providers with strong privacy practices.

We do not currently use advertising networks or sell data to data brokers.`,
  },
  {
    id: "data-retention",
    title: "Data Retention",
    content: `We retain contact form submissions for a reasonable period to allow us to respond and maintain records of correspondence. Technical log data is typically retained for 90 days.

You may request deletion of your information by contacting us through our contact form.`,
  },
  {
    id: "your-rights",
    title: "Your Rights",
    content: `Depending on your location, you may have rights regarding your personal information, including the right to access, correct, or delete information we hold about you, and the right to opt out of certain data uses.

To exercise any of these rights, please contact us through our contact form. We will respond to your request within a reasonable timeframe.`,
  },
  {
    id: "security",
    title: "Security",
    content: `We take reasonable steps to protect the information we collect from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction. Our website is served over HTTPS.

However, no internet transmission is completely secure, and we cannot guarantee the absolute security of information transmitted to or from our site.`,
  },
  {
    id: "changes",
    title: "Changes to This Policy",
    content: `We may update this Privacy Policy from time to time. When we make changes, we will update the "Last updated" date at the top of this page. We encourage you to review this policy periodically.`,
  },
  {
    id: "contact",
    title: "Contact Us",
    content: `If you have questions about this Privacy Policy or how we handle your information, please reach out through our contact page.`,
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <section style={{ background: "linear-gradient(135deg, #edf7f1 0%, #f9f8f6 60%)" }} className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <nav className="flex items-center gap-2 text-sm mb-5" style={{ color: "#9ca3af" }}>
            <Link href="/" className="hover:text-[#2d6a4f] transition-colors">Home</Link>
            <span>/</span>
            <span style={{ color: "#2d6a4f" }} className="font-medium">Privacy Policy</span>
          </nav>
          <h1 className="text-3xl font-bold mb-2" style={{ color: "#1e2533" }}>Privacy Policy</h1>
          <p className="text-sm" style={{ color: "#6b7280" }}>Last updated: March 1, 2026</p>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto flex flex-col lg:flex-row gap-10">
          {/* Content */}
          <article className="flex-1 min-w-0 prose-content">
            <p>
              This Privacy Policy describes how Mortgage Treehouse (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) collects, uses, and shares information when you visit our website (mortgagetreehouse.com). Please read this policy carefully. By using our site, you agree to the practices described below.
            </p>

            {sections.map((s) => (
              <section key={s.id} id={s.id} className="mb-8">
                <h2>{s.title}</h2>
                {s.content.split("\n\n").map((para, i) => {
                  if (para.startsWith("- ")) {
                    const items = para.split("\n").filter(l => l.startsWith("- ")).map(l => l.slice(2));
                    return (
                      <ul key={i}>
                        {items.map((item) => <li key={item}>{item}</li>)}
                      </ul>
                    );
                  }
                  return <p key={i}>{para}</p>;
                })}
              </section>
            ))}
          </article>

          {/* TOC */}
          <aside className="hidden lg:block w-52 flex-shrink-0">
            <div className="sticky top-24">
              <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#9ca3af" }}>Sections</p>
              <ul className="space-y-2">
                {sections.map((s) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className="block text-xs py-1 transition-colors hover:text-[#2d6a4f]" style={{ color: "#6b7280" }}>
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
