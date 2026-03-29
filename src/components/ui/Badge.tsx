import React, { ReactNode } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type BadgeVariant = "green" | "amber" | "blue" | "gray" | "success" | "danger";
type BadgeSize = "sm" | "md";

export interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}

// ─── Style maps ───────────────────────────────────────────────────────────────

const variantClasses: Record<BadgeVariant, string> = {
  green:
    "bg-[#d1fae5] text-[#065f46] ring-1 ring-inset ring-[#a7f3d0]",
  amber:
    "bg-[#fef3c7] text-[#92400e] ring-1 ring-inset ring-[#fde68a]",
  blue:
    "bg-[#dbeafe] text-[#1e40af] ring-1 ring-inset ring-[#bfdbfe]",
  gray:
    "bg-[#f3f4f6] text-[#374151] ring-1 ring-inset ring-[#e5e7eb]",
  success:
    "bg-[#d1fae5] text-[#065f46] ring-1 ring-inset ring-[#6ee7b7]",
  danger:
    "bg-[#fee2e2] text-[#991b1b] ring-1 ring-inset ring-[#fca5a5]",
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: "text-xs px-2 py-0.5 gap-1 rounded-md",
  md: "text-sm px-2.5 py-1 gap-1.5 rounded-lg",
};

const iconSizeClasses: Record<BadgeSize, string> = {
  sm: "w-3 h-3",
  md: "w-3.5 h-3.5",
};

// ─── Component ────────────────────────────────────────────────────────────────

export function Badge({
  variant = "gray",
  size = "md",
  icon,
  children,
  className = "",
}: BadgeProps) {
  const classes = [
    "inline-flex items-center font-medium whitespace-nowrap",
    variantClasses[variant],
    sizeClasses[size],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={classes}>
      {icon && (
        <span
          className={`shrink-0 ${iconSizeClasses[size]} flex items-center justify-center`}
          aria-hidden="true"
        >
          {icon}
        </span>
      )}
      {children}
    </span>
  );
}

export default Badge;
