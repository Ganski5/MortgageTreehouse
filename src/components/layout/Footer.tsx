'use client';

import Link from 'next/link';

const BG_DARK = '#1e2533';
const TEXT_MUTED = '#9ca3af';
const PRIMARY = '#2d6a4f';
const ACCENT = '#f4a261';

interface FooterLinkProps {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}

function FooterLink({ href, children, external = false }: FooterLinkProps) {
  const baseStyle: React.CSSProperties = {
    color: TEXT_MUTED,
    textDecoration: 'none',
    fontSize: '0.9375rem',
    lineHeight: '1.6',
    transition: 'color 0.15s ease',
    display: 'block',
  };

  if (external) {
    return (
      <a
        href={href}
        style={baseStyle}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = '#4ade80')}
        onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = TEXT_MUTED)}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      href={href}
      style={baseStyle}
      onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = '#4ade80')}
      onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = TEXT_MUTED)}
    >
      {children}
    </Link>
  );
}

function FooterColumn({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {title && (
        <h3
          style={{
            color: '#f9fafb',
            fontWeight: 600,
            fontSize: '0.9375rem',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            margin: 0,
          }}
        >
          {title}
        </h3>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
        {children}
      </div>
    </div>
  );
}

function TreeHouseIconLight() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="15" y="24" width="6" height="8" rx="1" fill="#4ade80" opacity="0.85" />
      <polygon points="18,4 27,16 9,16" fill="#4ade80" opacity="0.5" />
      <polygon points="18,9 28,22 8,22" fill="#4ade80" opacity="0.7" />
      <rect x="13" y="13" width="10" height="8" rx="0.5" fill={ACCENT} />
      <polygon points="18,8 23,13 13,13" fill="#e07b3c" />
      <rect x="16.5" y="17" width="3" height="4" rx="0.5" fill={BG_DARK} />
      <rect x="14" y="14.5" width="2.5" height="2.5" rx="0.25" fill="#fff" opacity="0.75" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer style={{ backgroundColor: BG_DARK, color: TEXT_MUTED }}>
      {/* Main footer grid */}
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '3.5rem 1.5rem 2.5rem',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '2.5rem',
          }}
          className="footer-grid"
        >
          {/* Column 1: Brand */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Link
              href="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                textDecoration: 'none',
              }}
            >
              <TreeHouseIconLight />
              <span
                style={{
                  fontWeight: 700,
                  fontSize: '1.0625rem',
                  color: '#f9fafb',
                  letterSpacing: '-0.01em',
                  whiteSpace: 'nowrap',
                }}
              >
                Mortgage Treehouse
              </span>
            </Link>
            <p
              style={{
                color: TEXT_MUTED,
                fontSize: '0.9375rem',
                lineHeight: '1.65',
                margin: 0,
                maxWidth: '220px',
              }}
            >
              Mortgage education and tools for everyone.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.25rem' }}>
              <span
                style={{
                  display: 'inline-block',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: PRIMARY,
                }}
              />
              <span style={{ fontSize: '0.8125rem', color: TEXT_MUTED }}>
                Free tools. No sign-up required.
              </span>
            </div>
          </div>

          {/* Column 2: For Homebuyers */}
          <FooterColumn title="For Homebuyers">
            <FooterLink href="/homebuyers">Start Here</FooterLink>
            <FooterLink href="/learn/fha-basics">FHA Loans</FooterLink>
            <FooterLink href="/learn/va-basics">VA Loans</FooterLink>
            <FooterLink href="/learn/conventional-basics">Conventional Loans</FooterLink>
            <FooterLink href="/learn/mortgage-glossary">Mortgage Glossary</FooterLink>
          </FooterColumn>

          {/* Column 3: For Brokers */}
          <FooterColumn title="For Brokers">
            <FooterLink href="/calculators">Calculator Hub</FooterLink>
            <FooterLink href="/calculators/va-residual-income">VA Residual Income</FooterLink>
            <FooterLink href="/calculators/fha-streamline">FHA Streamline</FooterLink>
            <FooterLink href="/brokers">Broker Home</FooterLink>
          </FooterColumn>

          {/* Column 4: Company */}
          <FooterColumn title="Company">
            <FooterLink href="/about">About</FooterLink>
            <FooterLink href="/contact">Contact</FooterLink>
            <FooterLink href="/privacy">Privacy Policy</FooterLink>
            <FooterLink href="/terms">Terms of Use</FooterLink>
          </FooterColumn>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          borderTop: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.625rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.5rem',
            }}
          >
            <p style={{ margin: 0, fontSize: '0.875rem', color: TEXT_MUTED }}>
              &copy; 2026 Mortgage Treehouse. All rights reserved.
            </p>
            <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
              <FooterLink href="/privacy">Privacy Policy</FooterLink>
              <FooterLink href="/terms">Terms of Use</FooterLink>
            </div>
          </div>
          <p
            style={{
              margin: 0,
              fontSize: '0.8125rem',
              color: '#6b7280',
              lineHeight: '1.5',
              maxWidth: '780px',
            }}
          >
            <strong style={{ color: TEXT_MUTED, fontWeight: 600 }}>Mortgage Disclaimer:</strong>{' '}
            Results are estimates only and do not constitute financial advice or lending approval.
            All calculations are for informational purposes. Please consult a licensed mortgage
            professional before making financial decisions.
          </p>
        </div>
      </div>

      {/* Responsive grid styles */}
      <style>{`
        @media (max-width: 1024px) {
          .footer-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}
