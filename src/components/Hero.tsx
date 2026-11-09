/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Hero Component:
 * Clean engineering visual, abstract blueprint drawing in brand colors,
 * tagline-driven headline, value proposition, and two primary actions.
 * Followed by the strip of business pillars (Tooling & Gauges, Fasteners, Automotive, Consultation & Training).
 */

import React from 'react';
import { ArrowRight, Download, FileText, CheckCircle2 } from 'lucide-react';
import { siteConfig, businessPillars } from '../data/content.ts';

interface HeroProps {
  onRequestQuote: () => void;
  onDownloadCatalogue: () => void;
  onSelectPillar: (sectionId: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  onRequestQuote,
  onDownloadCatalogue,
  onSelectPillar,
}) => {
  const [heroView, setHeroView] = React.useState<'blueprint' | 'workshop'>('blueprint');

  return (
    <section className="relative bg-white border-b border-slate-200 overflow-hidden">
      {/* Precision Blueprint Grid Layer */}
      <div className="absolute inset-0 bg-blueprint-grid opacity-60 pointer-events-none" />

      {/* Decorative Technical Datum Crosshairs */}
      <div className="absolute top-12 left-10 hidden xl:block opacity-30 pointer-events-none text-[11px] font-mono-spec text-slate-500">
        <div>[DATUM-X: 18.5204° N]</div>
        <div>[DATUM-Y: 73.8567° E]</div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-16 lg:pt-24 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline, Value Proposition & Actions */}
          <div className="lg:col-span-7 space-y-6">
            {/* Domain-Native Editorial Kicker (No Pill Enclosure) */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono-spec tracking-wider uppercase text-slate-500">
              <span className="text-[#0F2A4A] font-semibold">{siteConfig.companyName}</span>
              <span aria-hidden="true" className="text-amber-500 font-bold">·</span>
              <span>Pune, India</span>
              <span aria-hidden="true" className="text-slate-300">/</span>
              <span>Est. {siteConfig.establishedYear}</span>
              <span aria-hidden="true" className="text-slate-300">/</span>
              <span className="text-amber-700 font-bold">Consultation &amp; Training</span>
            </div>

            {/* Display Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F2A4A] tracking-tight leading-[1.18] text-balance">
              Precision Tooling, Fastener Solutions, Machined Engineering Components and Cold Forging Consultation With Training
            </h1>

            {/* Value Proposition */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
              {siteConfig.valueProposition}
            </p>

            {/* Two Main Actions */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={onRequestQuote}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded text-sm font-semibold uppercase tracking-wider text-white bg-[#0F2A4A] hover:bg-[#1E3A5F] active:bg-[#0A1D33] transition-all shadow-sm cursor-pointer whitespace-nowrap"
              >
                <span>Request a Quote</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </button>

              <button
                onClick={onDownloadCatalogue}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded text-sm font-semibold tracking-wider text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-all cursor-pointer whitespace-nowrap"
              >
                <Download className="w-4 h-4 text-[#0F2A4A]" />
                <span>Download Catalogue</span>
              </button>
            </div>

            {/* Verified Trust Strip (No fake metrics, strictly aligned with profile) */}
            <div className="pt-4 border-t border-slate-200/80 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-600">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Supplied to Drawing & Specification</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Calibrated Gauge Verification</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-amber-600" />
                <span className="font-semibold text-slate-800">Cold Forging Consultation &amp; Training</span>
              </div>
            </div>
          </div>

          {/* Right Column: Precision Technical Blueprint Carrier & Workshop Live Action */}
          <div className="lg:col-span-5">
            <div className="relative bg-[#0E1E2E] border border-slate-700/80 rounded-lg p-6 shadow-xl overflow-hidden">
              {/* Drafting grid */}
              <div className="absolute inset-0 bg-blueprint-dark opacity-40 pointer-events-none" />

              {/* Blueprint Title Block with View Switcher */}
              <div className="relative flex items-center justify-between pb-4 mb-4 border-b border-slate-700">
                <div>
                  <span className="text-[10px] font-mono-spec uppercase tracking-widest text-amber-400">Engineering Interface</span>
                  <div className="text-sm font-bold text-white tracking-wide">ACHSE PRECISION ASSEMBLY</div>
                </div>

                <div className="flex items-center gap-1 bg-slate-800/90 p-1 rounded border border-slate-700">
                  <button
                    type="button"
                    onClick={() => setHeroView('blueprint')}
                    className={`px-2 py-0.5 text-[9px] font-mono-spec rounded transition-colors cursor-pointer ${
                      heroView === 'blueprint' ? 'bg-[#0F2A4A] text-amber-400 font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    CAD Blueprint
                  </button>
                  <button
                    type="button"
                    onClick={() => setHeroView('workshop')}
                    className={`px-2 py-0.5 text-[9px] font-mono-spec rounded transition-colors cursor-pointer ${
                      heroView === 'workshop' ? 'bg-[#0F2A4A] text-amber-400 font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    CNC Workshop
                  </button>
                </div>
              </div>

              {heroView === 'blueprint' ? (
                /* Interactive Vector CAD Illustration */
                <div className="relative py-2">
                  <svg viewBox="0 0 320 200" className="w-full h-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Axis line */}
                    <line x1="20" y1="100" x2="300" y2="100" stroke="#EF4444" strokeWidth="1" strokeDasharray="8 3 2 3" opacity="0.8" />
                    
                    {/* Outer Die Stress Ring */}
                    <rect x="50" y="30" width="220" height="140" rx="3" fill="#1E293B" stroke="#64748B" strokeWidth="1.5" />
                    
                    {/* Section hatching */}
                    <line x1="60" y1="30" x2="80" y2="50" stroke="#334155" strokeWidth="1" />
                    <line x1="90" y1="30" x2="110" y2="50" stroke="#334155" strokeWidth="1" />
                    <line x1="240" y1="150" x2="260" y2="170" stroke="#334155" strokeWidth="1" />

                    {/* Tungsten Carbide Insert Core */}
                    <rect x="90" y="48" width="140" height="104" rx="2" fill="#0B132B" stroke="#38BDF8" strokeWidth="2" />

                    {/* Multi-step Extrusion Profile */}
                    <path
                      d="M110 60 L140 60 L160 85 L210 85 L210 115 L160 115 L140 140 L110 140 Z"
                      fill="#0F2A4A"
                      stroke="#D97706"
                      strokeWidth="1.8"
                    />

                    {/* Precision Gauge Callout line */}
                    <line x1="160" y1="15" x2="160" y2="185" stroke="#38BDF8" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.6" />
                    <circle cx="160" cy="85" r="2.5" fill="#38BDF8" />
                    <circle cx="160" cy="115" r="2.5" fill="#38BDF8" />
                    
                    <text x="160" y="24" fill="#38BDF8" fontSize="8" fontFamily="JetBrains Mono" textAnchor="middle">Ø 12.000 H7 [GO]</text>

                    {/* Fastener Forming Vector */}
                    <path d="M25 100 L45 100" stroke="#F59E0B" strokeWidth="2" />
                    <polygon points="45,97 52,100 45,103" fill="#F59E0B" />
                    <text x="35" y="93" fill="#F59E0B" fontSize="6.5" fontFamily="JetBrains Mono" textAnchor="middle">FEED</text>

                    {/* Laser Mark On Tooling */}
                    <rect x="195" y="142" width="70" height="18" rx="2" fill="#0F172A" stroke="#475569" strokeWidth="0.8" />
                    <text x="230" y="154" fill="#F8FAFC" fontSize="7" fontFamily="JetBrains Mono" fontWeight="600" textAnchor="middle">ACHSE · PUNE</text>
                  </svg>
                </div>
              ) : (
                /* Workshop Live Operation View */
                <div className="relative py-2">
                  <div className="relative h-[200px] w-full rounded overflow-hidden border border-slate-700 bg-slate-950">
                    <img
                      src="/assets/aistudio/CNC_job_work_56ce5447.jpg"
                      alt="CNC Turning Machine in Operation"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30 pointer-events-none" />
                    
                    <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-xs text-[9px] font-mono-spec text-amber-400 px-2 py-0.5 rounded border border-white/10 uppercase">
                      Sparks Cutting Action
                    </div>
                    
                    <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[10px] font-mono-spec text-slate-200">
                      <span>SPINDLE: 2400 RPM</span>
                      <span className="text-amber-300 font-semibold">TOL: ±0.005 mm</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Blueprint / Workshop Footer Specs */}
              <div className="relative pt-3 mt-2 border-t border-slate-700/80 flex items-center justify-between text-[11px] font-mono-spec text-slate-300">
                <span>MAT: WC-Co / 1.2344 / EN8D</span>
                <span className="text-amber-400">SURFACE: Ra 0.08 µm</span>
                <span className="text-emerald-400 font-semibold">STATUS: VERIFIED</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Strip of Business Pillars */}
      <div className="bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {businessPillars.map((pillar) => (
              <div
                key={pillar.id}
                onClick={() => onSelectPillar(pillar.targetSection)}
                className="group relative bg-white border border-slate-200 hover:border-[#0F2A4A] rounded-md p-6 transition-all duration-150 hover:shadow-md flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="text-[11px] font-mono-spec uppercase text-amber-600 font-semibold tracking-wider">
                    {pillar.subtitle}
                  </div>
                  <h3 className="text-lg font-bold text-[#0F2A4A] mt-1 group-hover:text-blue-900 transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-slate-600 mt-2.5 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>

                <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectPillar(pillar.targetSection);
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F2A4A] group-hover:text-amber-600 transition-colors uppercase tracking-wider cursor-pointer"
                  >
                    <span>{pillar.actionText}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <FileText className="w-4 h-4 text-slate-300 group-hover:text-[#0F2A4A] transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
