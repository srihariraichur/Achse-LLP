/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * CatalogueModal:
 * Clean modal providing instant access to download or inspect
 * all 3 official Achse LLP engineering catalogues:
 * 1. Cold Forging Dies & Gauges Catalogue
 * 2. Fasteners Catalogue
 * 3. Automotive Components Catalogue
 */

import React, { useState } from 'react';
import { X, Download, FileText, CheckCircle2, ArrowRight, ExternalLink } from 'lucide-react';
import { siteConfig } from '../data/content.ts';

interface CatalogueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestQuote: () => void;
}

export const CatalogueModal: React.FC<CatalogueModalProps> = ({
  isOpen,
  onClose,
  onRequestQuote,
}) => {
  if (!isOpen) return null;

  const catalogues = [
    {
      id: "dies-gauges",
      title: "Cold Forging Tooling (Dies & Gauges)",
      description: "Tungsten carbide heading dies, trimming dies, extrusion tooling, plug & ring gauges, and thread verification tools.",
      pdfUrl: "/assets/aistudio/Achse_Cold_Forging_Dies_and_Gauges_Catalogue_2d07b4cb.pdf",
      fileName: "Achse_Cold_Forging_Dies_and_Gauges_Catalogue.pdf",
      highlights: ["Tungsten Carbide Heading Dies", "Hexagon Trimming Dies", "Thread Plug & Ring Gauges", "Shrink-Fit Pre-stress Advisory"],
    },
    {
      id: "fasteners",
      title: "Fasteners Catalogue",
      description: "Bolts, screws, nuts, washers, pins and rivets supplied to your drawing and DIN/ISO standards with thread gauge inspection.",
      pdfUrl: "/assets/Achse_Fasteners_Catalogue.pdf",
      fileName: "Achse_Fasteners_Catalogue.pdf",
      highlights: ["Hex Head & Flange Bolts", "Socket Head & Torx Screws", "Hex Nuts & Flange Nuts", "Inspection with Thread Gauges"],
    },
    {
      id: "automotive",
      title: "Automotive Components Catalogue",
      description: "Cold formed high-integrity blanks and finished CNC turned sleeves, stepped shafts, bushes, and flanges.",
      pdfUrl: "/assets/Achse_Automotive_Components_Catalogue.pdf",
      fileName: "Achse_Automotive_Components_Catalogue.pdf",
      highlights: ["Cold Formed Blanks & Sleeves", "In-House CNC Turned Shafts", "CNC Turning Job Work", "One Point of Contact"],
    },
  ];

  const handleDownload = (pdfUrl: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200 rounded-lg max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50 sticky top-0 z-10">
          <div>
            <span className="text-[11px] font-mono-spec uppercase text-amber-700 font-semibold tracking-wider">
              Technical Documentation & Specifications
            </span>
            <h3 className="text-lg font-bold text-[#0F2A4A]">Download Official Achse Catalogues</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <p className="text-xs sm:text-sm text-slate-600">
            Download our complete technical catalogues in PDF format. All tooling, fasteners, and components are manufactured to customer blueprints and international quality standards.
          </p>

          <div className="space-y-4">
            {catalogues.map((cat, idx) => (
              <div 
                key={cat.id}
                className="p-4 bg-slate-50 border border-slate-200 rounded-lg hover:border-[#0F2A4A] transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded bg-[#0F2A4A] text-white flex items-center justify-center shrink-0 mt-0.5">
                    <FileText className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono-spec text-amber-700 font-semibold uppercase">PDF Catalogue 0{idx + 1}</span>
                    </div>
                    <h4 className="text-sm font-bold text-[#0F2A4A]">{cat.title}</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed max-w-md">
                      {cat.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {cat.highlights.map((h, hIdx) => (
                        <span key={hIdx} className="text-[10px] font-mono-spec bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-600">
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="shrink-0 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200 flex items-center justify-end">
                  <button
                    onClick={() => handleDownload(cat.pdfUrl, cat.fileName)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded text-xs font-semibold uppercase tracking-wider text-white bg-[#0F2A4A] hover:bg-[#1E3A5F] transition-colors cursor-pointer shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-400" />
                    <span>Download PDF</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/50 p-4 rounded-md">
            <div className="text-xs text-slate-600">
              Need a direct quotation for your drawing or standard?
            </div>
            <button
              onClick={() => {
                onClose();
                onRequestQuote();
              }}
              className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#0F2A4A] hover:text-amber-600 cursor-pointer"
            >
              <span>Submit RFQ to Pune Desk</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
