"use client";

import { useEffect, useRef, useState } from "react";

function useCountUp(target: number, active: boolean, duration = 1400) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    function step(now: number) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased    = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }, [active, target, duration]);

  return count;
}

interface StatItemProps {
  target: number;
  suffix: string;
  label: string;
  active: boolean;
}

function StatItem({ target, suffix, label, active }: StatItemProps) {
  const count = useCountUp(target, active);
  return (
    <div className="group flex flex-col items-center">
      <p className="text-4xl font-bold tabular-nums transition-transform duration-200 group-hover:scale-110">
        {count}{suffix}
      </p>
      <p className="text-emerald-100 text-sm mt-1">{label}</p>
    </div>
  );
}

const STATS: { target: number; suffix: string; label: string }[] = [
  { target: 9,   suffix: "",  label: "Calculators Planned" },
  { target: 100, suffix: "%", label: "Free, Always"        },
  { target: 3,   suffix: "",  label: "Roles Supported"     },
];

export function StatBanner() {
  const ref    = useRef<HTMLElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="bg-emerald-600 dark:bg-emerald-800 py-14 px-6 text-white text-center"
    >
      <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-10 sm:gap-20">
        {STATS.map((s) => (
          <StatItem key={s.label} {...s} active={active} />
        ))}
      </div>
    </section>
  );
}
