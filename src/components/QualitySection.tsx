/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Quality & Support Section:
 * - Gauge-based verification & measurement approach
 * - Inspection reports & documentation (MTC 3.1 [to be confirmed])
 * - Engineering & cold forging design support
 * - "How We Work" 4-step process
 */

import React from 'react';
import { 
  ShieldCheck, 
  FileCheck2, 
  Microscope, 
  PenTool, 
  ArrowRight,
  ClipboardCheck,
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';
import { qualityAndSupport } from '../data/content.ts';
import { ColdForgingSequenceDiagram } from './TechnicalVisuals.tsx';

interface QualitySectionProps {
  onRequestQuote: () => void;
}

export const QualitySection: React.FC<QualitySectionProps> = ({ onRequestQuote }) => {
  return (
    <div className="py-12 bg-white">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="border-b border-slate-200 pb-8">
          <div className="text-xs font-mono-spec uppercase tracking-wider text-amber-600 font-semibold">
            Quality Assurance & Engineering Advisory
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F2A4A] mt-1 tracking-tight">
            Quality & Technical Support
          </h1>
          <p className="text-base text-slate-600 mt-2 max-w-3xl leading-relaxed">
            {qualityAndSupport.subheadline}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Inspection & Measurement Approach */}
        <div>
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-mono-spec uppercase tracking-wider text-amber-600 font-semibold">
              Measurement Protocol
            </span>
            <h2 className="text-2xl font-bold text-[#0F2A4A] mt-1 tracking-tight">
              Inspection & Measurement Methodology
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Guaranteeing dimensional fidelity, geometric fitment, and material integrity on every batch.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {qualityAndSupport.inspectionApproach.map((item, idx) => (
              <div
                key={idx}
                className="p-6 bg-slate-50 border border-slate-200 rounded-md flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded bg-white border border-slate-200 flex items-center justify-center text-[#0F2A4A] mb-4 shadow-xs">
                    {idx === 0 ? (
                      <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    ) : idx === 1 ? (
                      <FileSpreadsheet className="w-5 h-5 text-sky-600" />
                    ) : (
                      <Microscope className="w-5 h-5 text-amber-600" />
                    )}
                  </div>
                  <h3 className="text-base font-bold text-[#0F2A4A]">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Calibrated Gauge Instrumentation Showcase */}
          <div className="mt-8 bg-slate-50 border border-slate-200 rounded-lg p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <span className="text-xs font-mono-spec uppercase text-amber-700 font-semibold tracking-wider">
                  Traceable Standards
                </span>
                <h3 className="text-xl font-bold text-[#0F2A4A] mt-0.5">
                  Calibrated Gauges & Dimensional Verification Standards
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  100% gauge-based GO / NO-GO verification prior to release of fasteners, tooling, and turned components.
                </p>
              </div>
              <div className="text-xs font-mono-spec text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded shrink-0">
                TOLERANCE: IS 3455 / ISO 965
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white border border-slate-200 rounded-md overflow-hidden shadow-xs group">
                <div className="relative h-44 bg-slate-900 overflow-hidden">
                  <img
                    src="/assets/aistudio/thread_ring_gauge_f21b8238.png"
                    alt="Thread Plug and Ring Gauges"
                    loading="lazy"
                    className="w-full h-full object-contain p-3 transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-xs text-[9px] font-mono-spec text-amber-400 px-2 py-0.5 rounded border border-white/10 uppercase">
                    Thread Verification
                  </div>
                </div>
                <div className="p-4">
                  <div className="text-xs font-bold text-[#0F2A4A]">Thread Plug & Ring Gauges</div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                    Metric ISO (6H/6g), UNC, UNF, and Acme thread gauges for verified fastener pitch diameter fitment.
                  </p>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-md overflow-hidden shadow-xs group">
                <div className="relative h-44 bg-white border-b border-slate-200 overflow-hidden">
                  <img
                    src="/assets/aistudio/plain_ring_gauges_e6374a17.jpg"
                    alt="Plain Ring Gauges"
                    loading="lazy"
                    className="w-full h-full object-contain p-2.5 transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-xs text-[9px] font-mono-spec text-amber-400 px-2 py-0.5 rounded border border-white/10 uppercase">
                    Bore & Shaft Standards
                  </div>
                </div>
                <div className="p-4">
                  <div className="text-xs font-bold text-[#0F2A4A]">Plain Ring Gauges</div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                    Sub-zero stabilized cylindrical rings and precision GO / NO-GO standards for outside diameter and hole tolerance checks.
                  </p>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-md overflow-hidden shadow-xs group">
                <div className="relative h-44 bg-slate-900 overflow-hidden">
                  <img
                    src="/assets/aistudio/snap-gauge_b293d926.jpg"
                    alt="Caliper and Snap Gauges"
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-xs text-[9px] font-mono-spec text-amber-400 px-2 py-0.5 rounded border border-white/10 uppercase">
                    Shop Floor Calipers
                  </div>
                </div>
                <div className="p-4">
                  <div className="text-xs font-bold text-[#0F2A4A]">Snap & Profile Gauges</div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                    Rapid anvil snap gauges for on-machine diameter checks, stepped groove verification, and continuous QA.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Engineering Design Support Block */}
        <div className="p-6 sm:p-8 bg-slate-50 border border-slate-300 rounded-lg">
          <div className="w-full">
            <div className="flex items-center gap-2 text-xs font-mono-spec text-amber-700 uppercase tracking-widest font-semibold mb-2">
              <PenTool className="w-4 h-4 text-amber-600" />
              <span>Technical Tooling Advisory</span>
            </div>
            <h2 className="text-2xl font-bold text-[#0F2A4A] tracking-tight">
              {qualityAndSupport.engineeringSupport.title}
            </h2>
            <p className="text-slate-700 text-sm sm:text-base mt-2 max-w-3xl leading-relaxed">
              {qualityAndSupport.engineeringSupport.desc}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-200">
              {qualityAndSupport.engineeringSupport.deliverables.map((item, dIdx) => (
                <div key={dIdx} className="flex items-start gap-2.5 text-xs text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-[#0F2A4A] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* Sequence diagram */}
            <div className="mt-8 w-full">
              <ColdForgingSequenceDiagram />
            </div>
          </div>
        </div>

        {/* "How We Work" 4-Step Process */}
        <div>
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-mono-spec uppercase tracking-wider text-amber-600 font-semibold">
              Execution Workflow
            </span>
            <h2 className="text-2xl font-bold text-[#0F2A4A] mt-1 tracking-tight">
              How We Work: 4-Step Engagement Process
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Transparent, accountable milestones from initial drawing review to scheduled dispatch.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {qualityAndSupport.howWeWorkSteps.map((step) => (
              <div
                key={step.step}
                className="p-6 bg-white border border-slate-200 rounded-md relative flex flex-col justify-between hover:border-[#0F2A4A] transition-colors"
              >
                <div>
                  <div className="text-2xl font-extrabold font-mono-spec text-[#0F2A4A] mb-3">
                    {step.step}
                  </div>
                  <h3 className="text-base font-bold text-[#0F2A4A]">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono-spec text-slate-400">
                  <span>STAGE {step.step}</span>
                  <ClipboardCheck className="w-3.5 h-3.5 text-slate-300" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Prompt */}
        <div className="p-8 bg-[#0F2A4A] text-white rounded-lg relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="relative z-10">
            <h3 className="text-xl font-bold">Have a technical drawing ready for review?</h3>
            <p className="text-xs text-slate-300 mt-1">Our engineering team provides comprehensive feasibility and quotation support.</p>
          </div>
          <button
            onClick={onRequestQuote}
            className="relative z-10 px-6 py-3 rounded text-xs font-semibold uppercase tracking-wider text-slate-900 bg-amber-400 hover:bg-amber-300 transition-colors whitespace-nowrap cursor-pointer"
          >
            Submit Drawing for Review
          </button>
        </div>
      </div>
    </div>
  );
};
