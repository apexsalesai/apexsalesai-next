'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Handle scroll events to apply styles when scrolled
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/platform', label: 'Platform' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/consulting', label: 'Consulting' },
    { href: '/demo', label: 'Demo' },
    { href: '/reseller', label: 'Reseller' },
    { href: '/onboarding', label: 'Onboarding' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact' }
  ];

  return (
    <nav className={`navbar transition-all duration-300 z-[100] fixed w-full top-0 left-0 border-b border-[#00c2cb] bg-[#0d1321] ${scrolled ? 'py-2 shadow-lg' : 'py-4'}`} style={{zIndex: 100, overflow: 'visible'}}>
  <div className="container mx-auto flex items-center justify-between px-4">
    <Link href="/" className="flex-shrink-0 max-w-[120px]">
      <Image
        src="/images/apex-logo-white.png"
        alt="ApexSalesAI"
        width={120}
        height={36}
        className="h-9 w-auto"
        priority
        onError={(e: any) => { e.target.src = '/images/placeholder.svg'; }}
      />
    </Link>
    {/* Desktop Navigation */}
    <div className="hidden md:flex">
      <ul className="flex space-x-6">
        {navLinks.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={`font-semibold transition hover:text-[#00c2cb] ${
                pathname === link.href ? 'text-[#00c2cb]' : 'text-white'
              }`}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  </div>
  {/* Mobile Menu Button - always visible, absolute top right */}
  <button
    className="md:hidden fixed top-4 right-4 text-white bg-[#00c2cb] rounded-full p-3 shadow-lg border-2 border-[#2d3748] z-[200] focus:outline-none focus:ring-2 focus:ring-[#00c2cb]"
    style={{zIndex: 200}}
    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
    aria-label="Open navigation menu"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-8 w-8"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d={mobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
      />
    </svg>
    <span className="sr-only">Menu</span>
  </button>

      {/* Mobile Navigation Menu & Backdrop */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black bg-opacity-60 z-40" onClick={() => setMobileMenuOpen(false)} />
          <div className="md:hidden bg-[#0d1321] border-t border-[#2d3748] py-4 fixed top-16 left-0 w-full z-50 animate-fadeInDown shadow-xl">
            <div className="container mx-auto px-4">
              <ul className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`block font-semibold py-2 ${
  pathname === link.href ? 'text-[#00c2cb]' : 'text-white'
}`}
  onClick={() => setMobileMenuOpen(false)}
>
  {link.label}
</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
    </nav>

<style jsx global>{`
  @keyframes fadeInDown {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fadeInDown {
    animation: fadeInDown 0.25s ease;
  }
`}</style>
  );
}