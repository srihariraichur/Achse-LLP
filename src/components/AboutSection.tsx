/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * About Us Component:
 * - Company story (Pune, established 2026, vision, mission, values)
 * - What we do: machined products and tools made on CNC machines; engineering and cold forging design support; fastener solutions
 * - Strictly compliant with official manufacturing profile.
 */

import React from 'react';
import { 
  CheckCircle, 
  Target, 
  Compass, 
  MapPin, 
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';
import { companyStory, siteConfig } from '../data/content.ts';

interface AboutSectionProps {
  onRequestQuote: () => void;
  onExploreProducts: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  onRequestQuote,
  onExploreProducts,
}) => {
  return (
    <div className="py-12 bg-white">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="border-b border-slate-200 pb-8">
          <div className="text-xs font-mono-spec uppercase tracking-wider text-amber-600 font-semibold">
            Corporate Profile
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F2A4A] mt-1 tracking-tight">
            About ACHSE LLP
          </h1>
          <p className="text-base text-slate-600 mt-2 max-w-3xl leading-relaxed">
            {companyStory.aboutHeadline}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Company Overview & Origin */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-7 space-y-5">
            <h2 className="text-2xl font-bold text-[#0F2A4A] tracking-tight">
              Precision Engineering Rooted in Pune
            </h2>
            <p className="text-base text-slate-700 leading-relaxed">
              {companyStory.story}
            </p>
            <p className="text-base text-slate-700 leading-relaxed">
              Serving purchase managers, tool-room heads, and quality assurance leaders, we bridge technical precision with dependable supply. Our focus centers on zero-defect manufacturing to customer drawings, supported by calibrated gauge verification.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-6 text-xs font-mono-spec text-slate-600">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-600" />
                <span>Base: Pune, Maharashtra</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-amber-600" />
                <span>Established: 2026</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-amber-600" />
                <span>Supply: To Customer Blueprint</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-lg p-6 space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <span className="text-xs font-mono-spec uppercase tracking-wider text-slate-500 font-semibold">
                Core Scope of Operations
              </span>
              <h3 className="text-lg font-bold text-[#0F2A4A] mt-1">What We Do</h3>
            </div>

            <ul className="space-y-4 text-sm text-slate-700">
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded bg-[#0F2A4A] text-white flex items-center justify-center text-xs shrink-0 mt-0.5 font-mono-spec">1</div>
                <div>
                  <strong className="text-slate-900 block">Machined Products and Tools</strong>
                  <span>Custom components and tools manufactured on CNC machines strictly to customer drawings and specifications.</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded bg-[#0F2A4A] text-white flex items-center justify-center text-xs shrink-0 mt-0.5 font-mono-spec">2</div>
                <div>
                  <strong className="text-slate-900 block">Cold Forging Consultation, Training &amp; Tooling</strong>
                  <span>Tungsten carbide heading dies, trimming tools, and gauges supplied to drawing, accompanied by expert cold forging consultation and practical training.</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded bg-[#0F2A4A] text-white flex items-center justify-center text-xs shrink-0 mt-0.5 font-mono-spec">3</div>
                <div>
                  <strong className="text-slate-900 block">Fastener Solutions</strong>
                  <span>Standard and custom high-tensile fasteners supplied to IS / DIN / ISO / ASTM standards with managed quality and scheduled delivery.</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Vision & Mission Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 bg-[#0F2A4A] text-white rounded-lg relative overflow-hidden border border-slate-700">
            <div className="absolute inset-0 bg-blueprint-dark opacity-30 pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-xs font-mono-spec text-amber-400 uppercase tracking-widest font-semibold mb-3">
                <Target className="w-4 h-4" />
                <span>Our Strategic Direction</span>
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight mb-3">
                Vision
              </h3>
              <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
                {companyStory.vision}
              </p>
            </div>
          </div>

          <div className="p-8 bg-slate-50 border border-slate-200 rounded-lg">
            <div className="flex items-center gap-2 text-xs font-mono-spec text-amber-700 uppercase tracking-widest font-semibold mb-3">
              <Compass className="w-4 h-4 text-amber-600" />
              <span>Our Operating Purpose</span>
            </div>
            <h3 className="text-2xl font-bold text-[#0F2A4A] tracking-tight mb-3">
              Mission
            </h3>
            <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
              {companyStory.mission}
            </p>
          </div>
        </div>

        {/* Corporate Values */}
        <div>
          <div className="mb-8">
            <span className="text-xs font-mono-spec uppercase tracking-wider text-amber-600 font-semibold">
              Guiding Standards
            </span>
            <h3 className="text-2xl font-extrabold text-[#0F2A4A] mt-1">Our Core Values</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {companyStory.values.map((val, vIdx) => (
              <div key={val.title} className="p-6 bg-white border border-slate-200 rounded-md">
                <span className="text-xs font-mono-spec text-slate-400 block mb-2">0{vIdx + 1}</span>
                <h4 className="text-base font-bold text-[#0F2A4A]">{val.title}</h4>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Callout */}
        <div className="p-8 bg-slate-100 border border-slate-200 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-bold text-[#0F2A4A]">Ready to review your drawing or requirement?</h3>
            <p className="text-xs text-slate-600 mt-1">Our technical engineering team in Pune provides fast feasibility and quotation turnaround.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onRequestQuote}
              className="px-5 py-2.5 rounded text-xs font-semibold uppercase tracking-wider text-white bg-[#0F2A4A] hover:bg-[#1E3A5F] transition-colors cursor-pointer whitespace-nowrap"
            >
              Request a Quote
            </button>
            <button
              onClick={onExploreProducts}
              className="px-5 py-2.5 rounded text-xs font-semibold uppercase tracking-wider text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap"
            >
              Browse Products
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
