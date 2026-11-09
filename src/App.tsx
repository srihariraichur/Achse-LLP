/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * ACHSE LLP — Corporate Application Root
 * Production-quality, multi-page, responsive corporate engineering portal.
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { Hero } from './components/Hero.tsx';
import { 
  WhyAchseSection, 
  IndustriesSection, 
  FeaturedProductsSection, 
  CtaBand 
} from './components/HomeSections.tsx';
import { AboutSection } from './components/AboutSection.tsx';
import { ProductsSection, ProductSubTab } from './components/ProductsSection.tsx';
import { QualitySection } from './components/QualitySection.tsx';
import { ContactSection } from './components/ContactSection.tsx';
import { Footer } from './components/Footer.tsx';
import { QuoteModal } from './components/QuoteModal.tsx';
import { CatalogueModal } from './components/CatalogueModal.tsx';
import { NotFound } from './components/NotFound.tsx';
import { ProductItem } from './data/content.ts';
import { WhatsAppWidget } from './components/WhatsAppWidget.tsx';
import { FaqSection } from './components/FaqSection.tsx';
import { ArrowUpRight } from 'lucide-react';

import { AdminPortal } from './admin/AdminPortal.tsx';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedProductSubTab, setSelectedProductSubTab] = useState<ProductSubTab>('tools-gauges');
  const [quoteModalOpen, setQuoteModalOpen] = useState<boolean>(false);
  const [catalogueModalOpen, setCatalogueModalOpen] = useState<boolean>(false);
  const [selectedProductForQuote, setSelectedProductForQuote] = useState<{
    name: string;
    category: string;
  } | null>(null);

  // Admin route status
  const [isAdminRoute, setIsAdminRoute] = useState<boolean>(false);
  const [adminSubRoute, setAdminSubRoute] = useState<string>('dashboard');

  // Sync tab with browser hash and pathname on load and hashchange
  useEffect(() => {
    const handleRouteCheck = () => {
      const pathname = window.location.pathname.toLowerCase();
      const rawHash = window.location.hash.replace('#', '').toLowerCase();

      // Check if accessing admin via pathname or hash
      if (pathname.startsWith('/admin') || rawHash.startsWith('admin')) {
        setIsAdminRoute(true);
        if (pathname.includes('/login') || rawHash.includes('login')) {
          setAdminSubRoute('login');
        } else if (pathname.includes('/rfqs') || rawHash.includes('rfqs')) {
          setAdminSubRoute('rfqs');
        } else if (pathname.includes('/contacts') || rawHash.includes('contacts')) {
          setAdminSubRoute('contacts');
        } else {
          setAdminSubRoute('dashboard');
        }
        return;
      }

      setIsAdminRoute(false);

      const routeKey = rawHash || (pathname !== '/' ? pathname.replace('/', '') : 'home');

      if (['home', 'about', 'products', 'quality', 'contact'].includes(routeKey)) {
        setActiveTab(routeKey);
      } else if (routeKey === 'fasteners' || routeKey === 'products-fasteners') {
        setSelectedProductSubTab('fasteners');
        setActiveTab('products');
      } else if (routeKey === 'automotive' || routeKey === 'products-machined' || routeKey === 'machined') {
        setSelectedProductSubTab('automotive');
        setActiveTab('products');
      } else if (routeKey === 'tools-gauges' || routeKey === 'products-dies') {
        setSelectedProductSubTab('tools-gauges');
        setActiveTab('products');
      } else if (routeKey === 'consultant') {
        setSelectedProductSubTab('consultant');
        setActiveTab('products');
      } else {
        // Unknown route triggers 404 view
        setActiveTab('404');
      }
    };

    handleRouteCheck();
    window.addEventListener('hashchange', handleRouteCheck);
    window.addEventListener('popstate', handleRouteCheck);
    return () => {
      window.removeEventListener('hashchange', handleRouteCheck);
      window.removeEventListener('popstate', handleRouteCheck);
    };
  }, []);

  // Update dynamic robots meta tag & title: noindex, nofollow for admin
  useEffect(() => {
    let robotsMeta = document.querySelector('meta[name="robots"]');
    if (!robotsMeta) {
      robotsMeta = document.createElement('meta');
      robotsMeta.setAttribute('name', 'robots');
      document.head.appendChild(robotsMeta);
    }

    if (isAdminRoute) {
      robotsMeta.setAttribute('content', 'noindex, nofollow');
      document.title = 'ACHSE LLP Admin Portal — Operations Console';
    } else {
      robotsMeta.setAttribute('content', 'index, follow');
    }
  }, [isAdminRoute]);

  // Update dynamic page title for SEO based on active view
  useEffect(() => {
    const titles: Record<string, string> = {
      home: "ACHSE LLP | Cold Forging Tooling, Dies & Gauges, Fasteners | Pune",
      about: "About ACHSE LLP | Pune Precision Engineering Enterprise (Est. 2026)",
      products: "Products & Capabilities | Cold Forging Dies, Gauges & Fasteners | ACHSE LLP",
      quality: "Quality & Support | Gauge Verification & Tooling Design | ACHSE LLP",
      contact: "Contact ACHSE LLP | Request Tooling & Fastener Quotation | Pune Desk",
    };
    if (titles[activeTab]) {
      document.title = titles[activeTab];
    }
  }, [activeTab]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    window.location.hash = tabId;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenQuoteModal = (product?: ProductItem | { name: string; category: string }) => {
    if (product) {
      setSelectedProductForQuote(product);
    } else {
      setSelectedProductForQuote(null);
    }
    setQuoteModalOpen(true);
  };

  const handleSelectPillar = (sectionId: string) => {
    if (
      sectionId === 'automotive' ||
      sectionId === 'products-machined' ||
      sectionId === 'machined' ||
      sectionId.includes('automotive') ||
      sectionId.includes('machined')
    ) {
      setSelectedProductSubTab('automotive');
    } else if (
      sectionId === 'fasteners' ||
      sectionId === 'products-fasteners' ||
      sectionId.includes('fastener')
    ) {
      setSelectedProductSubTab('fasteners');
    } else if (
      sectionId === 'consultant' ||
      sectionId.includes('consultant')
    ) {
      setSelectedProductSubTab('consultant');
    } else {
      setSelectedProductSubTab('tools-gauges');
    }
    setActiveTab('products');
    window.location.hash = 'products';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Render protected Admin Portal if navigating /admin or #admin
  if (isAdminRoute) {
    return (
      <AdminPortal
        initialSubRoute={adminSubRoute}
        onReturnToSite={() => {
          setIsAdminRoute(false);
          window.location.hash = 'home';
          if (window.location.pathname.startsWith('/admin')) {
            window.history.pushState({}, '', '/');
          }
        }}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A] relative overflow-x-clip selection:bg-[#0F2A4A] selection:text-white">
      {/* Sticky Top Bar Contract */}
      <Header
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        onRequestQuote={() => handleOpenQuoteModal()}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <>
            <Hero
              onRequestQuote={() => handleOpenQuoteModal()}
              onDownloadCatalogue={() => setCatalogueModalOpen(true)}
              onSelectPillar={handleSelectPillar}
            />
            <WhyAchseSection />
            <IndustriesSection />
            <FeaturedProductsSection
              onEnquireProduct={(prod) => handleOpenQuoteModal(prod)}
              onRequestQuote={() => handleOpenQuoteModal()}
              onViewAllProducts={(targetTab) => {
                if (targetTab) {
                  setSelectedProductSubTab(targetTab as ProductSubTab);
                }
                handleTabChange('products');
              }}
            />
            <FaqSection onRequestQuote={() => handleOpenQuoteModal()} />
            <CtaBand onRequestQuote={() => handleOpenQuoteModal()} />
          </>
        )}

        {activeTab === 'about' && (
          <AboutSection
            onRequestQuote={() => handleOpenQuoteModal()}
            onExploreProducts={() => handleTabChange('products')}
          />
        )}

        {activeTab === 'products' && (
          <ProductsSection
            onEnquireProduct={(prod) => handleOpenQuoteModal(prod)}
            onRequestQuote={() => handleOpenQuoteModal()}
            initialSubTab={selectedProductSubTab}
            onDownloadCatalogue={() => setCatalogueModalOpen(true)}
          />
        )}

        {activeTab === 'quality' && (
          <QualitySection onRequestQuote={() => handleOpenQuoteModal()} />
        )}

        {activeTab === 'contact' && (
          <ContactSection />
        )}

        {!['home', 'about', 'products', 'quality', 'contact'].includes(activeTab) && (
          <NotFound onGoHome={() => handleTabChange('home')} />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleTabChange}
        onRequestQuote={() => handleOpenQuoteModal()}
        onDownloadCatalogue={() => setCatalogueModalOpen(true)}
      />

      {/* Floating "Request a Quote" CTA on Mobile (<768px) */}
      <div className="fixed bottom-0 left-0 right-0 p-3 bg-white/95 backdrop-blur-md border-t border-slate-200 z-30 sm:hidden shadow-lg flex items-center justify-between gap-3">
        <div className="text-left">
          <div className="text-[10px] font-mono-spec uppercase text-slate-500 font-semibold leading-tight">Need a Quote?</div>
          <div className="text-xs font-bold text-[#0F2A4A] truncate max-w-[170px]">ACHSE Pune Desk</div>
        </div>
        <button
          onClick={() => handleOpenQuoteModal()}
          className="flex-1 py-2.5 px-4 rounded text-xs font-semibold uppercase tracking-wider text-white bg-[#0F2A4A] active:bg-slate-900 flex items-center justify-center gap-1.5 shadow-sm whitespace-nowrap"
        >
          <span>Request a Quote</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
        </button>
      </div>

      {/* Floating WhatsApp Quick-Chat Widget */}
      <WhatsAppWidget />

      {/* Quotation Request Modal */}
      <QuoteModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        initialProduct={selectedProductForQuote}
      />

      {/* Catalogue Download Modal */}
      <CatalogueModal
        isOpen={catalogueModalOpen}
        onClose={() => setCatalogueModalOpen(false)}
        onRequestQuote={() => {
          setCatalogueModalOpen(false);
          handleOpenQuoteModal();
        }}
      />
    </div>
  );
}
