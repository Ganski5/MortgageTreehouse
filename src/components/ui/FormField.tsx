"use client";

import React, { ReactNode, useId } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FormFieldProps {
  /** Text label rendered above the input */
  label: string;
  /** Optional helper text rendered below the input */
  helperText?: string;
  /** Validation error message — replaces helperText when present */
  errorMessage?: string;
  /** Show a "$" prefix inside the left side of the input */
  dollarPrefix?: boolean;
  /** Forwarded `id`. Auto-generated if omitted. */
  id?: string;
  /** Extra classes applied to the outer wrapper */
  className?: string;
  /**
   * Render prop / children pattern.
   * Pass a function that receives the resolved `id`, `aria-describedby`,
   * and the shared input class string so you can spread them onto any
   * <input>, <select>, or <textarea>.
   */
  children: (fieldProps: FieldRenderProps) => ReactNode;
}

export interface FieldRenderProps {
  /** The `id` to set on the control (links label via htmlFor) */
  id: string;
  /** Space-separated id list for aria-describedby */
  "aria-describedby": string | undefined;
  /** Whether the field is in an error state */
  "aria-invalid": boolean | undefined;
  /** Tailwind class string for the control element */
  inputClassName: string;
}

// ─── Shared input class builder ───────────────────────────────────────────────

function buildInputClasses(hasError: boolean, hasDollarPrefix: boolean): string {
  return [
    "block w-full rounded-lg border bg-white text-gray-900",
    "text-sm leading-5 placeholder:text-gray-400",
    "py-2.5 pr-3",
    hasDollarPrefix ? "pl-7" : "pl-3",
    hasError
      ? "border-red-400 focus:border-red-400 focus:ring-red-300"
      : "border-[#e5e7eb] focus:border-[#2d6a4f] focus:ring-[#2d6a4f]/30",
    "focus:outline-none focus:ring-2",
    "disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500",
    "transition-colors duration-150",
  ]
    .filter(Boolean)
    .join(" ");
}

// ─── Component ────────────────────────────────────────────────────────────────

export function FormField({
  label,
  helperText,
  errorMessage,
  dollarPrefix = false,
  id: externalId,
  className = "",
  children,
}: FormFieldProps) {
  const generatedId = useId();
  const id = externalId ?? generatedId;
  const hasError = Boolean(errorMessage);

  // Build stable aria-describedby value
  const helperId = helperText ? `${id}-helper` : undefined;
  const errorId = hasError ? `${id}-error` : undefined;
  const describedBy = [helperId, errorId].filter(Boolean).join(" ") || undefined;

  const inputClassName = buildInputClasses(hasError, dollarPrefix);

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {/* Label */}
      <label
        htmlFor={id}
        className="text-sm font-medium text-gray-700 select-none"
      >
        {label}
      </label>

      {/* Input wrapper — handles optional dollar prefix */}
      <div className="relative">
        {dollarPrefix && (
          <span
            className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-sm text-gray-500"
            aria-hidden="true"
          >
            $
          </span>
        )}

        {children({
          id,
          "aria-describedby": describedBy,
          "aria-invalid": hasError || undefined,
          inputClassName,
        })}
      </div>

      {/* Helper / error text */}
      {hasError ? (
        <p
          id={errorId}
          role="alert"
          className="flex items-center gap-1 text-xs font-medium text-red-600"
        >
          <svg
            className="h-3.5 w-3.5 shrink-0"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-8-3a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 7zm0 7a1 1 0 100-2 1 1 0 000 2z"
              clipRule="evenodd"
            />
          </svg>
          {errorMessage}
        </p>
      ) : helperText ? (
        <p id={helperId} className="text-xs text-gray-500">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}

export default FormField;
