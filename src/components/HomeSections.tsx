/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * HomeSections Component:
 * - "Why Achse": 6 points strictly from the profile (precision, CNC machining, engineering support, quality focus, on-time delivery, Pune base)
 * - Industries Served: Non-automotive focus (general engineering, industrial machinery, electrical, infrastructure, agriculture, OEMs)
 * - Featured Products: 4 cards from the cold forging dies & gauges catalogue
 * - Call-to-Action Band: "Send us your drawing or requirement"
 */

import React from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  Compass, 
  Globe2, 
  Clock, 
  MapPin, 
  ArrowRight, 
  Send,
  SlidersHorizontal,
  ChevronRight,
  MessageCircle
} from 'lucide-react';
import { 
  whyAchsePoints, 
  industriesServed, 
  coldForgingCatalogue,
  featuredHomePageBoxes,
  FeaturedBox,
  getWhatsAppUrl,
  ProductItem 
} from '../data/content.ts';
import { ProductSchematic } from './TechnicalVisuals.tsx';

interface HomeSectionsProps {
  onEnquireProduct: (product: { name: string; category: string }) => void;
  onRequestQuote: () => void;
  onViewAllProducts: (tab?: string) => void;
}

export const WhyAchseSection: React.FC = () => {
  const icons = [
    <ShieldCheck key="1" className="w-5 h-5 text-[#0F2A4A]" />,
    <Cpu key="2" className="w-5 h-5 text-[#0F2A4A]" />,
    <Compass key="3" className="w-5 h-5 text-[#0F2A4A]" />,
    <Globe2 key="4" className="w-5 h-5 text-[#0F2A4A]" />,
    <Clock key="5" className="w-5 h-5 text-[#0F2A4A]" />,
    <MapPin key="6" className="w-5 h-5 text-[#0F2A4A]" />,
  ];

  return (
    <section className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <div className="text-xs font-mono-spec uppercase tracking-wider text-amber-600 font-semibold">
            Operational Principles
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F2A4A] mt-1 tracking-tight">
            Why Manufacturing Leaders Partner with Achse
          </h2>
          <p className="text-base text-slate-600 mt-3 leading-relaxed">
            Our capabilities are built around precision tolerance adherence, verified inspection documentation, and technical support from Pune.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {whyAchsePoints.map((point, index) => (
            <div
              key={point.id}
              className="p-6 bg-slate-50/70 hover:bg-slate-50 border border-slate-200/90 rounded-md transition-all duration-150 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded bg-white border border-slate-200 flex items-center justify-center shadow-xs">
                    {icons[index % icons.length]}
                  </div>
                  <span className="text-xs font-mono-spec text-slate-400">0{index + 1}</span>
                </div>
                <h3 className="text-base font-bold text-[#0F2A4A]">
                  {point.title}
                </h3>
                <p className="text-sm text-slate-600 mt-2.5 leading-relaxed">
                  {point.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const IndustriesSection: React.FC = () => {
  return (
    <section className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="max-w-2xl">
            <div className="text-xs font-mono-spec uppercase tracking-wider text-amber-600 font-semibold">
              Sector Specialization
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F2A4A] mt-1 tracking-tight">
              Industries Served
            </h2>
            <p className="text-base text-slate-600 mt-2">
              Supplying critical tooling, verified fasteners, and machined components to non-automotive industrial sectors.
            </p>
          </div>
          <div className="text-xs font-mono-spec text-slate-500">
            [Technical Specifications to Customer Blueprint]
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {industriesServed.map((ind, i) => (
            <div
              key={ind.name}
              className="bg-white border border-slate-200 rounded-md p-6 hover:border-slate-400 transition-colors"
            >
              <div className="flex items-baseline justify-between mb-2">
                <h3 className="text-base font-bold text-[#0F2A4A]">
                  {ind.name}
                </h3>
                <span className="text-[11px] font-mono-spec text-slate-400">0{i + 1}</span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                {ind.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const FeaturedProductsSection: React.FC<HomeSectionsProps> = ({
  onEnquireProduct,
  onViewAllProducts,
}) => {
  const [viewModes, setViewModes] = React.useState<Record<string, 'photo' | 'cad'>>({});

  const toggleViewMode = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setViewModes(prev => ({
      ...prev,
      [id]: prev[id] === 'cad' ? 'photo' : 'cad'
    }));
  };

  return (
    <section className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <div className="text-xs font-mono-spec uppercase tracking-wider text-amber-600 font-semibold">
              Tooling & Gauge Catalogue
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F2A4A] mt-1 tracking-tight">
              Featured Cold Forging Tooling & Gauges
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2">
              Precision carbide tooling, punches, trimming dies, fasteners, and automotive components supplied to your drawing and international standards.
            </p>
          </div>

          <button
            onClick={() => onViewAllProducts('tools-gauges')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#0F2A4A] hover:text-amber-600 transition-colors whitespace-nowrap cursor-pointer"
          >
            <span>View Full Capabilities</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* 4 Distinct Featured Boxes: Tungsten carbide Tools, Punch pins and trimming Die, Fasteners, Automotive components */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredHomePageBoxes.map((box) => {
            const isCad = viewModes[box.id] === 'cad';

            return (
              <div
                key={box.id}
                className="bg-white border border-slate-200 rounded-md overflow-hidden hover:border-[#0F2A4A] hover:shadow-lg transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Visual Container: Real Industrial Photograph (Default) with CAD Blueprint Toggle */}
                  <div className="relative">
                    {!isCad && box.image ? (
                      <div 
                        onClick={() => onViewAllProducts(box.targetTab)}
                        className="relative h-48 bg-slate-900 overflow-hidden cursor-pointer group/img border-b border-slate-200"
                        title={`Click to view ${box.name} domain specifications`}
                      >
                        <img 
                          src={box.image} 
                          alt={box.name}
                          loading="lazy"
                          className={`w-full h-full transition-transform duration-500 group-hover/img:scale-105 ${
                            box.image.endsWith('.png') ? 'object-contain p-3.5' : 'object-cover'
                          }`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20 pointer-events-none" />
                        
                        <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-xs text-[10px] font-mono-spec text-amber-400 px-2 py-0.5 rounded border border-white/10 uppercase tracking-widest">
                          Industrial Spec
                        </div>
                        
                        <button
                          type="button"
                          onClick={(e) => toggleViewMode(box.id, e)}
                          className="absolute top-2.5 right-2.5 bg-slate-900/80 hover:bg-[#0F2A4A] text-white text-[10px] font-mono-spec px-2 py-0.5 rounded border border-white/20 transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
                          title="Switch to CAD Blueprint schematic"
                        >
                          <span>CAD View</span>
                        </button>

                        <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[10px] font-mono-spec text-slate-300 pointer-events-none">
                          <span>TOL: ±0.003 mm</span>
                          <span className="text-amber-300 font-semibold uppercase">ACHSE-PUNE</span>
                        </div>
                      </div>
                    ) : (
                      <div className="relative">
                        <div 
                          onClick={() => onViewAllProducts(box.targetTab)}
                          className="cursor-pointer"
                          title={`View ${box.name} capabilities`}
                        >
                          <ProductSchematic productId={box.schematicId} category={box.category} className="h-48" />
                        </div>
                        {box.image && (
                          <button
                            type="button"
                            onClick={(e) => toggleViewMode(box.id, e)}
                            className="absolute top-2.5 right-2.5 bg-slate-900/80 hover:bg-[#0F2A4A] text-white text-[10px] font-mono-spec px-2 py-0.5 rounded border border-white/20 transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
                            title="Switch to Real Photo view"
                          >
                            <span>Photo View</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <div className="text-[11px] font-mono-spec text-amber-700 font-medium uppercase tracking-wide">
                      {box.categoryTitle}
                    </div>
                    <h3 
                      onClick={() => onViewAllProducts(box.targetTab)}
                      className="text-base font-bold text-[#0F2A4A] mt-1 group-hover:text-blue-900 transition-colors cursor-pointer"
                    >
                      {box.name}
                    </h3>
                    <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                      {box.shortDesc}
                    </p>

                    {/* Specifications Snapshot */}
                    <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5">
                      {box.specifications.slice(0, 3).map((spec, sIdx) => (
                        <div key={sIdx} className="flex items-baseline justify-between text-[11px]">
                          <span className="text-slate-500 truncate mr-2">{spec.label}:</span>
                          <span className="font-mono-spec text-slate-800 text-right truncate max-w-[140px] font-medium">
                            {spec.value}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Quick link to domain */}
                    <div className="mt-3 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => onViewAllProducts(box.targetTab)}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 hover:text-amber-700 transition-colors cursor-pointer"
                      >
                        <span>Explore domain specs</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 flex items-center gap-2">
                  <button
                    onClick={() => onEnquireProduct({ name: box.inquiryName, category: box.categoryTitle })}
                    className="flex-1 py-2.5 px-3 rounded text-xs font-semibold uppercase tracking-wider text-[#0F2A4A] bg-slate-100 hover:bg-[#0F2A4A] hover:text-white transition-colors cursor-pointer text-center"
                  >
                    Enquire
                  </button>
                  <a
                    href={getWhatsAppUrl(`Hello Achse LLP, I would like to inquire about ${box.name}.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Inquire on WhatsApp"
                    className="p-2.5 rounded bg-emerald-50 hover:bg-[#25D366] text-emerald-700 hover:text-white border border-emerald-200 hover:border-[#25D366] transition-colors cursor-pointer shrink-0"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export const CtaBand: React.FC<{ onRequestQuote: () => void }> = ({ onRequestQuote }) => {
  return (
    <section className="bg-[#0F2A4A] text-white py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-blueprint-dark opacity-30 pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl text-center lg:text-left">
            <span className="text-xs font-mono-spec uppercase tracking-widest text-amber-400 font-semibold">
              Engineering Quotation
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1.5 tracking-tight">
              Send us your drawing or requirement
            </h2>
            <p className="text-slate-300 text-sm sm:text-base mt-2 leading-relaxed">
              Upload your 2D PDF or 3D CAD models (STEP/DWG). Our Pune engineering desk will review tolerances, tool-geometry, and revert with a formal technical review and quote.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 shrink-0">
            <button
              onClick={onRequestQuote}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded text-xs font-semibold uppercase tracking-wider text-slate-900 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 transition-all shadow-md cursor-pointer whitespace-nowrap"
            >
              <Send className="w-4 h-4 text-slate-950" />
              <span>Submit Drawing & RFQ</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
