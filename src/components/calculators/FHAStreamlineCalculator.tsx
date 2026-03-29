"use client";

import React, { useState } from "react";
import {
  calculateFHAStreamline,
  FHAStreamlineInputs,
  FHAStreamlineResult,
} from "@/lib/fha-streamline";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDollar(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatDollarAbs(value: number): string {
  return formatDollar(Math.abs(value));
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-base font-semibold text-[#2d6a4f] border-b border-[#c3e6d0] pb-2 mb-4">
      {children}
    </h3>
  );
}

interface FieldWrapperProps {
  label: string;
  helper?: string;
  htmlFor?: string;
  dollarPrefix?: boolean;
  children: React.ReactNode;
}

function FieldWrapper({ label, helper, htmlFor, dollarPrefix, children }: FieldWrapperProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-gray-700 select-none">
        {label}
      </label>
      <div className="relative">
        {dollarPrefix && (
          <span
            className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-sm text-gray-500"
            aria-hidden="true"
          >
            $
          </span>
        )}
        {children}
      </div>
      {helper && <p className="text-xs text-gray-500">{helper}</p>}
    </div>
  );
}

const inputClass =
  "block w-full rounded-lg border border-[#e5e7eb] bg-white text-gray-900 text-sm leading-5 py-2.5 pr-3 focus:border-[#2d6a4f] focus:ring-2 focus:ring-[#2d6a4f]/30 focus:outline-none transition-colors duration-150 placeholder:text-gray-400";

interface MetricCardProps {
  label: string;
  value: string;
  sub?: string;
  highlight?: boolean;
  accent?: boolean;
}

function MetricCard({ label, value, sub, highlight, accent }: MetricCardProps) {
  const bg = highlight
    ? "bg-[#edf7f1] border-[#2d6a4f]/30"
    : accent
    ? "bg-[#fff7f0] border-[#f4a261]/40"
    : "bg-white border-[#e5e7eb]";

  return (
    <div className={`rounded-xl border p-4 ${bg}`}>
      <p className="text-xs font-medium text-gray-500 mb-1">{label}</p>
      <p
        className={`text-xl font-bold leading-tight ${
          highlight ? "text-[#2d6a4f]" : accent ? "text-[#c07030]" : "text-gray-900"
        }`}
      >
        {value}
      </p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
}

// ─── Default form state ────────────────────────────────────────────────────────

const defaultForm = {
  originalClosingDate: "",
  currentBalance: "",
  originalBaseAmount: "",
  ufmipPaid: "",
  closingCostsRolled: "",
  isFHAtoFHA: true,
  currentRate: "",
  newRate: "",
  remainingTermMonths: "",
};

// ─── Main component ───────────────────────────────────────────────────────────

export default function FHAStreamlineCalculator() {
  const [form, setForm] = useState(defaultForm);
  const [result, setResult] = useState<FHAStreamlineResult | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof typeof defaultForm, string>>>({});

  function handleChange(field: keyof typeof defaultForm, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validate(): boolean {
    const next: Partial<Record<keyof typeof defaultForm, string>> = {};

    if (!form.originalClosingDate) next.originalClosingDate = "Required";
    if (!form.currentBalance || Number(form.currentBalance) <= 0)
      next.currentBalance = "Enter a positive balance";
    if (!form.originalBaseAmount || Number(form.originalBaseAmount) <= 0)
      next.originalBaseAmount = "Enter the original base loan amount";
    if (!form.ufmipPaid || Number(form.ufmipPaid) < 0)
      next.ufmipPaid = "Enter the UFMIP paid at closing";
    if (form.closingCostsRolled !== "" && Number(form.closingCostsRolled) < 0)
      next.closingCostsRolled = "Cannot be negative";
    if (!form.currentRate || Number(form.currentRate) <= 0)
      next.currentRate = "Enter the current interest rate";
    if (!form.newRate || Number(form.newRate) <= 0)
      next.newRate = "Enter the new interest rate";
    if (
      !form.remainingTermMonths ||
      !Number.isInteger(Number(form.remainingTermMonths)) ||
      Number(form.remainingTermMonths) <= 0
    )
      next.remainingTermMonths = "Enter a whole number of months remaining";

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const inputs: FHAStreamlineInputs = {
      originalClosingDate: form.originalClosingDate,
      currentBalance: Number(form.currentBalance),
      originalBaseAmount: Number(form.originalBaseAmount),
      ufmipPaid: Number(form.ufmipPaid),
      closingCostsRolled: Number(form.closingCostsRolled) || 0,
      isFHAtoFHA: form.isFHAtoFHA,
      currentRate: Number(form.currentRate),
      newRate: Number(form.newRate),
      remainingTermMonths: Number(form.remainingTermMonths),
    };

    setResult(calculateFHAStreamline(inputs));

    // Scroll to results after a tick
    setTimeout(() => {
      document.getElementById("fha-results")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }

  function handleReset() {
    setForm(defaultForm);
    setResult(null);
    setErrors({});
  }

  // ── Status banner config ────────────────────────────────────────────────────
  function StatusBanner({ r }: { r: FHAStreamlineResult }) {
    // Eligible: FHA-to-FHA and within months 1–35
    if (r.isEligibleForRefund) {
      return (
        <div className="flex items-center gap-3 rounded-lg bg-[#edf7f1] border border-[#2d6a4f]/30 px-4 py-3">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#2d6a4f] text-white text-sm font-bold">
            ✓
          </span>
          <div>
            <p className="text-sm font-semibold text-[#2d6a4f]">Eligible for UFMIP Refund</p>
            <p className="text-xs text-[#2d6a4f]/80">
              {r.ufmipRefundPercentage}% refund credit applies — loan is {r.monthsSinceClosing} month
              {r.monthsSinceClosing !== 1 ? "s" : ""} old.
            </p>
          </div>
        </div>
      );
    }

    // In window but not FHA-to-FHA — not eligible due to loan type
    if (!r.isEligibleForRefund && r.inRefundWindow) {
      return (
        <div className="flex items-center gap-3 rounded-lg bg-gray-50 border border-gray-200 px-4 py-3">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-400 text-white text-sm font-bold">
            —
          </span>
          <div>
            <p className="text-sm font-semibold text-gray-700">Not Eligible for UFMIP Refund</p>
            <p className="text-xs text-gray-500">
              UFMIP refund only applies to FHA-to-FHA streamline refinances.
            </p>
          </div>
        </div>
      );
    }

    // Outside the 36-month window
    return (
      <div className="flex items-center gap-3 rounded-lg bg-amber-50 border border-amber-200 px-4 py-3">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-400 text-white text-sm font-bold">
          !
        </span>
        <div>
          <p className="text-sm font-semibold text-amber-700">Outside Refund Window</p>
          <p className="text-xs text-amber-600">
            Loan is {r.monthsSinceClosing} months old — the UFMIP refund window is months 1–35.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} noValidate>
        {/* ── Section 1: Current Loan Details ── */}
        <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-6 mb-6">
          <SectionHeading>Current Loan Details</SectionHeading>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

            {/* Original FHA Closing Date */}
            <FieldWrapper
              label="Original FHA Closing Date"
              helper="The closing date of your current FHA loan"
              htmlFor="originalClosingDate"
            >
              <input
                id="originalClosingDate"
                type="date"
                value={form.originalClosingDate}
                onChange={(e) => handleChange("originalClosingDate", e.target.value)}
                className={`${inputClass} pl-3 ${errors.originalClosingDate ? "border-red-400 focus:border-red-400 focus:ring-red-300" : ""}`}
                max={new Date().toISOString().split("T")[0]}
              />
              {errors.originalClosingDate && (
                <p className="mt-1 text-xs font-medium text-red-600">{errors.originalClosingDate}</p>
              )}
            </FieldWrapper>

            {/* Current Unpaid Principal Balance */}
            <FieldWrapper
              label="Current Unpaid Principal Balance"
              helper="Your current loan balance"
              htmlFor="currentBalance"
              dollarPrefix
            >
              <input
                id="currentBalance"
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                placeholder="250,000"
                value={form.currentBalance}
                onChange={(e) => handleChange("currentBalance", e.target.value)}
                className={`${inputClass} pl-7 ${errors.currentBalance ? "border-red-400 focus:border-red-400 focus:ring-red-300" : ""}`}
              />
              {errors.currentBalance && (
                <p className="mt-1 text-xs font-medium text-red-600">{errors.currentBalance}</p>
              )}
            </FieldWrapper>

            {/* Original Base Loan Amount */}
            <FieldWrapper
              label="Original Base Loan Amount"
              helper="The original loan amount before adding UFMIP"
              htmlFor="originalBaseAmount"
              dollarPrefix
            >
              <input
                id="originalBaseAmount"
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                placeholder="255,000"
                value={form.originalBaseAmount}
                onChange={(e) => handleChange("originalBaseAmount", e.target.value)}
                className={`${inputClass} pl-7 ${errors.originalBaseAmount ? "border-red-400 focus:border-red-400 focus:ring-red-300" : ""}`}
              />
              {errors.originalBaseAmount && (
                <p className="mt-1 text-xs font-medium text-red-600">{errors.originalBaseAmount}</p>
              )}
            </FieldWrapper>

            {/* Original UFMIP Paid */}
            <FieldWrapper
              label="Original UFMIP Paid"
              helper="The upfront mortgage insurance premium paid at closing (typically 1.75% of base amount)"
              htmlFor="ufmipPaid"
              dollarPrefix
            >
              <input
                id="ufmipPaid"
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                placeholder="4,463"
                value={form.ufmipPaid}
                onChange={(e) => handleChange("ufmipPaid", e.target.value)}
                className={`${inputClass} pl-7 ${errors.ufmipPaid ? "border-red-400 focus:border-red-400 focus:ring-red-300" : ""}`}
              />
              {errors.ufmipPaid && (
                <p className="mt-1 text-xs font-medium text-red-600">{errors.ufmipPaid}</p>
              )}
            </FieldWrapper>

            {/* Current Interest Rate */}
            <FieldWrapper
              label="Current Interest Rate (%)"
              helper="Your existing loan's interest rate"
              htmlFor="currentRate"
            >
              <input
                id="currentRate"
                type="number"
                inputMode="decimal"
                min="0"
                step="0.001"
                placeholder="6.75"
                value={form.currentRate}
                onChange={(e) => handleChange("currentRate", e.target.value)}
                className={`${inputClass} pl-3 ${errors.currentRate ? "border-red-400 focus:border-red-400 focus:ring-red-300" : ""}`}
              />
              {errors.currentRate && (
                <p className="mt-1 text-xs font-medium text-red-600">{errors.currentRate}</p>
              )}
            </FieldWrapper>

            {/* Remaining Term */}
            <FieldWrapper
              label="Remaining Term (months)"
              helper="Months remaining on your current loan"
              htmlFor="remainingTermMonths"
            >
              <input
                id="remainingTermMonths"
                type="number"
                inputMode="numeric"
                min="1"
                step="1"
                placeholder="324"
                value={form.remainingTermMonths}
                onChange={(e) => handleChange("remainingTermMonths", e.target.value)}
                className={`${inputClass} pl-3 ${errors.remainingTermMonths ? "border-red-400 focus:border-red-400 focus:ring-red-300" : ""}`}
              />
              {errors.remainingTermMonths && (
                <p className="mt-1 text-xs font-medium text-red-600">{errors.remainingTermMonths}</p>
              )}
            </FieldWrapper>

          </div>
        </div>

        {/* ── Section 2: Refinance Details ── */}
        <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-6 mb-6">
          <SectionHeading>Refinance Details</SectionHeading>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

            {/* New Interest Rate */}
            <FieldWrapper
              label="New Interest Rate (%)"
              helper="The rate on your new loan"
              htmlFor="newRate"
            >
              <input
                id="newRate"
                type="number"
                inputMode="decimal"
                min="0"
                step="0.001"
                placeholder="6.00"
                value={form.newRate}
                onChange={(e) => handleChange("newRate", e.target.value)}
                className={`${inputClass} pl-3 ${errors.newRate ? "border-red-400 focus:border-red-400 focus:ring-red-300" : ""}`}
              />
              {errors.newRate && (
                <p className="mt-1 text-xs font-medium text-red-600">{errors.newRate}</p>
              )}
            </FieldWrapper>

            {/* Closing Costs to Roll In */}
            <FieldWrapper
              label="Closing Costs to Roll Into New Loan"
              helper="Costs you want to finance into the new loan"
              htmlFor="closingCostsRolled"
              dollarPrefix
            >
              <input
                id="closingCostsRolled"
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                placeholder="0"
                value={form.closingCostsRolled}
                onChange={(e) => handleChange("closingCostsRolled", e.target.value)}
                className={`${inputClass} pl-7 ${errors.closingCostsRolled ? "border-red-400 focus:border-red-400 focus:ring-red-300" : ""}`}
              />
              {errors.closingCostsRolled && (
                <p className="mt-1 text-xs font-medium text-red-600">{errors.closingCostsRolled}</p>
              )}
            </FieldWrapper>

            {/* FHA to FHA Toggle — spans both columns */}
            <div className="sm:col-span-2">
              <FieldWrapper
                label="Is this an FHA-to-FHA Streamline?"
                helper="UFMIP refund only applies when refinancing into another FHA loan"
              >
                <div className="flex gap-3 mt-0.5">
                  {[
                    { label: "Yes", value: true },
                    { label: "No", value: false },
                  ].map(({ label, value }) => {
                    const active = form.isFHAtoFHA === value;
                    return (
                      <button
                        key={label}
                        type="button"
                        onClick={() => handleChange("isFHAtoFHA", value)}
                        className={`px-5 py-2 rounded-lg text-sm font-medium border transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2d6a4f] focus-visible:ring-offset-1 ${
                          active
                            ? "bg-[#2d6a4f] text-white border-[#2d6a4f]"
                            : "bg-white text-gray-700 border-[#e5e7eb] hover:border-[#2d6a4f]/50"
                        }`}
                        aria-pressed={active}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </FieldWrapper>
            </div>

          </div>
        </div>

        {/* ── Actions ── */}
        <div className="flex gap-3">
          <button
            type="submit"
            className="flex-1 sm:flex-none px-8 py-3 rounded-xl bg-[#2d6a4f] text-white text-sm font-semibold hover:bg-[#245a42] active:bg-[#1d4a36] transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2d6a4f] focus-visible:ring-offset-2"
          >
            Calculate
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-6 py-3 rounded-xl border border-[#e5e7eb] bg-white text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2"
          >
            Reset
          </button>
        </div>
      </form>

      {/* ── Results ── */}
      {result && (
        <div id="fha-results" className="mt-10 space-y-6">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-gray-900">Results</h2>
            <div className="h-px flex-1 bg-[#e5e7eb]" />
          </div>

          {/* Status banner */}
          <StatusBanner r={result} />

          {/* Key metric cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <MetricCard
              label="Estimated UFMIP Refund"
              value={formatDollar(result.ufmipRefundAmount)}
              sub={result.ufmipRefundPercentage > 0 ? `${result.ufmipRefundPercentage}% of original UFMIP` : "No refund applies"}
              highlight={result.ufmipRefundAmount > 0}
            />
            <MetricCard
              label="New UFMIP Due"
              value={formatDollar(result.newUFMIP)}
              sub="1.75% of new base amount"
            />
            <MetricCard
              label="Net UFMIP Cost"
              value={formatDollar(result.netUFMIPAfterRefund)}
              sub="After refund credit"
              accent={result.netUFMIPAfterRefund > 0}
            />
            <MetricCard
              label="Estimated New Loan Amount"
              value={formatDollar(result.totalNewLoanAmount)}
              sub="Base + net UFMIP"
            />
          </div>

          {/* Monthly payment comparison */}
          <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-[#e5e7eb]">
              <h3 className="text-sm font-semibold text-gray-900">Monthly Payment Comparison</h3>
              <p className="text-xs text-gray-500 mt-0.5">Principal &amp; interest only — does not include taxes, insurance, or MIP</p>
            </div>
            <div className="grid grid-cols-3 divide-x divide-[#e5e7eb]">
              <div className="px-5 py-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Current P&amp;I</p>
                <p className="text-lg font-bold text-gray-900">{formatDollar(result.currentMonthlyPayment)}</p>
              </div>
              <div className="px-5 py-4 text-center">
                <p className="text-xs text-gray-500 mb-1">New P&amp;I</p>
                <p className="text-lg font-bold text-gray-900">{formatDollar(result.newMonthlyPayment)}</p>
              </div>
              <div className="px-5 py-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Monthly Savings</p>
                <p
                  className={`text-lg font-bold ${
                    result.monthlySavings > 0
                      ? "text-[#2d6a4f]"
                      : result.monthlySavings < 0
                      ? "text-red-600"
                      : "text-gray-900"
                  }`}
                >
                  {result.monthlySavings >= 0 ? "" : "−"}
                  {formatDollarAbs(result.monthlySavings)}
                </p>
              </div>
            </div>
          </div>

          {/* Detailed breakdown table */}
          <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-[#e5e7eb]">
              <h3 className="text-sm font-semibold text-gray-900">Detailed Breakdown</h3>
            </div>
            <div className="divide-y divide-[#f3f4f6]">
              {result.breakdown.map(({ label, amount }, i) => {
                const isNegative = amount < 0;
                const isMonthly = label.toLowerCase().includes("monthly") || label.toLowerCase().includes("savings");
                const isSavings = label.toLowerCase().includes("savings");
                const isCreditRow = label.toLowerCase().includes("refund credit");

                return (
                  <div
                    key={i}
                    className={`flex items-center justify-between px-5 py-3 text-sm ${
                      label === "Total New Loan Amount" || label === "New Base Loan Amount"
                        ? "bg-[#f9fafb]"
                        : ""
                    }`}
                  >
                    <span className={label === "Total New Loan Amount" ? "font-semibold text-gray-900" : "text-gray-600"}>
                      {label}
                    </span>
                    <span
                      className={`font-medium tabular-nums ${
                        isCreditRow && amount < 0
                          ? "text-[#2d6a4f]"
                          : isSavings && amount > 0
                          ? "text-[#2d6a4f]"
                          : isSavings && amount < 0
                          ? "text-red-600"
                          : isMonthly
                          ? "text-gray-900"
                          : label === "Total New Loan Amount"
                          ? "font-bold text-gray-900"
                          : "text-gray-900"
                      }`}
                    >
                      {isCreditRow && isNegative
                        ? `(${formatDollarAbs(amount)})`
                        : formatDollar(amount)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Notes / warnings */}
          {result.notes.length > 0 && (
            <div className="space-y-2">
              {result.notes.map((note, i) => {
                const isWarning = note.toLowerCase().startsWith("warning");
                return (
                  <div
                    key={i}
                    className={`flex gap-3 rounded-lg border px-4 py-3 text-sm ${
                      isWarning
                        ? "bg-amber-50 border-amber-200 text-amber-800"
                        : "bg-[#edf7f1] border-[#c3e6d0] text-[#1a5c3a]"
                    }`}
                  >
                    <span className="shrink-0 mt-px" aria-hidden="true">
                      {isWarning ? "⚠" : "ℹ"}
                    </span>
                    <p>{note}</p>
                  </div>
                );
              })}
            </div>
          )}

          {/* Disclaimer */}
          <p className="text-xs text-gray-400 leading-relaxed border-t border-[#e5e7eb] pt-4">
            <strong>Disclaimer:</strong> These calculations are estimates for informational purposes only and do not
            constitute a loan commitment or financial advice. Actual loan amounts, UFMIP refund amounts, and
            monthly payments may vary. Consult a licensed mortgage professional for your specific situation.
            FHA guidelines and refund schedules are subject to change.
          </p>
        </div>
      )}
    </div>
  );
}
