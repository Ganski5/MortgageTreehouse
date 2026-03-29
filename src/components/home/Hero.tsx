import Link from "next/link";

export default function Hero() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: "linear-gradient(160deg, #edf7f1 0%, #ffffff 60%)" }}
    >
      {/* Decorative background SVG */}
      <svg
        className="pointer-events-none absolute right-0 top-0 h-full w-1/2 opacity-[0.06]"
        viewBox="0 0 600 600"
        fill="none"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Tree trunk */}
        <rect x="280" y="380" width="40" height="140" rx="6" fill="#2d6a4f" />
        {/* Tree canopy layers */}
        <polygon points="300,60 420,220 180,220" fill="#2d6a4f" />
        <polygon points="300,120 440,300 160,300" fill="#2d6a4f" />
        <polygon points="300,200 460,380 140,380" fill="#2d6a4f" />
        {/* House base */}
        <rect x="100" y="320" width="120" height="80" rx="4" fill="#2d6a4f" />
        <polygon points="160,260 100,320 220,320" fill="#2d6a4f" />
        <rect x="130" y="350" width="30" height="50" rx="2" fill="#2d6a4f" />
      </svg>

      <div className="relative mx-auto max-w-5xl px-6 py-20 sm:py-28 lg:py-36">
        <div className="max-w-2xl">
          {/* Eyebrow */}
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#2d6a4f]/10 px-3 py-1 text-sm font-medium text-[#2d6a4f]">
            <svg
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h4a1 1 0 001-1v-3h2v3a1 1 0 001 1h4a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            Mortgage Treehouse
          </span>

          {/* Headline */}
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-[#1e2533] sm:text-5xl lg:text-6xl">
            Mortgage made{" "}
            <span className="text-[#2d6a4f]">simple.</span>
          </h1>

          {/* Subheadline */}
          <p className="mt-6 text-lg leading-8 text-[#4b5563] sm:text-xl">
            Whether you&apos;re buying your first home or closing your next deal,
            Mortgage Treehouse gives you the tools and education to move forward
            with confidence.
          </p>

          {/* CTA buttons */}
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              href="/homebuyers"
              className="inline-flex items-center justify-center rounded-lg bg-[#2d6a4f] px-7 py-3.5 text-base font-semibold text-white shadow-sm transition-colors hover:bg-[#245a41] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2d6a4f]"
            >
              I&apos;m a Homebuyer
            </Link>
            <Link
              href="/brokers"
              className="inline-flex items-center justify-center rounded-lg border-2 border-[#2d6a4f] bg-transparent px-7 py-3.5 text-base font-semibold text-[#2d6a4f] transition-colors hover:bg-[#2d6a4f]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2d6a4f]"
            >
              I&apos;m a Mortgage Broker
            </Link>
          </div>

          {/* Trust stats */}
          <div className="mt-12 flex flex-wrap gap-x-8 gap-y-4">
            {[
              { label: "10+ Calculators", icon: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" },
              { label: "Plain-English Guides", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
              { label: "Free to Use", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
              { label: "No Sign-Up Required", icon: "M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" },
            ].map(({ label, icon }) => (
              <div key={label} className="flex items-center gap-2 text-sm font-medium text-[#2d6a4f]">
                <svg
                  className="h-5 w-5 flex-shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d={icon} />
                </svg>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
