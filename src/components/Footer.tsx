/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Footer Component:
 * - Logo & short description
 * - Quick links (Home, About Us, Products & Capabilities, Quality & Support, Contact Us)
 * - Address, phone, email
 * - Copyright "© 2026 Achse LLP"
 */

import React from 'react';
import { Logo } from './Logo.tsx';
import { siteConfig, getWhatsAppUrl } from '../data/content.ts';
import { MapPin, Phone, Mail, ArrowUp, MessageCircle } from 'lucide-react';

interface FooterProps {
  onNavigate: (tabId: string) => void;
  onRequestQuote: () => void;
  onDownloadCatalogue: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onRequestQuote,
  onDownloadCatalogue,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0A1D33] text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Column 1: Brand & Description (Col span 5) */}
          <div className="lg:col-span-5 space-y-4">
            <Logo variant="footer" showTagline={true} />
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm mt-3">
              Pune-based precision engineering enterprise established in 2026. Supplying cold forging dies & gauges to customer drawing, standard & custom fastener solutions, and precision CNC machined components.
            </p>
            <div className="text-xs font-mono-spec text-slate-400 pt-2 space-y-1">
              <div>Base: Pune, Maharashtra, India</div>
            </div>
          </div>

          {/* Column 2: Quick Links (Col span 3) */}
          <div className="lg:col-span-3 space-y-3">
            <div className="text-xs font-mono-spec uppercase tracking-wider text-slate-200 font-bold">
              Navigation
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('products')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Products & Capabilities
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('quality')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Quality & Support
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Contact Us
                </button>
              </li>
              <li className="pt-2">
                <button
                  onClick={onDownloadCatalogue}
                  className="text-amber-400 hover:text-amber-300 font-medium transition-colors cursor-pointer"
                >
                  Download Product Catalogues (PDF)
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Desk (Col span 4) */}
          <div className="lg:col-span-4 space-y-3">
            <div className="text-xs font-mono-spec uppercase tracking-wider text-slate-200 font-bold">
              Pune Engineering Desk
            </div>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span className="font-mono-spec">{siteConfig.address}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <a
                  href={`tel:${siteConfig.phone.replace(/[^0-9+]/g, '')}`}
                  className="font-mono-spec hover:text-amber-400 transition-colors"
                >
                  {siteConfig.phone}
                </a>
              </div>
              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span className="font-mono-spec">{siteConfig.email}</span>
              </div>
            </div>

            <div className="pt-3 flex flex-wrap items-center gap-2">
              <button
                onClick={onRequestQuote}
                className="px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider text-slate-900 bg-amber-400 hover:bg-amber-300 transition-colors cursor-pointer"
              >
                Request Quotation
              </button>
              <a
                href={getWhatsAppUrl("Hello Achse LLP, I would like to inquire about your engineering tooling and fastener supply.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded text-xs font-semibold uppercase tracking-wider text-white bg-[#25D366] hover:bg-[#20BD5A] transition-colors cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-white" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar: Copyright & Back to Top */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 Achse LLP. All rights reserved.
          </div>
          <div className="flex items-center gap-4 sm:gap-6">
            <span>Precision Engineering · Pune, India</span>
            <a
              href="#admin/login"
              className="text-slate-500 hover:text-amber-400 text-xs transition-colors cursor-pointer"
            >
              Admin Login
            </a>
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Scroll back to top"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
