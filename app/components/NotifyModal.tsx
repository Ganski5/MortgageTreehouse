"use client";

import { useState, useEffect, useRef } from "react";

interface NotifyModalProps {
  calcName: string;
  onClose: () => void;
}

export function NotifyModal({ calcName, onClose }: NotifyModalProps) {
  const [email, setEmail]       = useState("");
  const [status, setStatus]     = useState<"idle" | "loading" | "done" | "error">("idle");
  const inputRef                = useRef<HTMLInputElement>(null);

  // Focus input and trap escape
  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), calculator: calcName }),
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Panel */}
      <div
        className="relative w-full max-w-sm bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-700 shadow-2xl p-7 flex flex-col gap-5"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "modalPop 0.18s cubic-bezier(0.22,1,0.36,1) both" }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-150 text-lg leading-none"
        >
          ×
        </button>

        {status === "done" ? (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <span className="text-4xl">📬</span>
            <p className="font-semibold text-zinc-900 dark:text-white">You&apos;re on the list!</p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              We&apos;ll email you when <span className="font-medium text-zinc-700 dark:text-zinc-300">{calcName}</span> goes live.
            </p>
            <button
              onClick={onClose}
              className="mt-2 px-5 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-all duration-150 active:scale-95"
            >
              Got it
            </button>
          </div>
        ) : (
          <>
            <div>
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1">
                Coming Soon
              </p>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white">{calcName}</h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                Drop your email and we&apos;ll notify you the moment this calculator launches.
              </p>
            </div>

            <form onSubmit={submit} className="flex flex-col gap-3">
              <input
                ref={inputRef}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm placeholder:text-zinc-400 outline-none focus:ring-2 focus:ring-emerald-500 transition"
              />
              {status === "error" && (
                <p className="text-xs text-red-500">Something went wrong — try again.</p>
              )}
              <button
                type="submit"
                disabled={status === "loading"}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-sm font-semibold transition-all duration-150 active:scale-95 shadow-sm"
              >
                {status === "loading" ? "Sending…" : "Notify me when it's live"}
              </button>
            </form>

            <p className="text-xs text-zinc-400 text-center">One email per launch. No spam, ever.</p>
          </>
        )}
      </div>
    </div>
  );
}
