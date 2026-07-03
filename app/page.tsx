import Image from "next/image";
import { Header } from "./components/Header";
import { EmailCapture } from "./components/EmailCapture";
import { ReviewForm } from "./components/ReviewForm";
import { FadeIn } from "./components/FadeIn";
import { StatBanner } from "./components/StatBanner";
import { CalculatorTabs } from "./components/CalculatorTabs";
import { ReviewCarousel } from "./components/ReviewCarousel";


const howItWorks = [
  {
    step: "01",
    icon: "🔓",
    title: "No login needed",
    body: "Open any calculator instantly. No account, no signup, no waiting — just the tool.",
  },
  {
    step: "02",
    icon: "⚡",
    title: "Enter the numbers",
    body: "Clean inputs designed for speed. Results recalculate live as you type, every field.",
  },
  {
    step: "03",
    icon: "✅",
    title: "Get your answer",
    body: "Accurate results in seconds. Use them on a call, in a package, or on the spot.",
  },
];

const reviews = [
  {
    name: "Sarah M.",
    role: "Loan Officer",
    company: "First National Lending",
    rating: 5,
    body: "The VA residual calculator alone has saved me hours every week. Clean, fast, and I can pull it up mid-call with a borrower without any lag.",
  },
  {
    name: "Derek T.",
    role: "Processor",
    company: "Horizon Mortgage",
    rating: 5,
    body: "Finally a tool built for how we actually work. The threshold table highlight makes it so easy to show underwriting exactly where the file stands.",
  },
  {
    name: "Jenna R.",
    role: "Real Estate Agent",
    company: "RE/MAX Pinnacle",
    rating: 5,
    body: "I screen-share the calculators with buyers during our first call. Sets expectations and saves everyone time at the table.",
  },
  {
    name: "Marcus L.",
    role: "Senior Loan Officer",
    company: "Summit Home Loans",
    rating: 5,
    body: "The DTI > 41% tooltip on the threshold table is a detail I didn't know I needed. That kind of thoughtfulness shows.",
  },
  {
    name: "Priya K.",
    role: "Processor",
    company: "Clearpath Mortgage",
    rating: 5,
    body: "No login required is huge. I can send a link to a referral partner and they're using it in 30 seconds. Nothing to install or create.",
  },
  {
    name: "Tom W.",
    role: "Loan Officer",
    company: "Pacific Crest Bank",
    rating: 4,
    body: "The family size dial is a nice touch — feels like someone who does loans every day actually designed this. Looking forward to the self-employment calc.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-full bg-white dark:bg-zinc-950 font-[family-name:var(--font-geist-sans)]">
      <Header showProgress />

      <main className="flex-1">

        {/* ── Hero ── */}
        <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-zinc-900 dark:via-zinc-950 dark:to-emerald-950 py-28 px-6">
          <div className="max-w-3xl mx-auto text-center flex flex-col items-center gap-6">
            <span
              className="inline-block text-xs font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/40 px-4 py-1.5 rounded-full anim-fade-in"
              style={{ animationDelay: "0ms" }}
            >
              Built by mortgage professionals
            </span>
            <h1
              className="text-5xl sm:text-6xl font-bold tracking-tight text-zinc-900 dark:text-white leading-tight text-balance anim-fade-in-up"
              style={{ animationDelay: "80ms" }}
            >
              Welcome to the{" "}
              <span className="text-emerald-600 dark:text-emerald-400">Treehouse</span>
            </h1>
            <p
              className="text-xl text-zinc-500 dark:text-zinc-400 max-w-xl leading-relaxed text-balance anim-fade-in-up"
              style={{ animationDelay: "160ms" }}
            >
              Free calculators for LOs, Processors, REAs, and homebuyers. Built by the people who live in these numbers every day.
            </p>
            <div
              className="flex flex-wrap justify-center gap-4 pt-2 anim-fade-in-up"
              style={{ animationDelay: "240ms" }}
            >
              <a
                href="#calculators"
                className="px-7 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"
              >
                Browse Calculators
              </a>
              <a
                href="#about"
                className="px-7 py-3 rounded-full border border-zinc-200 dark:border-zinc-700 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-600 active:scale-95 transition-all duration-200 hover:-translate-y-0.5"
              >
                Learn more
              </a>
            </div>

          </div>
          <div className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full bg-emerald-100 dark:bg-emerald-900/20 blur-3xl opacity-50" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-teal-100 dark:bg-teal-900/20 blur-3xl opacity-50" />
        </section>

        {/* ── How It Works ── */}
        <section className="py-20 px-6 bg-zinc-50 dark:bg-zinc-900 border-y border-zinc-100 dark:border-zinc-800">
          <div className="max-w-4xl mx-auto">
            <FadeIn className="text-center mb-12">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
                How it works
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                Built for the pace of a real estate transaction.
              </p>
            </FadeIn>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 relative">
              <div className="hidden sm:block absolute top-8 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-px bg-zinc-200 dark:bg-zinc-700" />
              {howItWorks.map(({ step, icon, title, body }, i) => (
                <FadeIn key={step} delay={i * 120} className="flex flex-col items-center text-center gap-4 relative">
                  <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 shadow-sm text-3xl z-10">
                    {icon}
                    <span className="absolute -top-2.5 -right-2.5 w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center">
                      {step.replace("0", "")}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-zinc-900 dark:text-white mb-1">{title}</h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{body}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ── Calculators ── */}
        <section id="calculators" className="py-24 px-6 bg-white dark:bg-zinc-950">
          <div className="max-w-5xl mx-auto">
            <FadeIn className="text-center mb-14">
              <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-3 text-balance">
                All Calculators
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
                One live now, more on the way. Bookmark this page — new tools drop regularly.
              </p>
            </FadeIn>
            <CalculatorTabs />
          </div>
        </section>

        {/* ── Social Proof Banner ── */}
        <StatBanner />

        {/* ── Reviews ── */}
        <section id="reviews" className="py-24 px-6 bg-zinc-50 dark:bg-zinc-900">
          <div className="max-w-2xl mx-auto">
            <FadeIn className="text-center mb-14">
              <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-3 text-balance">
                What professionals are saying
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
                Tools built by mortgage professionals, for mortgage professionals.
              </p>
            </FadeIn>
            <FadeIn>
              <ReviewCarousel reviews={reviews} />
            </FadeIn>
          </div>
        </section>

        {/* ── About ── */}
        <section id="about" className="py-24 px-6 bg-white dark:bg-zinc-950">
          <FadeIn className="max-w-2xl mx-auto text-center flex flex-col items-center gap-6">
            <Image src="/logo.png" alt="Mortgage Treehouse" width={64} height={64} className="dark:invert" />
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white text-balance">
              Built for the people in the deal
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed text-balance">
              Mortgage Treehouse was built to give loan officers, processors, and real estate agents a
              single, fast, no-login-required home for the calculations they run every day. No paywalls.
              No ads. Just tools that work.
            </p>
            <a
              href="#calculators"
              className="px-7 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95"
            >
              Get started — it&apos;s free
            </a>
          </FadeIn>
        </section>

        {/* ── Community ── */}
        <section id="community" className="py-20 px-6 bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

            {/* Email capture */}
            <FadeIn className="flex flex-col gap-6">
              <div>
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
                  Stay in the loop
                </h2>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
                  Get notified when new calculators go live. One email per launch, no spam ever.
                </p>
              </div>
              <EmailCapture />
            </FadeIn>

            {/* Divider — visible on mobile, hidden on desktop (border-l handles desktop) */}
            <div className="lg:hidden border-t border-zinc-200 dark:border-zinc-700" />

            {/* Review form */}
            <FadeIn delay={120} className="flex flex-col gap-6 lg:border-l lg:border-zinc-200 dark:lg:border-zinc-700 lg:pl-16">
              <div>
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
                  Leave a review
                </h2>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
                  Used a calculator? Tell us what you think — we read every submission before publishing.
                </p>
              </div>
              <ReviewForm />
            </FadeIn>

          </div>
        </section>

      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-zinc-100 dark:border-zinc-800 px-6 py-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-zinc-400">
          <span className="flex items-center gap-2 font-medium text-emerald-700 dark:text-emerald-400">
            <Image src="/logo.png" alt="" width={20} height={20} className="dark:invert" />
            Mortgage Treehouse
          </span>
          <span>&copy; {new Date().getFullYear()} Mortgage Treehouse. All rights reserved.</span>
          <nav className="flex gap-5">
            {["#calculators", "#reviews", "#about"].map((href) => (
              <a
                key={href}
                href={href}
                className="capitalize hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors duration-150"
              >
                {href.replace("#", "")}
              </a>
            ))}
          </nav>
        </div>
      </footer>

    </div>
  );
}
