/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * WhatsAppWidget:
 * Professional floating WhatsApp chat integration for Achse LLP.
 * Allows purchase heads, tool-room engineers, and visitors to quickly connect
 * with the Pune engineering desk via WhatsApp with pre-filled inquiries.
 */

import React, { useState } from 'react';
import { X, Send, ArrowUpRight, MessageCircle } from 'lucide-react';
import { siteConfig, getWhatsAppUrl } from '../data/content.ts';

export const WhatsAppWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');

  const quickInquiries = [
    {
      label: "Cold Forging Dies RFQ",
      text: "Hello Achse LLP, I would like to request a quotation for Cold Forging Dies as per our drawing.",
    },
    {
      label: "Gauges & Tolerance Inspection",
      text: "Hello Achse LLP, I have an inquiry for precision Plug / Ring / Thread Gauges to ISO standards.",
    },
    {
      label: "Fastener Solutions",
      text: "Hello Achse LLP, we require high-tensile fasteners (Grade 8.8 / 10.9 / 12.9). Please share availability.",
    },
    {
      label: "CNC Machining to Drawing",
      text: "Hello Achse LLP, we have custom CNC turned components to quote. Can we share the drawing here?",
    },
  ];

  const handleSend = (textToSend?: string) => {
    const message = textToSend || customMsg || "Hello Achse LLP, I am interested in your engineering tooling and fastener capabilities.";
    const url = getWhatsAppUrl(message);
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Action Button (Positioned at bottom-right, above mobile bottom bar) */}
      <div className="fixed bottom-20 sm:bottom-6 right-5 sm:right-6 z-40 select-none">
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Connect on WhatsApp"
          className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#25D366] hover:bg-[#20BD5A] text-white shadow-xl hover:shadow-2xl transition-all duration-200 cursor-pointer active:scale-95"
        >
          {/* WhatsApp Icon */}
          <div className="w-6 h-6 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19.01L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67ZM8.53 7.33C8.36 7.33 8.08 7.39 7.85 7.65C7.61 7.9 6.95 8.52 6.95 9.79C6.95 11.06 7.88 12.28 8.01 12.45C8.14 12.63 9.8 15.34 12.42 16.38C14.6 17.25 15.05 17.07 15.52 17.03C15.99 16.99 17.03 16.41 17.25 15.8C17.47 15.19 17.47 14.67 17.4 14.56C17.34 14.45 17.17 14.39 16.92 14.26C16.66 14.14 15.42 13.53 15.19 13.44C14.96 13.36 14.79 13.31 14.62 13.56C14.45 13.81 13.97 14.39 13.82 14.56C13.67 14.73 13.52 14.75 13.27 14.62C13.01 14.5 11.94 14.15 10.66 13.01C9.66 12.12 8.99 11.02 8.79 10.68C8.59 10.34 8.77 10.15 8.9 10.03C9.02 9.91 9.16 9.72 9.3 9.56C9.44 9.4 9.49 9.28 9.58 9.11C9.67 8.94 9.62 8.79 9.56 8.67C9.49 8.54 9.02 7.38 8.82 6.91C8.63 6.45 8.44 6.51 8.29 6.5C8.15 6.5 7.98 6.5 7.82 6.5L8.53 7.33Z"/>
            </svg>
          </div>

          <span className="font-semibold text-xs tracking-wide hidden sm:inline whitespace-nowrap">
            Chat on WhatsApp
          </span>

          {/* Online Indicator Badge */}
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-white"></span>
          </span>
        </button>
      </div>

      {/* WhatsApp Quick-Chat Popover */}
      {isOpen && (
        <div className="fixed bottom-36 sm:bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] max-w-sm bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Popover Header with Achse Brand & WhatsApp theme */}
          <div className="bg-[#0F2A4A] text-white p-4 flex items-center justify-between border-b border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center font-bold shrink-0">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19.01L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67ZM8.53 7.33C8.36 7.33 8.08 7.39 7.85 7.65C7.61 7.9 6.95 8.52 6.95 9.79C6.95 11.06 7.88 12.28 8.01 12.45C8.14 12.63 9.8 15.34 12.42 16.38C14.6 17.25 15.05 17.07 15.52 17.03C15.99 16.99 17.03 16.41 17.25 15.8C17.47 15.19 17.47 14.67 17.4 14.56C17.34 14.45 17.17 14.39 16.92 14.26C16.66 14.14 15.42 13.53 15.19 13.44C14.96 13.36 14.79 13.31 14.62 13.56C14.45 13.81 13.97 14.39 13.82 14.56C13.67 14.73 13.52 14.75 13.27 14.62C13.01 14.5 11.94 14.15 10.66 13.01C9.66 12.12 8.99 11.02 8.79 10.68C8.59 10.34 8.77 10.15 8.9 10.03C9.02 9.91 9.16 9.72 9.3 9.56C9.44 9.4 9.49 9.28 9.58 9.11C9.67 8.94 9.62 8.79 9.56 8.67C9.49 8.54 9.02 7.38 8.82 6.91C8.63 6.45 8.44 6.51 8.29 6.5C8.15 6.5 7.98 6.5 7.82 6.5L8.53 7.33Z"/>
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-bold text-white leading-tight">Achse Engineering Desk</h4>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>Pune Support · Fast Response</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close WhatsApp chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Popover Body */}
          <div className="p-4 bg-slate-50 space-y-3">
            <div className="p-3 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 leading-relaxed shadow-xs">
              <span className="font-semibold text-[#0F2A4A] block mb-0.5">Welcome to ACHSE LLP</span>
              Share your drawing, inquire about die/gauge specifications, or request bulk fastener availability. How can we help?
            </div>

            {/* Quick Inquiries List */}
            <div className="space-y-1.5 pt-1">
              <div className="text-[10px] font-mono-spec uppercase tracking-wider text-slate-500 font-semibold px-1">
                Frequently Asked Inquiries:
              </div>
              {quickInquiries.map((inquiry, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(inquiry.text)}
                  className="w-full text-left p-2 rounded bg-white hover:bg-slate-100 border border-slate-200 text-xs text-slate-800 transition-colors flex items-center justify-between group cursor-pointer"
                >
                  <span className="truncate pr-2 font-medium">{inquiry.label}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#25D366] shrink-0 transition-colors" />
                </button>
              ))}
            </div>

            {/* Custom Message Box */}
            <div className="pt-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={customMsg}
                  onChange={(e) => setCustomMsg(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSend();
                  }}
                  placeholder="Type a custom inquiry..."
                  className="flex-1 px-3 py-2 text-xs bg-white border border-slate-300 rounded focus:outline-hidden focus:border-[#25D366] focus:ring-1 focus:ring-[#25D366]"
                />
                <button
                  onClick={() => handleSend()}
                  aria-label="Send via WhatsApp"
                  className="p-2 rounded bg-[#25D366] hover:bg-[#20BD5A] text-white shadow-xs cursor-pointer shrink-0 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <div className="text-[10px] text-slate-500 text-center mt-2 font-mono-spec">
                Number: {siteConfig.whatsappDisplay}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
