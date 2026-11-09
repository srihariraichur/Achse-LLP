/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * FaqSection:
 * SEO-optimized technical FAQ answering high-intent search queries
 * for cold forging dies, precision inspection gauges, fasteners, and tooling design.
 * Aligns 1:1 with the Schema.org FAQPage structured data in index.html.
 */

import React, { useState } from 'react';
import { ChevronDown, HelpCircle, FileText, ArrowRight } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

export const FaqSection: React.FC<{ onRequestQuote: () => void }> = ({ onRequestQuote }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      category: "Cold Forging Tooling",
      question: "What types of cold forging tooling and dies does ACHSE LLP supply?",
      answer: "ACHSE LLP supplies precision tungsten carbide heading dies, hexagon and socket trimming dies, forward/backward extrusion reduction dies, heading punches, quill cutters, shear blades, and segmental split dies. All tooling is supplied strictly to customer engineering drawings, dimensional tolerances, and material specifications.",
    },
    {
      category: "Inspection Gauges",
      question: "Do ACHSE LLP gauges include traceable calibration & inspection reports?",
      answer: "Yes. Every plain plug gauge, plain ring gauge, thread plug gauge, and custom inspection fixture supplied by ACHSE LLP undergoes rigorous dimensional verification using calibrated masters and comes with traceable inspection documentation.",
    },
    {
      category: "Engineering Support",
      question: "Does ACHSE LLP provide cold forging process and tooling design support?",
      answer: "Yes. Our engineering desk in Pune provides collaborative process design assistance — from evaluating raw part blueprints and volume distribution calculations, to designing multi-station preforms and heading stage sequences for tool-rooms.",
    },
    {
      category: "Fasteners",
      question: "What standards and property classes are supported for industrial fasteners?",
      answer: "We supply standard and custom high-tensile fasteners compliant with IS (Indian Standards), DIN (German Standards), ISO (International), and ASTM specifications in metric Property Classes 4.6, 5.6, 8.8, 10.9, and 12.9 (Nut classes 8, 10, 12). Surface finishes include Trivalent Zinc, Zinc Flake (Geomet/Dacromet), Hot-Dip Galvanizing, and Black Oxide.",
    },
    {
      category: "Global Sourcing",
      question: "Can ACHSE LLP supply special and non-standard tooling from international partners?",
      answer: "Yes. We source special and custom tooling through our established global network, including specialized manufacturers in China and Taiwan, ensuring rigorous incoming inspection in Pune before customer delivery.",
    },
    {
      category: "CNC Machining",
      question: "What custom CNC machined components can be ordered to drawing?",
      answer: "We supply precision turned components, bushings, tooling blanks, adapter rings, and stepped rotational parts manufactured strictly on CNC machines to customer drawings and micron tolerances.",
    },
  ];

  return (
    <section className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="max-w-2xl">
            <div className="text-xs font-mono-spec uppercase tracking-wider text-amber-600 font-semibold">
              Technical FAQ &amp; Search Knowledge
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F2A4A] mt-1 tracking-tight">
              Frequently Asked Technical Questions
            </h2>
            <p className="text-base text-slate-600 mt-2">
              Key engineering specifications, tooling supply protocols, and verification standards.
            </p>
          </div>
          <div className="text-xs font-mono-spec text-slate-500">
            [ISO / DIN / IS Compliant Standards]
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="max-w-4xl mx-auto space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-lg overflow-hidden transition-all duration-150"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/60 transition-colors"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-mono-spec text-amber-600 font-semibold uppercase tracking-wider shrink-0">
                      0{idx + 1}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-[#0F2A4A]">
                      {faq.question}
                    </h3>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180 text-[#0F2A4A]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 border-t border-slate-100 text-xs sm:text-sm text-slate-600 leading-relaxed animate-in fade-in duration-150">
                    <p>{faq.answer}</p>
                    <div className="mt-3 flex items-center justify-between text-[11px] font-mono-spec text-slate-400 pt-2 border-t border-slate-100">
                      <span>Category: {faq.category}</span>
                      <button
                        onClick={onRequestQuote}
                        className="text-[#0F2A4A] hover:text-amber-600 font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <span>Request Specific Spec</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Callout */}
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white border border-slate-200 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <h4 className="text-sm font-bold text-[#0F2A4A]">Have a specific drawing tolerance or standard to review?</h4>
            <p className="text-xs text-slate-600 mt-0.5">Submit your CAD blueprint or standard requirements directly to our Pune desk.</p>
          </div>
          <button
            onClick={onRequestQuote}
            className="px-5 py-2.5 rounded text-xs font-semibold uppercase tracking-wider text-white bg-[#0F2A4A] hover:bg-[#1E3A5F] transition-colors whitespace-nowrap cursor-pointer"
          >
            Submit Drawing for Review
          </button>
        </div>
      </div>
    </section>
  );
};
