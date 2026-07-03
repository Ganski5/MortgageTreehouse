"use client";

import { useState } from "react";

export function EmailCapture() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    // TODO: wire to an email service (Resend, Mailchimp, etc.)
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="text-center flex flex-col items-center gap-3">
        <span className="text-3xl">🌲</span>
        <p className="text-lg font-semibold text-zinc-900 dark:text-white">You&apos;re in!</p>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          We&apos;ll let you know when new calculators go live.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-md mx-auto">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@brokerage.com"
        className="flex-1 px-4 py-3 text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow duration-150"
      />
      <button
        type="submit"
        className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-sm font-semibold transition-all duration-200 hover:shadow-md whitespace-nowrap"
      >
        Notify me
      </button>
    </form>
  );
}
