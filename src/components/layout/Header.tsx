'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Homebuyers', href: '/homebuyers' },
  { label: 'Brokers', href: '/brokers' },
  { label: 'Calculators', href: '/calculators' },
  { label: 'Learn', href: '/learn' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

function TreeHouseIcon() {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Tree trunk */}
      <rect x="15" y="24" width="6" height="8" rx="1" fill="#2d6a4f" />
      {/* Tree canopy layers */}
      <polygon points="18,4 27,16 9,16" fill="#2d6a4f" opacity="0.75" />
      <polygon points="18,9 28,22 8,22" fill="#2d6a4f" opacity="0.9" />
      {/* House on top of canopy */}
      <rect x="13" y="13" width="10" height="8" rx="0.5" fill="#f4a261" />
      <polygon points="18,8 23,13 13,13" fill="#e07b3c" />
      {/* Door */}
      <rect x="16.5" y="17" width="3" height="4" rx="0.5" fill="#2d6a4f" />
      {/* Window */}
      <rect x="14" y="14.5" width="2.5" height="2.5" rx="0.25" fill="#fff" opacity="0.85" />
    </svg>
  );
}

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e5e7eb',
        boxShadow: scrolled ? '0 2px 12px 0 rgba(0,0,0,0.08)' : 'none',
        transition: 'box-shadow 0.2s ease',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 1.5rem',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            textDecoration: 'none',
            flexShrink: 0,
          }}
        >
          <TreeHouseIcon />
          <span
            style={{
              fontWeight: 700,
              fontSize: '1.125rem',
              color: '#2d6a4f',
              letterSpacing: '-0.01em',
              whiteSpace: 'nowrap',
            }}
          >
            Mortgage Treehouse
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav
          aria-label="Primary navigation"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
          }}
          className="hidden md:flex"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                padding: '0.375rem 0.75rem',
                borderRadius: '0.375rem',
                fontSize: '0.9375rem',
                fontWeight: isActive(link.href) ? 600 : 400,
                color: isActive(link.href) ? '#2d6a4f' : '#374151',
                backgroundColor: isActive(link.href) ? '#d1fae5' : 'transparent',
                textDecoration: 'none',
                transition: 'background-color 0.15s ease, color 0.15s ease',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                if (!isActive(link.href)) {
                  (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#f3f4f6';
                  (e.currentTarget as HTMLAnchorElement).style.color = '#2d6a4f';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive(link.href)) {
                  (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'transparent';
                  (e.currentTarget as HTMLAnchorElement).style.color = '#374151';
                }
              }}
            >
              {link.label}
            </Link>
          ))}

          <Link
            href="/homebuyers"
            style={{
              marginLeft: '0.75rem',
              padding: '0.5rem 1.125rem',
              borderRadius: '0.5rem',
              backgroundColor: '#f4a261',
              color: '#ffffff',
              fontWeight: 600,
              fontSize: '0.9375rem',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              transition: 'background-color 0.15s ease, transform 0.1s ease',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#e07b3c';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#f4a261';
            }}
          >
            Get Started
          </Link>
        </nav>

        {/* Mobile: Get Started + Hamburger */}
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}
          className="flex md:hidden"
        >
          <Link
            href="/homebuyers"
            style={{
              padding: '0.4375rem 0.875rem',
              borderRadius: '0.5rem',
              backgroundColor: '#f4a261',
              color: '#ffffff',
              fontWeight: 600,
              fontSize: '0.875rem',
              textDecoration: 'none',
            }}
          >
            Get Started
          </Link>

          <button
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            onClick={() => setMobileOpen((prev) => !prev)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '5px',
              width: '40px',
              height: '40px',
              borderRadius: '0.375rem',
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              padding: '0.375rem',
            }}
          >
            <span
              style={{
                display: 'block',
                width: '22px',
                height: '2px',
                backgroundColor: '#374151',
                borderRadius: '2px',
                transformOrigin: 'center',
                transform: mobileOpen ? 'translateY(7px) rotate(45deg)' : 'none',
                transition: 'transform 0.2s ease',
              }}
            />
            <span
              style={{
                display: 'block',
                width: '22px',
                height: '2px',
                backgroundColor: '#374151',
                borderRadius: '2px',
                opacity: mobileOpen ? 0 : 1,
                transition: 'opacity 0.2s ease',
              }}
            />
            <span
              style={{
                display: 'block',
                width: '22px',
                height: '2px',
                backgroundColor: '#374151',
                borderRadius: '2px',
                transformOrigin: 'center',
                transform: mobileOpen ? 'translateY(-7px) rotate(-45deg)' : 'none',
                transition: 'transform 0.2s ease',
              }}
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        id="mobile-menu"
        role="navigation"
        aria-label="Mobile navigation"
        style={{
          overflow: 'hidden',
          maxHeight: mobileOpen ? '480px' : '0',
          transition: 'max-height 0.3s ease',
          borderTop: mobileOpen ? '1px solid #e5e7eb' : 'none',
          backgroundColor: '#ffffff',
        }}
        className="md:hidden"
      >
        <nav
          style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '0.75rem 1.5rem 1rem',
            gap: '0.125rem',
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                padding: '0.75rem 0.875rem',
                borderRadius: '0.375rem',
                fontSize: '1rem',
                fontWeight: isActive(link.href) ? 600 : 400,
                color: isActive(link.href) ? '#2d6a4f' : '#374151',
                backgroundColor: isActive(link.href) ? '#d1fae5' : 'transparent',
                textDecoration: 'none',
                borderLeft: isActive(link.href) ? '3px solid #2d6a4f' : '3px solid transparent',
                transition: 'background-color 0.15s ease',
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
