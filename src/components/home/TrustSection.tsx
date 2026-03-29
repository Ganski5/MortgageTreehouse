interface TrustCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

function TrustCard({ title, description, icon }: TrustCardProps) {
  return (
    <div className="flex flex-col items-start rounded-xl bg-white p-6 shadow-sm ring-1 ring-[#2d6a4f]/10">
      <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-[#2d6a4f]/10 text-[#2d6a4f]">
        {icon}
      </div>
      <h3 className="mb-2 text-base font-semibold text-[#1e2533]">{title}</h3>
      <p className="text-sm leading-6 text-[#6b7280]">{description}</p>
    </div>
  );
}

function ClarityIcon() {
  return (
    <svg
      className="h-6 w-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4m0-4h.01" />
    </svg>
  );
}

function ToolsIcon() {
  return (
    <svg
      className="h-6 w-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
      <path d="M7 9h2m0 0v4m0-4V7m4 2h2m-2 0v4m0-4V7" />
    </svg>
  );
}

function FreeIcon() {
  return (
    <svg
      className="h-6 w-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function EveryoneIcon() {
  return (
    <svg
      className="h-6 w-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </svg>
  );
}

const trustCards = [
  {
    title: "Built for Clarity",
    description: "We strip away the jargon so you can make informed decisions.",
    icon: <ClarityIcon />,
  },
  {
    title: "Tools That Work",
    description:
      "Our calculators are built on real VA and FHA guidelines, not estimates.",
    icon: <ToolsIcon />,
  },
  {
    title: "Free, Always",
    description: "No subscriptions, no hidden fees, no lead forms.",
    icon: <FreeIcon />,
  },
  {
    title: "For Everyone",
    description:
      "Whether you're a first-time buyer or a seasoned broker, this is your place.",
    icon: <EveryoneIcon />,
  },
];

export default function TrustSection() {
  return (
    <section className="bg-[#edf7f1] py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-6">
        {/* Header */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-[#1e2533] sm:text-4xl">
            Why Mortgage Treehouse?
          </h2>
          <p className="mt-3 text-lg text-[#4b5563]">
            We built this for people who deserve straight answers about one of the biggest financial decisions of their lives.
          </p>
        </div>

        {/* Trust cards grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {trustCards.map((card) => (
            <TrustCard
              key={card.title}
              title={card.title}
              description={card.description}
              icon={card.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
