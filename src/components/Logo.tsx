/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * ACHSE LLP Logo Component
 * Incorporates the official brand mark:
 * - 3D Coordinate Axis Symbol (Z, Y, X axes + datum circle) with faceted 3D 'A'
 * - Modern geometric ACHSE wordmark with signature 3-bar 'E' (middle bar in steel grey)
 * - Tagline: "PRECISION IN MOTION"
 */

import React, { useState } from 'react';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark' | 'footer';
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ 
  className = "", 
  variant = 'light',
  showTagline = true 
}) => {
  const isDark = variant === 'dark' || variant === 'footer';

  return (
    <div className={`flex items-center gap-3 sm:gap-4 select-none ${className}`}>
      {/* 
        Official 3D Coordinate Axis Symbol (X, Y, Z axes, reference circle, and faceted 3D 'A')
        Targeted by CSS selector 2: div#root > div > header > div > div > button > div > div
      */}
      <div className={`relative flex items-center justify-center w-13 h-13 sm:w-16 sm:h-16 rounded-lg shrink-0 transition-transform group-hover:scale-105 p-1 ${
        isDark 
          ? 'bg-white shadow-xs ring-1 ring-white/20' 
          : 'bg-white border border-slate-200/90 shadow-xs'
      }`}>
        <img 
          src="/assets/aistudio/achse-logo-transpONLY__A_-_Copy_7922e120.png" 
          alt="Achse Precision Coordinate Logo"
          className="w-11 h-11 sm:w-14 sm:h-14 object-contain"
        />
      </div>

      {/* Brand Wordmark & Tagline */}
      <div className="flex flex-col text-left">
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* ACHSE Wordmark with signature 3-bar 'E' */}
          <div className="flex items-center tracking-wider font-black text-2xl sm:text-3xl leading-none">
            <span className={isDark ? 'text-white' : 'text-[#0F172A]'}>
              ACHS
            </span>
            {/* Signature 3-Bar E */}
            <div className="flex flex-col justify-between h-5 sm:h-6 w-4.5 sm:w-5.5 ml-1 py-0.5">
              <span className={`h-1.5 w-full rounded-xs ${isDark ? 'bg-white' : 'bg-[#0F172A]'}`} />
              <span className="h-1.5 w-full rounded-xs bg-[#808285]" />
              <span className={`h-1.5 w-full rounded-xs ${isDark ? 'bg-white' : 'bg-[#0F172A]'}`} />
            </div>
          </div>

          <span className={`text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
            isDark 
              ? 'bg-white/10 text-amber-400 border-white/20' 
              : 'bg-slate-100 text-slate-700 border-slate-300'
          }`}>
            LLP
          </span>
        </div>

        {/* Tagline: PRECISION IN MOTION */}
        {showTagline && (
          <div className="flex items-center mt-1 sm:mt-1.5">
            <span className={`text-[10px] sm:text-[11.5px] font-extrabold tracking-[0.22em] sm:tracking-[0.25em] uppercase whitespace-nowrap ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}>
              PRECISION IN MOTION
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
