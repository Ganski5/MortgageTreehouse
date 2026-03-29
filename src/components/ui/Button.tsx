"use client";

import React, { ReactNode } from "react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

type ButtonVariant = "primary" | "accent" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface BaseButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  children?: ReactNode;
}

interface ButtonAsButtonProps
  extends BaseButtonProps,
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseButtonProps> {
  href?: undefined;
}

interface ButtonAsLinkProps
  extends BaseButtonProps,
    Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseButtonProps> {
  href: string;
}

type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

// ─── Style maps ───────────────────────────────────────────────────────────────

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-[#2d6a4f] text-white hover:bg-[#245a42] active:bg-[#1e4d38] focus-visible:ring-[#2d6a4f]",
  accent:
    "bg-[#f4a261] text-white hover:bg-[#e8904d] active:bg-[#dc7e3a] focus-visible:ring-[#f4a261]",
  outline:
    "bg-white text-[#2d6a4f] border border-[#2d6a4f] hover:bg-[#f0faf4] active:bg-[#e0f5e9] focus-visible:ring-[#2d6a4f]",
  ghost:
    "bg-transparent text-[#2d6a4f] hover:bg-[#f0faf4] active:bg-[#e0f5e9] focus-visible:ring-[#2d6a4f]",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "text-sm px-3 py-1.5 gap-1.5 rounded-md",
  md: "text-base px-5 py-2.5 gap-2 rounded-lg",
  lg: "text-lg px-7 py-3.5 gap-2.5 rounded-xl",
};

const iconSizeClasses: Record<ButtonSize, string> = {
  sm: "w-3.5 h-3.5",
  md: "w-4 h-4",
  lg: "w-5 h-5",
};

// ─── Spinner ──────────────────────────────────────────────────────────────────

function Spinner({ size }: { size: ButtonSize }) {
  return (
    <svg
      className={`animate-spin shrink-0 ${iconSizeClasses[size]}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

// ─── Shared inner content ─────────────────────────────────────────────────────

function ButtonContent({
  icon,
  loading,
  size = "md",
  children,
}: {
  icon?: ReactNode;
  loading?: boolean;
  size?: ButtonSize;
  children?: ReactNode;
}) {
  return (
    <>
      {loading ? (
        <Spinner size={size} />
      ) : icon ? (
        <span className={`shrink-0 ${iconSizeClasses[size]} flex items-center justify-center`} aria-hidden="true">
          {icon}
        </span>
      ) : null}
      {children && <span>{children}</span>}
    </>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Button(props: ButtonProps) {
  const {
    variant = "primary",
    size = "md",
    icon,
    loading = false,
    disabled = false,
    className = "",
    children,
    href,
    ...rest
  } = props;

  const isDisabled = disabled || loading;

  const baseClasses = [
    "inline-flex items-center justify-center font-semibold",
    "transition-colors duration-150 ease-in-out",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    "select-none",
    variantClasses[variant],
    sizeClasses[size],
    isDisabled ? "opacity-50 cursor-not-allowed pointer-events-none" : "cursor-pointer",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (href !== undefined) {
    const { href: _href, ...linkRest } = rest as ButtonAsLinkProps;
    return (
      <Link
        href={href}
        className={baseClasses}
        aria-disabled={isDisabled || undefined}
        {...(linkRest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        <ButtonContent icon={icon} loading={loading} size={size}>
          {children}
        </ButtonContent>
      </Link>
    );
  }

  const { ...buttonRest } = rest as ButtonAsButtonProps;
  return (
    <button
      className={baseClasses}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      {...buttonRest}
    >
      <ButtonContent icon={icon} loading={loading} size={size}>
        {children}
      </ButtonContent>
    </button>
  );
}

export default Button;
