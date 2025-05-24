'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();


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
    <nav className="fixed top-0 left-0 w-full bg-[#0d1321] border-b border-[#00c2cb] z-50">
      <div className="flex items-center justify-between px-4 py-3">
        <Link href="/" className="flex-shrink-0 max-w-[120px] lg:max-w-[180px]">
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
        {/* Hamburger Button */}
        <button
          className="block lg:hidden text-white bg-[#00c2cb] rounded p-2 focus:outline-none focus:ring-2 focus:ring-[#00c2cb]"
          style={{position: 'absolute', right: 16, top: 12, zIndex: 9999}}
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
        </button>
        {/* Desktop Nav */}
        <div className="hidden lg:flex lg:items-center lg:space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`font-semibold transition hover:text-[#00c2cb] ${pathname === link.href ? 'text-[#00c2cb]' : 'text-white'}`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="block md:hidden bg-white border-t border-[#e2e8f0] w-full absolute left-0 top-full z-40 shadow-xl animate-fadeInDown">
          <ul className="flex flex-col space-y-2 px-4 py-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`block font-semibold py-2 px-2 rounded ${pathname === link.href ? 'text-[#00c2cb] bg-[#e6fafd]' : 'text-[#052438] hover:bg-[#f1f5f9] hover:text-[#00c2cb]'}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      <style jsx global>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInDown {
          animation: fadeInDown 0.25s ease;
        }
      `}</style>
    </nav>
  );
}