/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Products & Capabilities Section:
 * 4 Categories as requested:
 * 1. Cold Forging Tools & Gauges (Source: Cold Forging Dies & Gauges Catalogue)
 * 2. Fasteners Solution (Source: Fasteners Catalogue)
 * 3. Automotive Components (Source: Automotive Components Catalogue)
 * 4. Cold foraging Design Consultant (Source: Engineering Profile & Process Consulting)
 */

import React, { useState, useEffect } from 'react';
import { 
  Globe2, 
  Cpu, 
  Layers, 
  ArrowRight, 
  FileCheck2, 
  SlidersHorizontal,
  PenTool,
  Boxes,
  HelpCircle,
  MessageCircle,
  Download,
  CheckCircle2,
  Wrench,
  ShieldCheck,
  FileText,
  Workflow
} from 'lucide-react';
import { 
  coldForgingCatalogue, 
  fastenersCatalogueData,
  automotiveCatalogueData,
  coldForgingConsultantData,
  specialToolsHighlight,
  qualityAndSupport,
  getWhatsAppUrl,
  ProductItem 
} from '../data/content.ts';
import { ProductSchematic, ColdForgingSequenceDiagram } from './TechnicalVisuals.tsx';

export type ProductSubTab = 'tools-gauges' | 'fasteners' | 'automotive' | 'consultant';

interface ProductsSectionProps {
  onEnquireProduct: (product: { name: string; category: string }) => void;
  onRequestQuote: () => void;
  initialSubTab?: ProductSubTab;
  onDownloadCatalogue?: (catalogueType?: string) => void;
}

export const ProductsSection: React.FC<ProductsSectionProps> = ({
  onEnquireProduct,
  onRequestQuote,
  initialSubTab = 'tools-gauges',
  onDownloadCatalogue,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<ProductSubTab>(initialSubTab);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'all' | 'dies' | 'gauges'>('all');
  const [toolingViewModes, setToolingViewModes] = useState<Record<string, 'photo' | 'cad'>>({});

  useEffect(() => {
    if (initialSubTab) {
      setActiveSubTab(initialSubTab);
    }
  }, [initialSubTab]);

  const filteredTooling = coldForgingCatalogue.filter((item) => {
    if (activeCategoryFilter === 'all') return true;
    return item.category === activeCategoryFilter;
  });

  return (
    <div className="py-12 bg-white">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="border-b border-slate-200 pb-8">
          <div className="text-xs font-mono-spec uppercase tracking-wider text-amber-600 font-semibold">
            Capabilities & Catalogues
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F2A4A] mt-1 tracking-tight">
            Production & Engineering Capabilities
          </h1>
          <p className="text-base text-slate-600 mt-2 max-w-3xl leading-relaxed">
            Supplying precision cold forging dies & gauges, engineered fasteners, automotive components, and expert cold forging process consultancy to customer blueprints.
          </p>

          {/* 4 Core Category Tabs as specified */}
          <div className="mt-6 sm:mt-8 flex overflow-x-auto sm:flex-wrap items-center gap-2 border-b border-slate-200 pt-2 pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
            <button
              onClick={() => setActiveSubTab('tools-gauges')}
              className={`px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer border-b-2 whitespace-nowrap flex items-center gap-2 ${
                activeSubTab === 'tools-gauges'
                  ? 'border-[#0F2A4A] text-[#0F2A4A] bg-slate-50 font-bold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>1. Cold Forging Tools & Gauges</span>
            </button>
            <button
              onClick={() => setActiveSubTab('fasteners')}
              className={`px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer border-b-2 whitespace-nowrap flex items-center gap-2 ${
                activeSubTab === 'fasteners'
                  ? 'border-[#0F2A4A] text-[#0F2A4A] bg-slate-50 font-bold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>2. Fasteners Solution</span>
            </button>
            <button
              onClick={() => setActiveSubTab('automotive')}
              className={`px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer border-b-2 whitespace-nowrap flex items-center gap-2 ${
                activeSubTab === 'automotive'
                  ? 'border-[#0F2A4A] text-[#0F2A4A] bg-slate-50 font-bold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>3. Automotive Components</span>
            </button>
            <button
              onClick={() => setActiveSubTab('consultant')}
              className={`px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer border-b-2 whitespace-nowrap flex items-center gap-2 ${
                activeSubTab === 'consultant'
                  ? 'border-[#0F2A4A] text-[#0F2A4A] bg-slate-50 font-bold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              <span>4. Cold Forging Consultation &amp; Training</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ============================================================== */}
        {/* 1. COLD FORGING TOOLS & GAUGES                                 */}
        {/* ============================================================== */}
        {activeSubTab === 'tools-gauges' && (
          <div className="space-y-12">
            {/* Header Banner & PDF Download */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono-spec uppercase text-amber-700 font-semibold tracking-wider">
                  Category 01 · Cold Forging Dies & Precision Gauges
                </span>
                <h2 className="text-2xl font-extrabold text-[#0F2A4A] mt-1">
                  Cold Forging Tools & Gauges
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
                  Supplied strictly to your drawing and technical specification. All tooling and gauges are inspected with calibrated reference standards prior to dispatch.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <a
                  href="/assets/aistudio/Achse_Cold_Forging_Dies_and_Gauges_Catalogue_2d07b4cb.pdf"
                  download="Achse_Cold_Forging_Dies_and_Gauges_Catalogue.pdf"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded text-xs font-semibold uppercase tracking-wider text-white bg-[#0F2A4A] hover:bg-[#1E3A5F] transition-colors shadow-xs"
                >
                  <Download className="w-4 h-4 text-amber-400" />
                  <span>Download Catalogue (PDF)</span>
                </a>
              </div>
            </div>

            {/* Filter Buttons for Dies vs Gauges */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono-spec uppercase text-slate-500 mr-1">Filter Range:</span>
                <button
                  onClick={() => setActiveCategoryFilter('all')}
                  className={`px-3 py-1.5 text-xs font-medium rounded transition-colors cursor-pointer ${
                    activeCategoryFilter === 'all'
                      ? 'bg-[#0F2A4A] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  All Tooling & Gauges ({coldForgingCatalogue.length})
                </button>
                <button
                  onClick={() => setActiveCategoryFilter('dies')}
                  className={`px-3 py-1.5 text-xs font-medium rounded transition-colors cursor-pointer ${
                    activeCategoryFilter === 'dies'
                      ? 'bg-[#0F2A4A] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Cold Forging Dies ({coldForgingCatalogue.filter(p => p.category === 'dies').length})
                </button>
                <button
                  onClick={() => setActiveCategoryFilter('gauges')}
                  className={`px-3 py-1.5 text-xs font-medium rounded transition-colors cursor-pointer ${
                    activeCategoryFilter === 'gauges'
                      ? 'bg-[#0F2A4A] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Precision Gauges ({coldForgingCatalogue.filter(p => p.category === 'gauges').length})
                </button>
              </div>

              <div className="text-xs font-mono-spec text-slate-500">
                Showing {filteredTooling.length} verified catalogue items
              </div>
            </div>

            {/* Product Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTooling.map((product) => (
                <div
                  key={product.id}
                  className="bg-white border border-slate-200 rounded-md overflow-hidden hover:border-[#0F2A4A] hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Real Industrial Photo with CAD Blueprint Toggle */}
                    <div className="relative">
                      {toolingViewModes[product.id] !== 'cad' && product.image ? (
                        <div className={`relative h-48 overflow-hidden border-b border-slate-200 group/img ${
                          product.image.includes('Cut-off-Knife') || product.image.includes('Precision_Go_No-Go') || product.image.includes('plain_ring_gauges') || product.image.includes('thread-plug-gauge') || product.image.includes('slip_gauges') ? 'bg-white' : 'bg-slate-900'
                        }`}>
                          <img
                            src={product.image}
                            alt={product.name}
                            loading="lazy"
                            className={`w-full h-full transition-transform duration-500 group-hover/img:scale-105 ${
                              product.image.endsWith('.png') || product.image.includes('plain_ring_gauges') || product.image.includes('thread-plug-gauge') || product.image.includes('slip_gauges')
                                ? 'object-contain p-3.5'
                                : product.image.includes('Cut-off-Knife')
                                ? 'object-contain p-2'
                                : 'object-cover'
                            }`}
                          />
                          <div className={`absolute inset-0 pointer-events-none ${
                            product.image.includes('Cut-off-Knife') || product.image.includes('Precision_Go_No-Go') || product.image.includes('plain_ring_gauges') || product.image.includes('thread-plug-gauge') || product.image.includes('slip_gauges')
                              ? 'bg-gradient-to-t from-slate-950/70 via-transparent to-slate-900/10'
                              : 'bg-gradient-to-t from-slate-950/70 via-transparent to-black/20'
                          }`} />
                          <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-xs text-[10px] font-mono-spec text-amber-400 px-2 py-0.5 rounded border border-white/10 uppercase tracking-widest">
                            {product.category === 'dies' ? 'Cold Forging Die' : 'Inspection Gauge'}
                          </div>
                          <button
                            type="button"
                            onClick={() => setToolingViewModes(prev => ({ ...prev, [product.id]: 'cad' }))}
                            className="absolute top-2.5 right-2.5 bg-slate-900/80 hover:bg-[#0F2A4A] text-white text-[10px] font-mono-spec px-2 py-0.5 rounded border border-white/20 transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
                            title="Switch to CAD Blueprint schematic"
                          >
                            <span>CAD View</span>
                          </button>
                          <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[10px] font-mono-spec text-slate-300 pointer-events-none">
                            <span>TOL: ±0.002 mm</span>
                            <span className="text-amber-300 font-semibold uppercase">ACHSE QUALITY</span>
                          </div>
                        </div>
                      ) : (
                        <div className="relative">
                          <ProductSchematic productId={product.id} category={product.category} className="h-48" />
                          <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-xs text-[10px] font-mono-spec text-amber-400 px-2 py-0.5 rounded border border-white/10 uppercase tracking-widest">
                            {product.category === 'dies' ? 'Cold Forging Die' : 'Inspection Gauge'}
                          </div>
                          {product.image && (
                            <button
                              type="button"
                              onClick={() => setToolingViewModes(prev => ({ ...prev, [product.id]: 'photo' }))}
                              className="absolute top-2.5 right-2.5 bg-slate-900/80 hover:bg-[#0F2A4A] text-white text-[10px] font-mono-spec px-2 py-0.5 rounded border border-white/20 transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
                              title="Switch to Real Photo view"
                            >
                              <span>Photo View</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      <div className="flex items-center justify-between text-[11px] font-mono-spec text-slate-500 mb-1">
                        <span className="text-amber-700 font-semibold uppercase">{product.subcategory}</span>
                        <span>To Drawing</span>
                      </div>

                      <h3 className="text-lg font-bold text-[#0F2A4A] tracking-tight">
                        {product.name}
                      </h3>

                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                        {product.shortDesc}
                      </p>

                      {/* Specifications List */}
                      <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                        <div className="text-[10px] font-mono-spec uppercase tracking-wider text-slate-400 font-semibold">
                          Key Specifications
                        </div>
                        {product.specifications.map((spec, sIdx) => (
                          <div key={sIdx} className="flex items-start justify-between text-xs py-0.5">
                            <span className="text-slate-500 text-[11px]">{spec.label}</span>
                            <span className="font-mono-spec text-slate-800 text-right text-[11px] font-medium max-w-[55%]">
                              {spec.value}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Application note */}
                      <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
                        <span className="font-semibold text-slate-700">Application: </span>
                        {product.application}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0 flex items-center gap-2">
                    <button
                      onClick={() => onEnquireProduct({ name: product.name, category: "Cold Forging Tools & Gauges" })}
                      className="flex-1 py-2.5 px-3 rounded text-xs font-semibold uppercase tracking-wider text-[#0F2A4A] bg-slate-100 hover:bg-[#0F2A4A] hover:text-white transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5"
                    >
                      <span>Enquire</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <a
                      href={getWhatsAppUrl(`Hello Achse LLP, I would like to inquire about ${product.name} (${product.subcategory}).`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Quick Inquiry on WhatsApp"
                      className="p-2.5 rounded bg-emerald-50 hover:bg-[#25D366] text-emerald-700 hover:text-white border border-emerald-200 hover:border-[#25D366] transition-colors cursor-pointer shrink-0"
                    >
                      <MessageCircle className="w-4 h-4 fill-current" />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* HIGHLIGHTED BLOCK 1: Special Tools on Request */}
            <div className="bg-[#0F2A4A] text-white rounded-lg p-5 sm:p-8 relative overflow-hidden border border-slate-700">
              <div className="absolute inset-0 bg-blueprint-dark opacity-40 pointer-events-none" />
              <div className="relative z-10 max-w-4xl">
                <div className="flex items-center gap-2 text-xs font-mono-spec text-amber-400 uppercase tracking-widest font-semibold">
                  <Globe2 className="w-4 h-4" />
                  <span>Global Partner Sourcing</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mt-1.5 tracking-tight">
                  {specialToolsHighlight.title}
                </h3>
                <p className="text-slate-300 text-sm sm:text-base mt-2 leading-relaxed">
                  {specialToolsHighlight.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6 pt-6 border-t border-slate-700">
                  {specialToolsHighlight.benefits.map((benefit, bIdx) => (
                    <div key={bIdx} className="flex items-start gap-2 text-xs text-slate-200">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
                  <button
                    onClick={() => onEnquireProduct({ name: "Special Tools (Global Supply)", category: "Special Tools" })}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded text-xs font-semibold uppercase tracking-wider text-slate-900 bg-amber-400 hover:bg-amber-300 transition-colors cursor-pointer w-full sm:w-auto"
                  >
                    <span>Request Special Tool Supply</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <a
                    href={getWhatsAppUrl("Hello Achse LLP, I would like to inquire about supplying special cold forging tooling from your global partner network.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded text-xs font-semibold uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-700 transition-colors w-full sm:w-auto"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Inquire via WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Cold Forging Progression Diagram */}
            <div className="w-full overflow-hidden">
              <ColdForgingSequenceDiagram />
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 2. FASTENERS SOLUTION                                          */}
        {/* ============================================================== */}
        {activeSubTab === 'fasteners' && (
          <div className="space-y-12">
            {/* Header from Catalogue PDF */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 lg:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="max-w-3xl">
                <span className="text-xs font-mono-spec uppercase text-amber-700 font-semibold tracking-wider">
                  Category 02 · Source of Truth: Achse Fasteners Catalogue
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F2A4A] mt-1">
                  Fasteners Solution
                </h2>
                <p className="text-base font-medium text-slate-700 mt-1">
                  {fastenersCatalogueData.subtitle}
                </p>
                <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                  {fastenersCatalogueData.whatWeDo}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <a
                  href="/assets/Achse_Fasteners_Catalogue.pdf"
                  download="Achse_Fasteners_Catalogue.pdf"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded text-xs font-semibold uppercase tracking-wider text-white bg-[#0F2A4A] hover:bg-[#1E3A5F] transition-colors shadow-xs"
                >
                  <Download className="w-4 h-4 text-amber-400" />
                  <span>Download Fasteners Catalogue (PDF)</span>
                </a>
              </div>
            </div>

            {/* 4 Pillars from Catalogue */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {fastenersCatalogueData.pillars.map((pillar, pIdx) => (
                <div key={pIdx} className="p-5 bg-white border border-slate-200 rounded-md">
                  <div className="w-8 h-8 rounded bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-mono-spec text-amber-700 font-bold mb-3">
                    0{pIdx + 1}
                  </div>
                  <h4 className="text-sm font-bold text-[#0F2A4A]">{pillar.title}</h4>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{pillar.desc}</p>
                </div>
              ))}
            </div>

            {/* 3 Product Groups from Catalogue */}
            <div className="space-y-8">
              <div className="border-b border-slate-200 pb-3">
                <h3 className="text-xl font-bold text-[#0F2A4A]">Fastener Product Groups</h3>
                <p className="text-xs text-slate-500 mt-0.5">Standard catalogue lines and special custom-made fasteners</p>
              </div>

              <div className="space-y-10">
                {fastenersCatalogueData.groups.map((group, gIdx) => (
                  <div key={group.id} className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
                    <div className="bg-[#0F2A4A] text-white px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="text-[10px] font-mono-spec uppercase text-amber-400 font-semibold tracking-wider">
                          Group 0{gIdx + 1}
                        </div>
                        <h4 className="text-lg font-bold">{group.title}</h4>
                        <p className="text-xs text-slate-300 mt-0.5">{group.description}</p>
                      </div>

                      <button
                        onClick={() => onEnquireProduct({ name: group.title, category: "Fasteners" })}
                        className="self-start sm:self-auto py-2 px-4 rounded text-xs font-semibold uppercase tracking-wider text-slate-900 bg-amber-400 hover:bg-amber-300 transition-colors cursor-pointer shrink-0 font-bold"
                      >
                        Enquire Group
                      </button>
                    </div>

                    <div className="p-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {group.items.map((item, iIdx) => (
                          <div
                            key={iIdx}
                            className="bg-slate-50/70 border border-slate-200 rounded-md overflow-hidden hover:border-[#0F2A4A] hover:bg-white hover:shadow-md transition-all flex flex-col justify-between group/fitem"
                          >
                            <div>
                              {/* Real Fastener Photo */}
                              <div className="relative h-36 bg-slate-900 overflow-hidden border-b border-slate-200">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  loading="lazy"
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover/fitem:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-black/20 pointer-events-none" />
                                
                                <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-xs text-[9px] font-mono-spec text-amber-400 px-2 py-0.5 rounded border border-white/10">
                                  {item.standard.split('|')[0].trim()}
                                </div>
                                <div className="absolute bottom-2 right-2 text-[9px] font-mono-spec text-slate-300 bg-black/40 px-1.5 py-0.5 rounded">
                                  Achse Quality
                                </div>
                              </div>

                              <div className="p-4">
                                <h5 className="text-sm font-bold text-[#0F2A4A] group-hover/fitem:text-blue-900 transition-colors">
                                  {item.name}
                                </h5>
                                <div className="text-[11px] font-mono-spec text-amber-700 font-semibold mt-0.5">
                                  {item.standard}
                                </div>
                                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                                  {item.desc}
                                </p>
                              </div>
                            </div>

                            <div className="p-4 pt-0 flex items-center gap-2">
                              <button
                                onClick={() => onEnquireProduct({ name: `${item.name} (${item.standard})`, category: "Fasteners" })}
                                className="flex-1 py-1.5 px-2.5 rounded text-[11px] font-semibold uppercase tracking-wider text-[#0F2A4A] bg-slate-200/80 hover:bg-[#0F2A4A] hover:text-white transition-colors cursor-pointer text-center"
                              >
                                Enquire
                              </button>
                              <a
                                href={getWhatsAppUrl(`Hello Achse LLP, I would like to inquire about ${item.name} (${item.standard}).`)}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Inquire on WhatsApp"
                                className="p-1.5 rounded bg-emerald-50 hover:bg-[#25D366] text-emerald-700 hover:text-white border border-emerald-200 hover:border-[#25D366] transition-colors cursor-pointer shrink-0"
                              >
                                <MessageCircle className="w-4 h-4 fill-current" />
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Technical Specifications Matrix */}
            <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-xs">
              <div className="bg-[#0F2A4A] text-white px-6 py-4 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold">Fastener Specification & Ordering Parameters</h3>
                  <p className="text-xs text-slate-300 mt-0.5">Verified against international standards and customer blueprints</p>
                </div>
                <span className="text-xs font-mono-spec text-amber-400 hidden sm:block">Thread Gauge Verified</span>
              </div>

              <div className="divide-y divide-slate-200">
                {fastenersCatalogueData.specifications.matrix.map((row, rIdx) => (
                  <div key={rIdx} className="grid grid-cols-1 md:grid-cols-12 p-5 hover:bg-slate-50 transition-colors">
                    <div className="md:col-span-3 text-xs font-bold text-[#0F2A4A] uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      <span>{row.label}</span>
                    </div>
                    <div className="md:col-span-9 text-xs text-slate-700 leading-relaxed font-mono-spec mt-1 md:mt-0">
                      {row.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* How Ordering Works (5 Steps) */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 lg:p-8">
              <div className="mb-6">
                <span className="text-xs font-mono-spec uppercase text-amber-700 font-semibold tracking-wider">Ordering Workflow</span>
                <h3 className="text-xl font-bold text-[#0F2A4A] mt-1">How Ordering Works at Achse</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
                {fastenersCatalogueData.specifications.howToOrder.map((step) => (
                  <div key={step.step} className="p-4 bg-white border border-slate-200 rounded-md">
                    <div className="text-xs font-mono-spec font-bold text-amber-600 mb-2">Step 0{step.step}</div>
                    <h5 className="text-sm font-bold text-[#0F2A4A]">{step.title}</h5>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Fastener Action Prompt */}
            <div className="p-6 bg-[#0F2A4A] text-white rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-base font-bold text-white">Need Standard or Special Fasteners to Drawing?</h4>
                <p className="text-xs text-slate-300 mt-1">Send your fastener standard, grade, surface finish, and scheduled quantity requirement to our Pune desk.</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onEnquireProduct({ name: "Fastener Solutions RFQ", category: "Fasteners" })}
                  className="px-5 py-2.5 rounded text-xs font-semibold uppercase tracking-wider text-slate-900 bg-amber-400 hover:bg-amber-300 transition-colors whitespace-nowrap cursor-pointer font-bold"
                >
                  Request Fastener Quote
                </button>
                <a
                  href={getWhatsAppUrl("Hello Achse LLP, I would like to inquire about industrial fasteners and send a drawing for quote.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                  title="Inquire via WhatsApp"
                >
                  <MessageCircle className="w-5 h-5 fill-current" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 3. AUTOMOTIVE COMPONENTS                                       */}
        {/* ============================================================== */}
        {activeSubTab === 'automotive' && (
          <div className="space-y-12">
            {/* Header from Catalogue PDF */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 lg:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="max-w-3xl">
                <span className="text-xs font-mono-spec uppercase text-amber-700 font-semibold tracking-wider">
                  Category 03 · Source of Truth: Achse Automotive Components Catalogue
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F2A4A] mt-1">
                  Automotive Components
                </h2>
                <p className="text-base font-medium text-slate-700 mt-1">
                  {automotiveCatalogueData.subtitle}
                </p>
                <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                  {automotiveCatalogueData.whatWeDo}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <a
                  href="/assets/Achse_Automotive_Components_Catalogue.pdf"
                  download="Achse_Automotive_Components_Catalogue.pdf"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded text-xs font-semibold uppercase tracking-wider text-white bg-[#0F2A4A] hover:bg-[#1E3A5F] transition-colors shadow-xs"
                >
                  <Download className="w-4 h-4 text-amber-400" />
                  <span>Download Automotive Catalogue (PDF)</span>
                </a>
              </div>
            </div>

            {/* CAD Schematic Visual */}
            <div>
              <ProductSchematic productId="automotive-components" category="automotive" className="h-52" />
            </div>

            {/* 3 Pillars from Automotive Catalogue */}
            <div className="space-y-10">
              {/* Pillar 1: Cold Formed Components */}
              <div className="bg-white border border-slate-200 rounded-lg p-6 lg:p-8 shadow-xs">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200">
                  <div>
                    <span className="text-xs font-mono-spec uppercase text-amber-600 font-semibold">Division 01</span>
                    <h3 className="text-xl font-bold text-[#0F2A4A]">1. Cold Formed Components</h3>
                    <p className="text-xs text-slate-600 mt-0.5">High-integrity blanks, flanged pins, stepped bodies, and bushes</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Typical components */}
                  <div>
                    <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">Typical Formed Components:</h4>
                    <div className="space-y-2.5">
                      {automotiveCatalogueData.pillars[0].typicalComponents?.map((item, idx) => (
                        <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded text-xs">
                          <span className="font-bold text-[#0F2A4A]">{item.name}: </span>
                          <span className="text-slate-600">{item.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Why cold forming */}
                  <div>
                    <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">Why Cold Forming?</h4>
                    <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-md space-y-2 text-xs text-amber-950 mb-4">
                      {automotiveCatalogueData.pillars[0].whyColdForming?.map((reason, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="font-medium">{reason}</span>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 bg-slate-100 border border-slate-200 rounded text-xs text-slate-700">
                      <strong>Formed then finished: </strong>
                      {automotiveCatalogueData.pillars[0].formedThenFinished}
                    </div>
                  </div>
                </div>

                {/* Cold Formed Image Showcase */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-200">
                  {automotiveCatalogueData.pillars[0].images?.map((img, i) => (
                    <div key={i} className="bg-slate-900 rounded-md overflow-hidden border border-slate-200 shadow-xs group/aimg">
                      <div className="relative h-44 overflow-hidden">
                        <img src={img.url} alt={img.caption} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover/aimg:scale-105" />
                        <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-xs text-[9px] font-mono-spec text-amber-400 px-2 py-0.5 rounded border border-white/10 uppercase tracking-wider">
                          Cold Formed Component
                        </div>
                      </div>
                      <div className="p-3 bg-white text-xs text-slate-700 font-medium border-t border-slate-100 flex items-center justify-between">
                        <span>{img.caption}</span>
                        <span className="text-[10px] font-mono-spec text-amber-700 font-semibold shrink-0 ml-2">Verified Blank</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pillar 2: CNC Turned Components */}
              <div className="bg-white border border-slate-200 rounded-lg p-6 lg:p-8 shadow-xs">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200">
                  <div>
                    <span className="text-xs font-mono-spec uppercase text-amber-600 font-semibold">Division 02</span>
                    <h3 className="text-xl font-bold text-[#0F2A4A]">2. CNC Turned Components</h3>
                    <p className="text-xs text-slate-600 mt-0.5">Shafts, bushes, flanges and fittings turned to your drawing</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">Typical Turned Components:</h4>
                    <div className="space-y-2.5">
                      {automotiveCatalogueData.pillars[1].typicalComponents?.map((item, idx) => (
                        <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded text-xs">
                          <span className="font-bold text-[#0F2A4A]">{item.name}: </span>
                          <span className="text-slate-600">{item.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">Made to Your Drawing:</h4>
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-md space-y-2 text-xs text-slate-700 mb-4">
                      {automotiveCatalogueData.pillars[1].madeToDrawing?.map((point, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#0F2A4A]" />
                          <span>{point}</span>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 bg-slate-100 border border-slate-200 rounded text-xs text-slate-700">
                      <strong>Held to tolerance: </strong>
                      {automotiveCatalogueData.pillars[1].heldToTolerance}
                    </div>
                  </div>
                </div>

                {/* CNC Turned Image Showcase */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-200">
                  {automotiveCatalogueData.pillars[1].images?.map((img, i) => (
                    <div key={i} className="bg-slate-900 rounded-md overflow-hidden border border-slate-200 shadow-xs group/aimg">
                      <div className="relative h-44 overflow-hidden">
                        <img src={img.url} alt={img.caption} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover/aimg:scale-105" />
                        <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-xs text-[9px] font-mono-spec text-amber-400 px-2 py-0.5 rounded border border-white/10 uppercase tracking-wider">
                          CNC Turned Component
                        </div>
                      </div>
                      <div className="p-3 bg-white text-xs text-slate-700 font-medium border-t border-slate-100 flex items-center justify-between">
                        <span>{img.caption}</span>
                        <span className="text-[10px] font-mono-spec text-amber-700 font-semibold shrink-0 ml-2">±0.005 mm</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pillar 3: CNC Turning Job Work */}
              <div className="bg-white border border-slate-200 rounded-lg p-6 lg:p-8 shadow-xs">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200">
                  <div>
                    <span className="text-xs font-mono-spec uppercase text-amber-600 font-semibold">Division 03</span>
                    <h3 className="text-xl font-bold text-[#0F2A4A]">3. CNC Turning Job Work</h3>
                    <p className="text-xs text-slate-600 mt-0.5">Your drawing, our machines. Send drawing and material; we turn, inspect and deliver.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">Job Work Highlights:</h4>
                    <div className="space-y-2">
                      {automotiveCatalogueData.pillars[2].features?.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">How Job Work Runs:</h4>
                    <div className="space-y-2">
                      {automotiveCatalogueData.pillars[2].howJobWorkRuns?.map((step) => (
                        <div key={step.step} className="flex items-center gap-3 p-2 bg-slate-50 border border-slate-200 rounded text-xs">
                          <span className="font-mono-spec font-bold text-amber-700 w-6">0{step.step}</span>
                          <span className="font-bold text-[#0F2A4A] w-20">{step.title}</span>
                          <span className="text-slate-600 text-[11px]">{step.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* CNC Job Work Action Image */}
                <div className="mt-6 pt-6 border-t border-slate-200">
                  {automotiveCatalogueData.pillars[2].images?.map((img, i) => (
                    <div key={i} className="bg-slate-900 rounded-md overflow-hidden border border-slate-200 shadow-md group/aimg">
                      <div className="relative h-60 sm:h-72 overflow-hidden">
                        <img src={img.url} alt={img.caption} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover/aimg:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20 pointer-events-none" />
                        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-xs text-[10px] font-mono-spec text-amber-400 px-2.5 py-1 rounded border border-white/10 uppercase tracking-wider font-semibold">
                          In-House Precision CNC Turning Operations
                        </div>
                        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs font-mono-spec text-slate-200 pointer-events-none">
                          <span className="font-medium text-white">{img.caption}</span>
                          <span className="text-amber-300 font-bold uppercase tracking-wider">ACHSE-PUNE SHOP FLOOR</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* One Team Statement */}
              <div className="p-6 bg-slate-100 border border-slate-200 rounded-lg text-center">
                <p className="text-sm font-semibold text-[#0F2A4A]">
                  "{automotiveCatalogueData.oneTeamStatement}"
                </p>
                <div className="mt-4 flex justify-center gap-4">
                  <button
                    onClick={() => onEnquireProduct({ name: "Automotive Components & CNC Job Work", category: "Automotive Components" })}
                    className="px-5 py-2.5 rounded text-xs font-semibold uppercase tracking-wider text-white bg-[#0F2A4A] hover:bg-[#1E3A5F] transition-colors cursor-pointer"
                  >
                    Send Automotive Drawing
                  </button>
                  <a
                    href={getWhatsAppUrl("Hello Achse LLP, I would like to inquire about automotive components and CNC turning job work.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded text-xs font-semibold uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp Inquiry</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 4. COLD FORGING DESIGN CONSULTANT                             */}
        {/* ============================================================== */}
        {activeSubTab === 'consultant' && (
          <div className="space-y-12">
            {/* Header */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 lg:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="max-w-3xl">
                <span className="text-xs font-mono-spec uppercase text-amber-700 font-semibold tracking-wider">
                  Category 04 · Engineering Consultation &amp; Technical Training
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F2A4A] mt-1">
                  {coldForgingConsultantData.title}
                </h2>
                <p className="text-base font-medium text-slate-700 mt-1">
                  {coldForgingConsultantData.subtitle}
                </p>
                <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                  {coldForgingConsultantData.overview}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <button
                  onClick={() => onEnquireProduct({ name: "Cold Forging Consultation & Training", category: "Consulting & Training" })}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded text-xs font-semibold uppercase tracking-wider text-white bg-[#0F2A4A] hover:bg-[#1E3A5F] transition-colors shadow-xs cursor-pointer"
                >
                  <Workflow className="w-4 h-4 text-amber-400" />
                  <span>Enquire Consultation / Training</span>
                </button>
              </div>
            </div>

            {/* 6 Consulting Pillars */}
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-3">
                <h3 className="text-xl font-bold text-[#0F2A4A]">6 Consulting Pillars & Advisory Scope</h3>
                <p className="text-xs text-slate-500 mt-0.5">Hands-on cold forming design assistance for manufacturing companies & tool-rooms</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {coldForgingConsultantData.consultingAreas.map((area, aIdx) => (
                  <div key={aIdx} className="p-6 bg-white border border-slate-200 rounded-lg hover:border-[#0F2A4A] transition-colors flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-mono-spec font-bold text-amber-600">Pillar 0{aIdx + 1}</span>
                        <PenTool className="w-4 h-4 text-slate-400" />
                      </div>
                      <h4 className="text-base font-bold text-[#0F2A4A]">{area.title}</h4>
                      <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">{area.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Real Industrial Tooling & Forging Blank Gallery */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 lg:p-8">
              <div className="mb-6">
                <span className="text-xs font-mono-spec uppercase text-amber-700 font-semibold tracking-wider">
                  Engineering Proof & Validation
                </span>
                <h3 className="text-xl font-bold text-[#0F2A4A] mt-1">
                  Tooling Sequences & Cold Formed Blank Validation
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Tooling sets, pre-stressed carbide heading dies, and formed gear forms engineered and validated through Achse technical consulting.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {coldForgingConsultantData.showcaseImages?.map((img, i) => (
                  <div key={i} className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs group/cimg flex flex-col justify-between">
                    <div className="relative h-48 bg-slate-900 overflow-hidden">
                      <img
                        src={img.url}
                        alt={img.caption}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover/cimg:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-black/20 pointer-events-none" />
                      <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-xs text-[9px] font-mono-spec text-amber-400 px-2 py-0.5 rounded border border-white/10 uppercase tracking-wider">
                        Engineering Case 0{i + 1}
                      </div>
                    </div>
                    <div className="p-4 bg-white border-t border-slate-100 flex-1 flex flex-col justify-between">
                      <p className="text-xs text-slate-700 font-medium leading-relaxed">
                        {img.caption}
                      </p>
                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono-spec text-slate-400">
                        <span>Achse Engineering</span>
                        <span className="text-amber-700 font-semibold">Verified</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Progression Sequence Visual */}
            <div>
              <ColdForgingSequenceDiagram />
            </div>

            {/* 4-Step Engagement Flow */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 lg:p-8">
              <div className="mb-6">
                <span className="text-xs font-mono-spec uppercase text-amber-700 font-semibold tracking-wider">Consulting Workflow</span>
                <h3 className="text-xl font-bold text-[#0F2A4A] mt-1">4-Stage Consulting & Validation Engagement</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                {coldForgingConsultantData.engagementSteps.map((step) => (
                  <div key={step.step} className="p-4 bg-white border border-slate-200 rounded-md">
                    <div className="text-xs font-mono-spec font-bold text-amber-600 mb-2">Stage {step.step}</div>
                    <h5 className="text-sm font-bold text-[#0F2A4A]">{step.title}</h5>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Card */}
            <div className="p-6 bg-[#0F2A4A] text-white rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-base font-bold text-white">Have a new cold forming part or troubled tooling sequence?</h4>
                <p className="text-xs text-slate-300 mt-1">Submit your 2D print or STEP model for cold forgeability review, station count planning, and carbide die design.</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onEnquireProduct({ name: "Cold Forging Tooling Design Feasibility", category: "Engineering Support" })}
                  className="px-5 py-2.5 rounded text-xs font-semibold uppercase tracking-wider text-slate-900 bg-amber-400 hover:bg-amber-300 transition-colors whitespace-nowrap cursor-pointer font-bold"
                >
                  Request Feasibility Review
                </button>
                <a
                  href={getWhatsAppUrl("Hello Achse LLP, I would like to consult with your engineering desk on a cold forging tooling design sequence.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                  title="Consult on WhatsApp"
                >
                  <MessageCircle className="w-5 h-5 fill-current" />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
