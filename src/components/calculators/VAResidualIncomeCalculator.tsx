"use client";

import React, { useState, useRef } from "react";
import {
  VA_REGIONS,
  calculateVAResidualIncome,
  type VAResidualIncomeInputs,
  type VAResidualIncomeResult,
} from "@/lib/va-residual-income";
import { FormField } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormValues {
  region: string;
  familySize: string;
  grossMonthlyIncome: string;
  loanAmount: string;
  monthlyHousingPayment: string;
  monthlyDebts: string;
  childSupportAlimony: string;
  estimatedUtilities: string;
  otherObligations: string;
}

interface FormErrors {
  region?: string;
  familySize?: string;
  grossMonthlyIncome?: string;
  loanAmount?: string;
  monthlyHousingPayment?: string;
  monthlyDebts?: string;
  childSupportAlimony?: string;
  otherObligations?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const EMPTY_FORM: FormValues = {
  region: "",
  familySize: "",
  grossMonthlyIncome: "",
  loanAmount: "",
  monthlyHousingPayment: "",
  monthlyDebts: "",
  childSupportAlimony: "",
  estimatedUtilities: "",
  otherObligations: "",
};

function parsePositiveFloat(raw: string): number {
  const n = parseFloat(raw.replace(/,/g, ""));
  return isNaN(n) || n < 0 ? 0 : n;
}

function fmt(n: number): string {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};

  if (!values.region) {
    errors.region = "Please select a region.";
  }

  const familySize = parseInt(values.familySize, 10);
  if (!values.familySize || isNaN(familySize) || familySize < 1 || familySize > 10) {
    errors.familySize = "Enter a family size between 1 and 10.";
  }

  const income = parseFloat(values.grossMonthlyIncome.replace(/,/g, ""));
  if (!values.grossMonthlyIncome || isNaN(income) || income <= 0) {
    errors.grossMonthlyIncome = "Enter a gross monthly income greater than $0.";
  }

  const loan = parseFloat(values.loanAmount.replace(/,/g, ""));
  if (!values.loanAmount || isNaN(loan) || loan <= 0) {
    errors.loanAmount = "Enter a loan amount greater than $0.";
  }

  const housing = parseFloat(values.monthlyHousingPayment.replace(/,/g, ""));
  if (!values.monthlyHousingPayment || isNaN(housing) || housing < 0) {
    errors.monthlyHousingPayment = "Enter a monthly housing payment of $0 or more.";
  }

  const debts = parseFloat(values.monthlyDebts.replace(/,/g, ""));
  if (!values.monthlyDebts || isNaN(debts) || debts < 0) {
    errors.monthlyDebts = "Enter monthly debts of $0 or more.";
  }

  const childSupport = parseFloat(values.childSupportAlimony.replace(/,/g, ""));
  if (!values.childSupportAlimony || isNaN(childSupport) || childSupport < 0) {
    errors.childSupportAlimony = "Enter a value of $0 or more.";
  }

  const other = parseFloat(values.otherObligations.replace(/,/g, ""));
  if (!values.otherObligations || isNaN(other) || other < 0) {
    errors.otherObligations = "Enter a value of $0 or more.";
  }

  return errors;
}

// ─── Section header ───────────────────────────────────────────────────────────

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <h3 className="text-base font-semibold text-[#1e2533] whitespace-nowrap">{children}</h3>
      <div className="flex-1 h-px bg-[#e5e7eb]" />
    </div>
  );
}

// ─── Pass / Fail banner ───────────────────────────────────────────────────────

function ResultBanner({ passes }: { passes: boolean }) {
  if (passes) {
    return (
      <div
        role="status"
        aria-label="VA Residual Income result: Pass"
        className="flex items-center justify-center gap-3 rounded-xl bg-[#10b981] px-6 py-5 shadow-sm"
      >
        {/* Check-circle icon */}
        <svg
          className="w-9 h-9 text-white shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
        <span className="text-3xl font-extrabold tracking-wide text-white">
          PASS
        </span>
      </div>
    );
  }

  return (
    <div
      role="status"
      aria-label="VA Residual Income result: Fail"
      className="flex items-center justify-center gap-3 rounded-xl bg-[#ef4444] px-6 py-5 shadow-sm"
    >
      {/* X-circle icon */}
      <svg
        className="w-9 h-9 text-white shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>
      <span className="text-3xl font-extrabold tracking-wide text-white">
        FAIL
      </span>
    </div>
  );
}

// ─── Results panel ────────────────────────────────────────────────────────────

function ResultsPanel({ result }: { result: VAResidualIncomeResult }) {
  const { residualIncome, requiredThreshold, passes, surplus, breakdown, explanation } = result;

  const surplusPositive = surplus >= 0;

  return (
    <section
      aria-labelledby="results-heading"
      className="mt-8 rounded-2xl border border-[#e5e7eb] bg-white shadow-sm overflow-hidden"
    >
      {/* Header bar */}
      <div className="bg-[#2d6a4f] px-6 py-4">
        <h2
          id="results-heading"
          className="text-lg font-bold text-white tracking-wide"
        >
          Calculation Results
        </h2>
      </div>

      <div className="p-6 space-y-6">
        {/* Pass / Fail banner */}
        <ResultBanner passes={passes} />

        {/* Key metrics grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Residual Income */}
          <div className="rounded-xl border border-[#e5e7eb] bg-[#f9f8f6] px-5 py-4 text-center">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500 mb-1">
              Residual Income
            </p>
            <p
              className={`text-2xl font-extrabold ${
                passes ? "text-[#10b981]" : "text-[#ef4444]"
              }`}
            >
              {fmt(residualIncome)}
            </p>
          </div>

          {/* Required Threshold */}
          <div className="rounded-xl border border-[#e5e7eb] bg-[#f9f8f6] px-5 py-4 text-center">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500 mb-1">
              Required Threshold
            </p>
            <p className="text-2xl font-extrabold text-[#1e2533]">
              {fmt(requiredThreshold)}
            </p>
          </div>

          {/* Surplus / Shortfall */}
          <div className="rounded-xl border border-[#e5e7eb] bg-[#f9f8f6] px-5 py-4 text-center">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500 mb-1">
              {surplusPositive ? "Surplus" : "Shortfall"}
            </p>
            <p
              className={`text-2xl font-extrabold ${
                surplusPositive ? "text-[#10b981]" : "text-[#ef4444]"
              }`}
            >
              {surplusPositive ? "+" : "-"}
              {fmt(Math.abs(surplus))}
            </p>
          </div>
        </div>

        {/* Breakdown table */}
        <div>
          <h3 className="text-sm font-semibold text-[#1e2533] mb-3">
            Income &amp; Deduction Breakdown
          </h3>
          <div className="rounded-xl border border-[#e5e7eb] overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#edf7f1] border-b border-[#e5e7eb]">
                  <th className="text-left px-4 py-2.5 font-semibold text-[#2d6a4f] text-xs uppercase tracking-wider">
                    Item
                  </th>
                  <th className="text-right px-4 py-2.5 font-semibold text-[#2d6a4f] text-xs uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {breakdown.map((row, idx) => {
                  const isResidual = row.label === "Residual Income";
                  const isIncome = row.amount > 0 && !isResidual;
                  const isNegative = row.amount < 0;

                  return (
                    <tr
                      key={row.label}
                      className={[
                        idx % 2 === 0 ? "bg-white" : "bg-[#f9f8f6]",
                        isResidual
                          ? "border-t-2 border-[#2d6a4f] bg-[#edf7f1] font-bold"
                          : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      <td
                        className={`px-4 py-2.5 ${
                          isResidual
                            ? "text-[#2d6a4f] font-bold"
                            : "text-gray-700"
                        }`}
                      >
                        {row.label}
                      </td>
                      <td
                        className={`px-4 py-2.5 text-right font-mono ${
                          isResidual
                            ? passes
                              ? "text-[#10b981] font-bold"
                              : "text-[#ef4444] font-bold"
                            : isIncome
                            ? "text-[#2d6a4f]"
                            : isNegative
                            ? "text-[#ef4444]"
                            : "text-gray-700"
                        }`}
                      >
                        {row.amount >= 0
                          ? fmt(row.amount)
                          : `(${fmt(Math.abs(row.amount))})`}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Plain-English explanation */}
        <div
          className={`rounded-xl border px-5 py-4 text-sm leading-relaxed ${
            passes
              ? "border-[#6ee7b7] bg-[#d1fae5] text-[#065f46]"
              : "border-[#fca5a5] bg-[#fee2e2] text-[#991b1b]"
          }`}
        >
          <p className="font-semibold mb-1">
            {passes ? "Qualification Summary" : "Qualification Summary"}
          </p>
          <p>{explanation}</p>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-gray-400 leading-relaxed border-t border-[#e5e7eb] pt-4">
          <strong>Disclaimer:</strong> This is an estimate only. Results do not
          constitute loan approval. Always verify with current VA guidelines and
          consult the VA Lenders Handbook (Chapter 4) for authoritative
          threshold tables.
        </p>
      </div>
    </section>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function VAResidualIncomeCalculator() {
  const [values, setValues] = useState<FormValues>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [result, setResult] = useState<VAResidualIncomeResult | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const resultsRef = useRef<HTMLDivElement>(null);

  // ── Input helpers ──────────────────────────────────────────────────────────

  function handleChange(field: keyof FormValues, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
    // Clear per-field error on change once the form has been submitted
    if (submitted && errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  // ── Calculate ──────────────────────────────────────────────────────────────

  function handleCalculate(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);

    const validationErrors = validate(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const inputs: VAResidualIncomeInputs = {
      region: values.region,
      familySize: parseInt(values.familySize, 10),
      grossMonthlyIncome: parsePositiveFloat(values.grossMonthlyIncome),
      loanAmount: parsePositiveFloat(values.loanAmount),
      monthlyHousingPayment: parsePositiveFloat(values.monthlyHousingPayment),
      monthlyDebts: parsePositiveFloat(values.monthlyDebts),
      childSupportAlimony: parsePositiveFloat(values.childSupportAlimony),
      estimatedUtilities: parsePositiveFloat(values.estimatedUtilities),
      otherObligations: parsePositiveFloat(values.otherObligations),
    };

    const calcResult = calculateVAResidualIncome(inputs);
    setResult(calcResult);

    // Scroll results into view after paint
    requestAnimationFrame(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  // ── Reset ──────────────────────────────────────────────────────────────────

  function handleReset() {
    setValues(EMPTY_FORM);
    setErrors({});
    setResult(null);
    setSubmitted(false);
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div>
      {/* ── Form ── */}
      <form
        onSubmit={handleCalculate}
        noValidate
        className="rounded-2xl border border-[#e5e7eb] bg-white shadow-sm overflow-hidden"
      >
        {/* Form header */}
        <div className="bg-[#2d6a4f] px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white tracking-wide">
            Enter Loan &amp; Borrower Details
          </h2>
          {/* VA Shield icon */}
          <svg
            className="w-7 h-7 text-white/70 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>

        <div className="p-6 space-y-8">
          {/* ── Section 1: Borrower & Loan Info ── */}
          <div>
            <SectionHeading>Borrower &amp; Loan Info</SectionHeading>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
              {/* Region */}
              <FormField
                label="Region"
                helperText="VA uses different minimums by region"
                errorMessage={errors.region}
              >
                {({ id, inputClassName, ...aria }) => (
                  <select
                    id={id}
                    {...aria}
                    value={values.region}
                    onChange={(e) => handleChange("region", e.target.value)}
                    className={inputClassName}
                  >
                    <option value="">Select a region…</option>
                    {VA_REGIONS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                )}
              </FormField>

              {/* Family Size */}
              <FormField
                label="Family Size"
                helperText="Include borrower, spouse, and dependents"
                errorMessage={errors.familySize}
              >
                {({ id, inputClassName, ...aria }) => (
                  <input
                    id={id}
                    {...aria}
                    type="number"
                    min={1}
                    max={10}
                    step={1}
                    placeholder="e.g. 3"
                    value={values.familySize}
                    onChange={(e) => handleChange("familySize", e.target.value)}
                    className={inputClassName}
                  />
                )}
              </FormField>

              {/* Estimated Loan Amount */}
              <FormField
                label="Estimated Loan Amount"
                helperText="Used to determine the correct VA threshold table"
                errorMessage={errors.loanAmount}
                dollarPrefix
              >
                {({ id, inputClassName, ...aria }) => (
                  <input
                    id={id}
                    {...aria}
                    type="text"
                    inputMode="decimal"
                    placeholder="e.g. 350,000"
                    value={values.loanAmount}
                    onChange={(e) => handleChange("loanAmount", e.target.value)}
                    className={inputClassName}
                  />
                )}
              </FormField>
            </div>
          </div>

          {/* ── Section 2: Monthly Income & Housing ── */}
          <div>
            <SectionHeading>Monthly Income &amp; Housing</SectionHeading>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
              {/* Gross Monthly Income */}
              <FormField
                label="Gross Monthly Income"
                helperText="Before taxes and deductions"
                errorMessage={errors.grossMonthlyIncome}
                dollarPrefix
              >
                {({ id, inputClassName, ...aria }) => (
                  <input
                    id={id}
                    {...aria}
                    type="text"
                    inputMode="decimal"
                    placeholder="e.g. 7,500"
                    value={values.grossMonthlyIncome}
                    onChange={(e) =>
                      handleChange("grossMonthlyIncome", e.target.value)
                    }
                    className={inputClassName}
                  />
                )}
              </FormField>

              {/* Monthly Housing Payment PITI */}
              <FormField
                label="Monthly Housing Payment (PITI)"
                helperText="Principal, Interest, Taxes, and Insurance"
                errorMessage={errors.monthlyHousingPayment}
                dollarPrefix
              >
                {({ id, inputClassName, ...aria }) => (
                  <input
                    id={id}
                    {...aria}
                    type="text"
                    inputMode="decimal"
                    placeholder="e.g. 1,800"
                    value={values.monthlyHousingPayment}
                    onChange={(e) =>
                      handleChange("monthlyHousingPayment", e.target.value)
                    }
                    className={inputClassName}
                  />
                )}
              </FormField>

              {/* Estimated Utilities */}
              <FormField
                label="Estimated Monthly Utilities"
                helperText="Optional — VA guidelines suggest ~$0.14 per sq ft"
              >
                {({ id, inputClassName, ...aria }) => (
                  <div className="relative">
                    <span
                      className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-sm text-gray-500"
                      aria-hidden="true"
                    >
                      $
                    </span>
                    <input
                      id={id}
                      {...aria}
                      type="text"
                      inputMode="decimal"
                      placeholder="e.g. 200 (optional)"
                      value={values.estimatedUtilities}
                      onChange={(e) =>
                        handleChange("estimatedUtilities", e.target.value)
                      }
                      className={inputClassName + " pl-7"}
                    />
                  </div>
                )}
              </FormField>
            </div>
          </div>

          {/* ── Section 3: Monthly Obligations ── */}
          <div>
            <SectionHeading>Monthly Obligations</SectionHeading>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
              {/* Monthly Debts */}
              <FormField
                label="Monthly Debts"
                helperText="Car payments, student loans, credit cards (minimum payments)"
                errorMessage={errors.monthlyDebts}
                dollarPrefix
              >
                {({ id, inputClassName, ...aria }) => (
                  <input
                    id={id}
                    {...aria}
                    type="text"
                    inputMode="decimal"
                    placeholder="e.g. 450"
                    value={values.monthlyDebts}
                    onChange={(e) => handleChange("monthlyDebts", e.target.value)}
                    className={inputClassName}
                  />
                )}
              </FormField>

              {/* Child Support / Alimony */}
              <FormField
                label="Child Support / Alimony"
                helperText="Monthly court-ordered payments"
                errorMessage={errors.childSupportAlimony}
                dollarPrefix
              >
                {({ id, inputClassName, ...aria }) => (
                  <input
                    id={id}
                    {...aria}
                    type="text"
                    inputMode="decimal"
                    placeholder="e.g. 0"
                    value={values.childSupportAlimony}
                    onChange={(e) =>
                      handleChange("childSupportAlimony", e.target.value)
                    }
                    className={inputClassName}
                  />
                )}
              </FormField>

              {/* Other Monthly Obligations */}
              <FormField
                label="Other Monthly Obligations"
                helperText="Any other recurring monthly obligations"
                errorMessage={errors.otherObligations}
                dollarPrefix
              >
                {({ id, inputClassName, ...aria }) => (
                  <input
                    id={id}
                    {...aria}
                    type="text"
                    inputMode="decimal"
                    placeholder="e.g. 0"
                    value={values.otherObligations}
                    onChange={(e) =>
                      handleChange("otherObligations", e.target.value)
                    }
                    className={inputClassName}
                  />
                )}
              </FormField>
            </div>
          </div>

          {/* ── Action buttons ── */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 border-t border-[#e5e7eb]">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full sm:w-auto"
              icon={
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                    clipRule="evenodd"
                  />
                </svg>
              }
            >
              Calculate
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
              onClick={handleReset}
              icon={
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H5.498a.75.75 0 00-.75.75v3.218a.75.75 0 001.5 0v-1.886l.312.311a7 7 0 0011.68-3.143.75.75 0 00-1.458-.35zm-5.136-9.374a7 7 0 00-6.544 4.524.75.75 0 001.458.35A5.5 5.5 0 0116.25 9.11l.31.312H14.13a.75.75 0 000 1.5h3.218a.75.75 0 00.75-.75V6.953a.75.75 0 00-1.5 0v1.886l-.31-.311a7.002 7.002 0 00-6.112-3.478z"
                    clipRule="evenodd"
                  />
                </svg>
              }
            >
              Reset
            </Button>
          </div>
        </div>
      </form>

      {/* ── Results ── */}
      <div ref={resultsRef}>
        {result && <ResultsPanel result={result} />}
      </div>
    </div>
  );
}

export default VAResidualIncomeCalculator;
