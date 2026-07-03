"use client";

import { useState } from "react";
import { submitReview } from "../actions/submitReview";

const ROLES = ["Loan Officer", "Processor", "Real Estate Agent", "Underwriter", "Other"];

export function ReviewForm() {
  const [name, setName]       = useState("");
  const [role, setRole]       = useState("");
  const [company, setCompany] = useState("");
  const [rating, setRating]   = useState(0);
  const [hover, setHover]     = useState(0);
  const [body, setBody]       = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError]     = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) { setError("Please select a star rating."); return; }
    setError("");
    setLoading(true);
    try {
      await submitReview({ name, role, company, rating, body });
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-3 py-6 text-center">
        <span className="text-3xl">🌟</span>
        <p className="font-semibold text-zinc-900 dark:text-white">Thanks for the review!</p>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          We&apos;ll read it and add it to the site once approved.
        </p>
      </div>
    );
  }

  const activeRating = hover || rating;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">

      {/* Star rating */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
          Rating
        </label>
        <div className="flex gap-1" onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              className={`text-2xl transition-all duration-100 hover:scale-125 focus:outline-none ${
                star <= activeRating
                  ? "text-amber-400 drop-shadow-sm"
                  : "text-zinc-200 dark:text-zinc-700"
              }`}
            >
              ★
            </button>
          ))}
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>

      {/* Name + Role row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
            Name
          </label>
          <input
            required
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Smith"
            className="w-full px-3 py-2.5 text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow duration-150"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
            Role
          </label>
          <select
            required
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-3 py-2.5 text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow duration-150"
          >
            <option value="">Select…</option>
            {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
      </div>

      {/* Company */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
          Company <span className="normal-case font-normal text-zinc-400">(optional)</span>
        </label>
        <input
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="Brokerage or lender name"
          className="w-full px-3 py-2.5 text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow duration-150"
        />
      </div>

      {/* Review body */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
          Review
        </label>
        <textarea
          required
          rows={3}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="What did you use it for? What did you like?"
          className="w-full px-3 py-2.5 text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow duration-150 resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all duration-200 hover:shadow-md"
      >
        {loading ? "Submitting…" : "Submit review"}
      </button>

    </form>
  );
}
