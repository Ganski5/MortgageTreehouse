import React, { ReactNode } from "react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

type CardVariant = "default" | "featured" | "highlight";
type CardPadding = "sm" | "md" | "lg";

export interface CardProps {
  variant?: CardVariant;
  padding?: CardPadding;
  title?: string;
  description?: string;
  icon?: ReactNode;
  href?: string;
  children?: ReactNode;
  className?: string;
}

// ─── Style maps ───────────────────────────────────────────────────────────────

const variantClasses: Record<CardVariant, string> = {
  default: "bg-white border border-[#e5e7eb] shadow-sm",
  featured: "bg-white border-l-4 border-l-[#2d6a4f] border border-[#e5e7eb] shadow-sm",
  highlight: "bg-[#edf7f1] border border-[#c3e6d0]",
};

const paddingClasses: Record<CardPadding, string> = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

const hoverClasses =
  "hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 ease-in-out";

// ─── Inner card layout ────────────────────────────────────────────────────────

function CardInner({
  icon,
  title,
  description,
  children,
}: Pick<CardProps, "icon" | "title" | "description" | "children">) {
  return (
    <>
      {icon && (
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#2d6a4f]/10 text-[#2d6a4f]">
          {icon}
        </div>
      )}
      {title && (
        <h3 className="mb-1 text-lg font-semibold leading-snug text-gray-900">
          {title}
        </h3>
      )}
      {description && (
        <p className="text-sm leading-relaxed text-gray-600">{description}</p>
      )}
      {children}
    </>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Card({
  variant = "default",
  padding = "md",
  title,
  description,
  icon,
  href,
  children,
  className = "",
}: CardProps) {
  const baseClasses = [
    "rounded-xl",
    variantClasses[variant],
    paddingClasses[padding],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (href) {
    return (
      <Link
        href={href}
        className={`${baseClasses} block cursor-pointer ${hoverClasses} focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2d6a4f] focus-visible:ring-offset-2`}
      >
        <CardInner icon={icon} title={title} description={description}>
          {children}
        </CardInner>
      </Link>
    );
  }

  return (
    <div className={baseClasses}>
      <CardInner icon={icon} title={title} description={description}>
        {children}
      </CardInner>
    </div>
  );
}

export default Card;
