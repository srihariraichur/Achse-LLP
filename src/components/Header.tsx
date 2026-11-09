/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Header component adhering strictly to the Top Bar Contract:
 * [Zone 1: Brand Wordmark] - [Zone 2: Clean single-line nav links] - [Zone 3: Primary Action]
 */

import React, { useState } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { Logo } from './Logo.tsx';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onRequestQuote: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onRequestQuote,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'products', label: 'Products & Capabilities' },
    { id: 'quality', label: 'Quality & Support' },
    { id: 'contact', label: 'Contact Us' },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 sm:gap-8 h-20 sm:h-22">
          {/* Zone 1: Brand Wordmark & Monogram */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center text-left focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-slate-900 rounded-sm"
          >
            <Logo variant="light" />
          </button>

          {/* Zone 2: Primary Nav Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-600">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative py-1 text-sm font-medium whitespace-nowrap shrink-0 transition-colors ${
                    isActive
                      ? 'text-[#0F2A4A] font-semibold'
                      : 'text-slate-600 hover:text-[#0F2A4A]'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0F2A4A] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Action & Admin Portal Direct Link */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {/* Direct Admin Login Button */}
            <a
              href="#admin/login"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-[#0F2A4A] hover:bg-slate-100 border border-slate-300 rounded transition-all cursor-pointer whitespace-nowrap"
              title="Access Admin Operations Portal"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span>Login</span>
            </a>

            <button
              onClick={onRequestQuote}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold tracking-wide uppercase text-white bg-[#0F2A4A] hover:bg-[#1E3A5F] active:bg-[#0A1D33] rounded transition-all shadow-xs whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>Request a Quote</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
            </button>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded focus:outline-hidden focus:ring-2 focus:ring-slate-400"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white shadow-lg animate-in fade-in duration-150">
          <div className="px-4 pt-3 pb-6 space-y-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`block w-full text-left px-3 py-2.5 text-base font-medium rounded transition-colors ${
                    isActive
                      ? 'bg-slate-100 text-[#0F2A4A] font-semibold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
            <div className="pt-4 border-t border-slate-100 mt-2 space-y-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onRequestQuote();
                }}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded text-sm font-semibold uppercase tracking-wider text-white bg-[#0F2A4A] hover:bg-[#1E3A5F] transition-colors"
              >
                <span>Request a Quote</span>
                <ArrowUpRight className="w-4 h-4 text-amber-400" />
              </button>

              <a
                href="#admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded text-xs font-semibold uppercase tracking-wider text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span>Login</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
