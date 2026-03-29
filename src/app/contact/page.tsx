"use client";

import { useState } from "react";
import Link from "next/link";

const subjects = [
  "General Question",
  "Broker Tools Feedback",
  "Educational Content",
  "Bug Report",
  "Calculator Request",
  "Other",
];

const quickLinks = [
  { label: "FHA Loan Basics", href: "/learn/fha-basics" },
  { label: "VA Loan Basics", href: "/learn/va-basics" },
  { label: "Mortgage Glossary", href: "/learn/mortgage-glossary" },
  { label: "VA Residual Income Calculator", href: "/calculators/va-residual-income" },
  { label: "FHA Streamline Calculator", href: "/calculators/fha-streamline" },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  function validate() {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Name is required.";
    if (!form.email.trim()) errs.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Enter a valid email address.";
    if (!form.subject) errs.subject = "Please select a subject.";
    if (!form.message.trim()) errs.message = "Message is required.";
    else if (form.message.trim().length < 10) errs.message = "Message must be at least 10 characters.";
    return errs;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    // Simulate submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  }

  function handleChange(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => { const n = { ...e }; delete n[field]; return n; });
  }

  const inputClass = (field: string) =>
    `w-full px-3 py-2.5 rounded-xl border text-sm outline-none transition-all ${
      errors[field]
        ? "border-red-400 bg-red-50 focus:ring-2 focus:ring-red-200"
        : "border-[#e5e7eb] bg-white focus:border-[#2d6a4f] focus:ring-2 focus:ring-[#edf7f1]"
    }`;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section style={{ background: "linear-gradient(135deg, #edf7f1 0%, #f9f8f6 60%)" }} className="py-14 px-4">
        <div className="max-w-5xl mx-auto">
          <nav className="flex items-center gap-2 text-sm mb-5" style={{ color: "#9ca3af" }}>
            <Link href="/" className="hover:text-[#2d6a4f] transition-colors">Home</Link>
            <span>/</span>
            <span style={{ color: "#2d6a4f" }} className="font-medium">Contact</span>
          </nav>
          <h1 className="text-4xl font-bold mb-3" style={{ color: "#1e2533" }}>Get in Touch</h1>
          <p className="text-lg max-w-xl" style={{ color: "#4b5563" }}>
            Have a question, a calculator request, or feedback? We&apos;d love to hear from you.
          </p>
        </div>
      </section>

      {/* Form + Sidebar */}
      <section className="py-14 px-4">
        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-10">

          {/* Form */}
          <div className="flex-1">
            {submitted ? (
              <div className="rounded-2xl p-8 text-center" style={{ background: "#edf7f1", border: "1px solid #d3eddf" }}>
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "#2d6a4f" }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} className="w-7 h-7">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold mb-2" style={{ color: "#1e2533" }}>Message Sent</h2>
                <p className="text-sm mb-6" style={{ color: "#4b5563" }}>
                  Thanks for reaching out, {form.name.split(" ")[0]}. We&apos;ll be in touch soon.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
                  style={{ background: "#2d6a4f" }}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: "#1e2533" }}>
                      Full Name <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      placeholder="Jane Smith"
                      className={inputClass("name")}
                      style={{ fontFamily: "inherit" }}
                    />
                    {errors.name && <p className="mt-1 text-xs" style={{ color: "#ef4444" }}>{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: "#1e2533" }}>
                      Email Address <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      placeholder="jane@example.com"
                      className={inputClass("email")}
                      style={{ fontFamily: "inherit" }}
                    />
                    {errors.email && <p className="mt-1 text-xs" style={{ color: "#ef4444" }}>{errors.email}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: "#1e2533" }}>
                    Subject <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <select
                    value={form.subject}
                    onChange={(e) => handleChange("subject", e.target.value)}
                    className={inputClass("subject")}
                    style={{ fontFamily: "inherit" }}
                  >
                    <option value="">Select a subject…</option>
                    {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {errors.subject && <p className="mt-1 text-xs" style={{ color: "#ef4444" }}>{errors.subject}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: "#1e2533" }}>
                    Message <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <textarea
                    rows={5}
                    value={form.message}
                    onChange={(e) => handleChange("message", e.target.value)}
                    placeholder="Tell us what's on your mind…"
                    className={inputClass("message")}
                    style={{ fontFamily: "inherit", resize: "vertical" }}
                  />
                  {errors.message && <p className="mt-1 text-xs" style={{ color: "#ef4444" }}>{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-8 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
                  style={{ background: "#2d6a4f" }}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" d="M12 3v3m0 12v3M3 12h3m12 0h3" />
                      </svg>
                      Sending…
                    </>
                  ) : "Send Message"}
                </button>

                <p className="text-xs" style={{ color: "#9ca3af" }}>
                  We typically respond within 1–2 business days. This form is for general inquiries only — we cannot provide personalized financial advice.
                </p>
              </form>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:w-72 flex-shrink-0 space-y-6">
            <div className="rounded-2xl p-5" style={{ background: "white", border: "1px solid #e5e7eb", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
              <h3 className="font-semibold mb-3" style={{ color: "#1e2533" }}>Quick answers</h3>
              <p className="text-xs mb-3" style={{ color: "#6b7280" }}>Check these resources before reaching out — your question might already be answered.</p>
              <ul className="space-y-2">
                {quickLinks.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="flex items-center gap-2 text-sm transition-colors hover:text-[#2d6a4f]" style={{ color: "#4b5563" }}>
                      <span style={{ color: "#2d6a4f" }}>→</span> {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl p-5" style={{ background: "#edf7f1", border: "1px solid #d3eddf" }}>
              <h3 className="font-semibold mb-2" style={{ color: "#1e2533" }}>Heads up</h3>
              <p className="text-xs leading-relaxed" style={{ color: "#4b5563" }}>
                Mortgage Treehouse is an educational platform. We cannot provide personalized mortgage advice, loan quotes, or act as a licensed mortgage broker. For guidance on your specific situation, speak with a licensed loan officer.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
