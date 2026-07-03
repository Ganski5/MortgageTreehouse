"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

function SunIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}

interface HeaderProps {
  backLink?: { href: string; label: string };
  showProgress?: boolean;
}

export function Header({ backLink, showProgress = false }: HeaderProps) {
  const [dark, setDark]             = useState(false);
  const [mounted, setMounted]       = useState(false);
  const [scrollPct, setScrollPct]   = useState(0);

  useEffect(() => {
    setMounted(true);
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  useEffect(() => {
    if (!showProgress) return;
    const onScroll = () => {
      const el  = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      setScrollPct(max > 0 ? (el.scrollTop / max) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [showProgress]);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try { localStorage.setItem("theme", next ? "dark" : "light"); } catch (_) {}
  }

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-800 transition-colors duration-300">

      {/* Scroll progress bar — sits along the bottom edge of the header */}
      {showProgress && (
        <div
          className="absolute bottom-0 left-0 h-0.5 bg-emerald-500 dark:bg-emerald-400 z-10"
          style={{ width: `${scrollPct}%`, transition: "width 80ms linear" }}
        />
      )}

      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">

        <Link
          href="/"
          className="flex items-center gap-2.5 transition-opacity duration-150 hover:opacity-80"
        >
          <Image
            src="/logo.png"
            alt="Mortgage Treehouse logo"
            width={36}
            height={36}
            className="dark:invert"
          />
          <span className="text-xl font-bold text-emerald-700 dark:text-emerald-400 tracking-tight">
            Mortgage Treehouse
          </span>
        </Link>

        <div className="flex items-center gap-5">
          {backLink ? (
            <Link
              href={backLink.href}
              className="text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors duration-150"
            >
              ← {backLink.label}
            </Link>
          ) : (
            <nav className="hidden sm:flex items-center gap-7 text-sm font-medium text-zinc-500 dark:text-zinc-400">
              {[
                { href: "/#calculators", label: "Calculators" },
                { href: "/#reviews",     label: "Reviews"     },
                { href: "/#about",       label: "About"       },
              ].map(({ href, label }) => (
                <a
                  key={label}
                  href={href}
                  className="relative py-0.5 after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-emerald-600 dark:after:bg-emerald-400 after:transition-all after:duration-200 hover:after:w-full hover:text-zinc-900 dark:hover:text-white transition-colors duration-150"
                >
                  {label}
                </a>
              ))}
            </nav>
          )}

          {/* Theme toggle */}
          <button
            onClick={toggle}
            aria-label="Toggle dark mode"
            className={`
              relative flex items-center justify-center w-9 h-9 rounded-full
              border border-zinc-200 dark:border-zinc-700
              bg-white dark:bg-zinc-900
              text-zinc-500 dark:text-zinc-400
              hover:border-emerald-400 dark:hover:border-emerald-500
              hover:text-emerald-600 dark:hover:text-emerald-400
              hover:scale-110 active:scale-95
              transition-all duration-200
              ${!mounted ? "opacity-0 pointer-events-none" : "opacity-100"}
            `}
          >
            <span className={`transition-all duration-300 ${dark ? "rotate-0 opacity-100" : "rotate-90 opacity-0 absolute"}`}>
              <SunIcon />
            </span>
            <span className={`transition-all duration-300 ${!dark ? "rotate-0 opacity-100" : "-rotate-90 opacity-0 absolute"}`}>
              <MoonIcon />
            </span>
          </button>
        </div>

      </div>
    </header>
  );
}
