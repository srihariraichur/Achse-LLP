/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * 404 Not Found Page Component
 * Industrial, clean aesthetic matching Achse LLP brand.
 */

import React from 'react';
import { ArrowLeft, Home, FileQuestion } from 'lucide-react';

interface NotFoundProps {
  onGoHome: () => void;
}

export const NotFound: React.FC<NotFoundProps> = ({ onGoHome }) => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center py-20 px-4 bg-white">
      <div className="max-w-md w-full text-center p-8 bg-slate-50 border border-slate-200 rounded-lg shadow-xs">
        <div className="w-14 h-14 rounded-full bg-[#0F2A4A]/10 text-[#0F2A4A] mx-auto flex items-center justify-center mb-4">
          <FileQuestion className="w-7 h-7" />
        </div>
        
        <span className="text-xs font-mono-spec uppercase text-amber-700 font-bold tracking-widest">
          Error 404
        </span>
        <h1 className="text-2xl font-extrabold text-[#0F2A4A] mt-1">
          Drawing or Page Not Found
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed">
          The requested engineering specification, catalogue section, or page URL does not exist or has been relocated.
        </p>

        <div className="mt-6 pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onGoHome}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded text-xs font-semibold uppercase tracking-wider text-white bg-[#0F2A4A] hover:bg-[#1E3A5F] transition-colors cursor-pointer"
          >
            <Home className="w-4 h-4 text-amber-400" />
            <span>Return to Home</span>
          </button>
        </div>
      </div>
    </div>
  );
};
