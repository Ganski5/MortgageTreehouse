"use client";

import { useState, useEffect } from "react";
import { PDFDownloadLink, type DocumentProps } from "@react-pdf/renderer";
import type { ReactElement } from "react";

interface DownloadPDFButtonProps {
  document: ReactElement<DocumentProps>;
  filename: string;
  disabled?: boolean;
}

export function DownloadPDFButton({ document, filename, disabled = false }: DownloadPDFButtonProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const btnBase =
    "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-150 active:scale-95";
  const btnEnabled =
    "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-emerald-400 dark:hover:border-emerald-600 hover:text-emerald-700 dark:hover:text-emerald-400 shadow-sm hover:shadow-md";
  const btnDisabled =
    "border-zinc-100 dark:border-zinc-800 text-zinc-300 dark:text-zinc-600 cursor-not-allowed bg-zinc-50 dark:bg-zinc-900";

  if (!mounted || disabled) {
    return (
      <button disabled className={`${btnBase} ${btnDisabled}`}>
        <DownloadIcon />
        Download PDF
      </button>
    );
  }

  return (
    <PDFDownloadLink document={document} fileName={filename}>
      {({ loading }) =>
        loading ? (
          <button disabled className={`${btnBase} ${btnDisabled}`}>
            <SpinnerIcon />
            Generating…
          </button>
        ) : (
          <button className={`${btnBase} ${btnEnabled}`}>
            <DownloadIcon />
            Download PDF
          </button>
        )
      }
    </PDFDownloadLink>
  );
}

function DownloadIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "spin 1s linear infinite" }}>
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
