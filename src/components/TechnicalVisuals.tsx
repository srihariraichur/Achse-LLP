/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * TechnicalVisuals: Vector blueprints, cross-section schematics,
 * and precision engineering illustrations for Achse LLP products.
 * Meets anti-slop guidelines: crisp CAD geometry, hairline rules,
 * authentic dimension lines, and zero stock-photo cliches.
 */

import React from 'react';

interface VisualProps {
  className?: string;
  productId?: string;
  category?: string;
}

export const ProductSchematic: React.FC<VisualProps> = ({ 
  className = "w-full h-48", 
  productId = "", 
  category = "dies" 
}) => {
  // 1. Tungsten Carbide Heading Die Schematic
  if (productId === 'tc-heading-dies' || productId === 'split-segmental-dies') {
    return (
      <div className={`relative bg-[#0E1E2E] border border-slate-700/60 rounded-md overflow-hidden flex items-center justify-center p-3 select-none ${className}`}>
        {/* Engineering grid lines */}
        <div className="absolute inset-0 bg-blueprint-dark opacity-40 pointer-events-none" />
        
        <svg viewBox="0 0 280 160" className="w-full h-full max-h-40" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Outer Steel Casing / Shrink Ring */}
          <rect x="50" y="25" width="180" height="110" rx="3" fill="#1E293B" stroke="#64748B" strokeWidth="1.5" />
          
          {/* Hatching for Steel Casing */}
          <line x1="55" y1="25" x2="70" y2="40" stroke="#334155" strokeWidth="1" />
          <line x1="75" y1="25" x2="90" y2="40" stroke="#334155" strokeWidth="1" />
          <line x1="210" y1="120" x2="225" y2="135" stroke="#334155" strokeWidth="1" />

          {/* Tungsten Carbide Insert (Carbide Nib) */}
          <rect x="95" y="42" width="90" height="76" rx="2" fill="#0F172A" stroke="#38BDF8" strokeWidth="1.8" />
          <rect x="105" y="52" width="70" height="56" fill="#0284C7" fillOpacity="0.15" stroke="#D97706" strokeWidth="1.2" strokeDasharray="3 2" />

          {/* Precision Extrusion Bore / Forming Cavity */}
          <path d="M125 52 L125 70 L132 82 L132 108 L148 108 L148 82 L155 70 L155 52 Z" fill="#0F2A4A" stroke="#38BDF8" strokeWidth="1.5" />

          {/* Centerline (Axis / Achse) */}
          <line x1="30" y1="80" x2="250" y2="80" stroke="#EF4444" strokeWidth="1" strokeDasharray="6 3 2 3" opacity="0.8" />
          
          {/* Dimension Callouts */}
          <line x1="50" y1="18" x2="230" y2="18" stroke="#94A3B8" strokeWidth="1" />
          <path d="M50 15 L50 21 M230 15 L230 21" stroke="#94A3B8" strokeWidth="1" />
          <text x="140" y="14" fill="#94A3B8" fontSize="8" fontFamily="JetBrains Mono" textAnchor="middle">Ø OUTER CASING</text>

          <line x1="242" y1="42" x2="242" y2="118" stroke="#D97706" strokeWidth="1" />
          <path d="M239 42 L245 42 M239 118 L245 118" stroke="#D97706" strokeWidth="1" />
          <text x="248" y="83" fill="#D97706" fontSize="7" fontFamily="JetBrains Mono" textAnchor="start">WC NIB</text>

          {/* Laser Marking on Die Face */}
          <rect x="105" y="121" width="70" height="10" rx="1" fill="#0B132B" stroke="#475569" strokeWidth="0.8" />
          <text x="140" y="128" fill="#F8FAFC" fontSize="6.5" fontFamily="JetBrains Mono" fontWeight="600" textAnchor="middle" letterSpacing="0.8">ACHSE · 2026</text>
          
          {/* Surface roughness indicator */}
          <text x="102" y="70" fill="#38BDF8" fontSize="6" fontFamily="JetBrains Mono">Ra &lt; 0.1µm</text>
        </svg>

        <div className="absolute bottom-2 right-2 flex items-center gap-1.5 bg-[#0F2A4A]/80 border border-slate-700 px-2 py-0.5 rounded text-[10px] font-mono-spec text-slate-300">
          <span>H13 + WC/Co</span>
        </div>
      </div>
    );
  }

  // 2. Trimming Die Schematic (Hex / Socket)
  if (productId === 'trimming-dies' || productId === 'heading-punches') {
    return (
      <div className={`relative bg-[#0E1E2E] border border-slate-700/60 rounded-md overflow-hidden flex items-center justify-center p-3 select-none ${className}`}>
        <div className="absolute inset-0 bg-blueprint-dark opacity-40 pointer-events-none" />
        
        <svg viewBox="0 0 280 160" className="w-full h-full max-h-40" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Outer Cylindrical Die Body */}
          <circle cx="140" cy="80" r="58" fill="#1E293B" stroke="#64748B" strokeWidth="1.5" />
          <circle cx="140" cy="80" r="44" fill="#0F172A" stroke="#38BDF8" strokeWidth="1.5" />
          
          {/* Precision Hexagon Trimming Aperture */}
          <polygon points="140,52 164,66 164,94 140,108 116,94 116,66" fill="#0F2A4A" stroke="#D97706" strokeWidth="2" />
          
          {/* Cutting Edge Land & Relief */}
          <polygon points="140,56 160,68 160,92 140,104 120,92 120,68" stroke="#F59E0B" strokeWidth="1" strokeDasharray="2 2" fill="none" />

          {/* Technical Centerlines */}
          <line x1="60" y1="80" x2="220" y2="80" stroke="#EF4444" strokeWidth="0.8" strokeDasharray="6 2 2 2" opacity="0.7" />
          <line x1="140" y1="12" x2="140" y2="148" stroke="#EF4444" strokeWidth="0.8" strokeDasharray="6 2 2 2" opacity="0.7" />

          {/* Achse Laser Engraved Code */}
          <text x="140" y="38" fill="#F8FAFC" fontSize="7" fontFamily="JetBrains Mono" fontWeight="600" textAnchor="middle" letterSpacing="1">ACHSE · TRIM M10</text>
          
          {/* Dimension indicator across flats */}
          <line x1="116" y1="80" x2="164" y2="80" stroke="#38BDF8" strokeWidth="1" />
          <circle cx="116" cy="80" r="2" fill="#38BDF8" />
          <circle cx="164" cy="80" r="2" fill="#38BDF8" />
          <text x="140" y="76" fill="#38BDF8" fontSize="8" fontFamily="JetBrains Mono" textAnchor="middle">S = 16.00 mm</text>
        </svg>

        <div className="absolute bottom-2 right-2 flex items-center gap-1.5 bg-[#0F2A4A]/80 border border-slate-700 px-2 py-0.5 rounded text-[10px] font-mono-spec text-amber-400">
          <span>HRC 62–64</span>
        </div>
      </div>
    );
  }

  // 3. Extrusion & Shear Tools
  if (productId === 'extrusion-dies' || productId === 'shear-blades-cutters') {
    return (
      <div className={`relative bg-[#0E1E2E] border border-slate-700/60 rounded-md overflow-hidden flex items-center justify-center p-3 select-none ${className}`}>
        <div className="absolute inset-0 bg-blueprint-dark opacity-40 pointer-events-none" />
        
        <svg viewBox="0 0 280 160" className="w-full h-full max-h-40" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Reduction Die Cross Section */}
          <path d="M40 30 L240 30 L240 130 L40 130 Z" fill="#1E293B" stroke="#64748B" strokeWidth="1.5" />
          
          {/* Extrusion Funnel Angle */}
          <path d="M40 50 L110 50 L140 68 L240 68 L240 92 L140 92 L110 110 L40 110 Z" fill="#0F172A" stroke="#38BDF8" strokeWidth="1.6" />
          
          {/* High Stress Carbide Zone */}
          <rect x="90" y="38" width="80" height="84" stroke="#D97706" strokeWidth="1.2" strokeDasharray="3 2" fill="none" />
          
          {/* Extrusion Flow Vector */}
          <line x1="60" y1="80" x2="220" y2="80" stroke="#38BDF8" strokeWidth="1.5" markerEnd="url(#arrow)" />
          <polygon points="215,77 225,80 215,83" fill="#38BDF8" />
          
          {/* Lead-in Angle Note */}
          <text x="135" y="60" fill="#F59E0B" fontSize="7" fontFamily="JetBrains Mono">2α = 30°</text>
          
          {/* Achse Laser Stamp */}
          <text x="140" y="146" fill="#94A3B8" fontSize="7" fontFamily="JetBrains Mono" textAnchor="middle">ACHSE SPEC · REDUCTION DIE</text>
        </svg>

        <div className="absolute bottom-2 right-2 flex items-center gap-1.5 bg-[#0F2A4A]/80 border border-slate-700 px-2 py-0.5 rounded text-[10px] font-mono-spec text-sky-400">
          <span>Forward/Backward</span>
        </div>
      </div>
    );
  }

  // 4. Precision Gauges (Plug, Ring, Slip & Snap Gauges)
  if (category === 'gauges' || productId.includes('gauge') || productId.includes('snap') || productId.includes('slip')) {
    const isRing = productId.includes('ring');
    const isSnap = productId.includes('snap');
    const isSlip = productId.includes('slip');
    return (
      <div className={`relative bg-[#0E1E2E] border border-slate-700/60 rounded-md overflow-hidden flex items-center justify-center p-3 select-none ${className}`}>
        <div className="absolute inset-0 bg-blueprint-dark opacity-40 pointer-events-none" />
        
        {isSnap ? (
          /* Precision C-Frame Snap Gauge Vector */
          <svg viewBox="0 0 280 160" className="w-full h-full max-h-40" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Centerline */}
            <line x1="20" y1="80" x2="260" y2="80" stroke="#EF4444" strokeWidth="0.8" strokeDasharray="6 2 2 2" opacity="0.6" />

            {/* Cast C-Frame Body */}
            <path
              d="M 120 30 C 50 30 45 130 120 130 L 160 130 C 142 112 142 48 160 30 Z"
              fill="#1E293B"
              stroke="#64748B"
              strokeWidth="1.8"
            />
            {/* Thermal Insulating Grip Plate */}
            <path
              d="M 85 45 C 65 55 65 105 85 115 C 80 105 80 55 85 45 Z"
              fill="#0F172A"
              stroke="#D97706"
              strokeWidth="1.2"
            />
            <text x="68" y="82" fill="#F59E0B" fontSize="6" fontFamily="JetBrains Mono" transform="rotate(-90 68 82)" textAnchor="middle">HEAT INSULATED</text>

            {/* Top Anvil Holder & Anvils */}
            <rect x="155" y="24" width="45" height="18" rx="2" fill="#0F2A4A" stroke="#38BDF8" strokeWidth="1.2" />
            {/* GO Anvil (Front) */}
            <rect x="160" y="42" width="14" height="16" fill="#047857" fillOpacity="0.3" stroke="#10B981" strokeWidth="1.5" />
            <text x="167" y="53" fill="#10B981" fontSize="6" fontFamily="JetBrains Mono" fontWeight="bold" textAnchor="middle">GO</text>
            {/* NO-GO Anvil (Rear) */}
            <rect x="180" y="42" width="14" height="20" fill="#BE123C" fillOpacity="0.3" stroke="#F43F5E" strokeWidth="1.5" />
            <text x="187" y="55" fill="#F43F5E" fontSize="5.5" fontFamily="JetBrains Mono" fontWeight="bold" textAnchor="middle">NOGO</text>

            {/* Bottom Stationary Tungsten Carbide Anvil */}
            <rect x="155" y="118" width="45" height="18" rx="2" fill="#0F2A4A" stroke="#38BDF8" strokeWidth="1.2" />
            <rect x="158" y="102" width="38" height="16" fill="#1E293B" stroke="#38BDF8" strokeWidth="1.2" />
            <line x1="160" y1="102" x2="194" y2="102" stroke="#F59E0B" strokeWidth="2" />

            {/* Measured Workpiece Preview */}
            <circle cx="167" cy="78" r="18" fill="#38BDF8" fillOpacity="0.1" stroke="#38BDF8" strokeWidth="1" strokeDasharray="3 2" />
            <line x1="167" y1="60" x2="167" y2="96" stroke="#38BDF8" strokeWidth="0.8" />
            <text x="167" y="81" fill="#38BDF8" fontSize="6.5" fontFamily="JetBrains Mono" textAnchor="middle">Ø PART</text>

            {/* Achse Laser Marking */}
            <text x="110" y="74" fill="#F8FAFC" fontSize="7.5" fontFamily="JetBrains Mono" fontWeight="600" textAnchor="middle">ACHSE</text>
            <text x="110" y="85" fill="#94A3B8" fontSize="6" fontFamily="JetBrains Mono" textAnchor="middle">25–50 mm</text>
            <text x="110" y="94" fill="#F59E0B" fontSize="5.5" fontFamily="JetBrains Mono" textAnchor="middle">±0.002 mm</text>
          </svg>
        ) : isSlip ? (
          /* Precision Slip Gauges (Gauge Blocks) Stack Vector */
          <svg viewBox="0 0 280 160" className="w-full h-full max-h-40" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Datum Surface Plate */}
            <rect x="25" y="128" width="230" height="8" rx="1" fill="#0F172A" stroke="#334155" strokeWidth="1" />
            <line x1="25" y1="128" x2="255" y2="128" stroke="#38BDF8" strokeWidth="1.5" opacity="0.8" />
            <text x="35" y="124" fill="#38BDF8" fontSize="6" fontFamily="JetBrains Mono">DATUM SURFACE</text>

            {/* Block 1 (50.000 mm Base Master Block) */}
            <rect x="55" y="85" width="125" height="43" rx="1.5" fill="#1E293B" stroke="#64748B" strokeWidth="1.5" />
            <line x1="55" y1="85" x2="180" y2="85" stroke="#38BDF8" strokeWidth="1" opacity="0.6" />
            <text x="117" y="105" fill="#F8FAFC" fontSize="8" fontFamily="JetBrains Mono" fontWeight="bold" textAnchor="middle">ACHSE · 50.000 mm</text>
            <text x="117" y="117" fill="#F59E0B" fontSize="6.5" fontFamily="JetBrains Mono" textAnchor="middle">GRADE 0 · ISO 3650</text>

            {/* Block 2 (20.000 mm Wrung Block) */}
            <rect x="72" y="55" width="90" height="30" rx="1.5" fill="#0F2A4A" stroke="#38BDF8" strokeWidth="1.4" />
            <line x1="72" y1="55" x2="162" y2="55" stroke="#38BDF8" strokeWidth="1" opacity="0.6" />
            <text x="117" y="73" fill="#F8FAFC" fontSize="7" fontFamily="JetBrains Mono" fontWeight="600" textAnchor="middle">ACHSE · 20.000 mm</text>

            {/* Block 3 (1.005 mm Precision Slip Block) */}
            <rect x="88" y="38" width="58" height="17" rx="1" fill="#1E293B" stroke="#F59E0B" strokeWidth="1.2" />
            <text x="117" y="50" fill="#F59E0B" fontSize="6.5" fontFamily="JetBrains Mono" fontWeight="bold" textAnchor="middle">1.005 mm</text>

            {/* Wringing cohesion label */}
            <line x1="42" y1="85" x2="55" y2="85" stroke="#10B981" strokeWidth="1.5" />
            <line x1="58" y1="55" x2="72" y2="55" stroke="#10B981" strokeWidth="1.5" />
            <circle cx="42" cy="85" r="1.5" fill="#10B981" />
            <circle cx="58" cy="55" r="1.5" fill="#10B981" />
            <text x="40" y="72" fill="#10B981" fontSize="6" fontFamily="JetBrains Mono" textAnchor="end">WRUNG</text>

            {/* Total Stack Height Dimension Callout */}
            <line x1="195" y1="38" x2="195" y2="128" stroke="#38BDF8" strokeWidth="1" />
            <line x1="190" y1="38" x2="200" y2="38" stroke="#38BDF8" strokeWidth="1" />
            <line x1="190" y1="128" x2="200" y2="128" stroke="#38BDF8" strokeWidth="1" />
            <polygon points="195,38 193,44 197,44" fill="#38BDF8" />
            <polygon points="195,128 193,122 197,122" fill="#38BDF8" />
            <text x="205" y="80" fill="#38BDF8" fontSize="7.5" fontFamily="JetBrains Mono" fontWeight="bold">Σ 71.005</text>
            <text x="205" y="90" fill="#94A3B8" fontSize="6" fontFamily="JetBrains Mono">±0.0001 mm</text>
          </svg>
        ) : isRing ? (
          /* Ring Gauge Vector */
          <svg viewBox="0 0 280 160" className="w-full h-full max-h-40" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Outer Knurled Ring Body */}
            <circle cx="140" cy="80" r="54" fill="#1E293B" stroke="#64748B" strokeWidth="1.5" />
            <circle cx="140" cy="80" r="50" stroke="#475569" strokeWidth="1" strokeDasharray="2 2" fill="none" />
            
            {/* Precision Calibrated Inner Hole */}
            <circle cx="140" cy="80" r="26" fill="#0F172A" stroke="#38BDF8" strokeWidth="2" />
            
            {/* Achse Laser Engraved Details */}
            <text x="140" y="48" fill="#F8FAFC" fontSize="7" fontFamily="JetBrains Mono" fontWeight="600" textAnchor="middle">ACHSE · GO</text>
            <text x="140" y="118" fill="#D97706" fontSize="7" fontFamily="JetBrains Mono" fontWeight="600" textAnchor="middle">M16 x 1.5 - 6g</text>
            
            {/* Tolerance callout */}
            <line x1="114" y1="80" x2="166" y2="80" stroke="#38BDF8" strokeWidth="1" />
            <circle cx="114" cy="80" r="1.5" fill="#38BDF8" />
            <circle cx="166" cy="80" r="1.5" fill="#38BDF8" />
            <text x="140" y="76" fill="#38BDF8" fontSize="8" fontFamily="JetBrains Mono" textAnchor="middle">Ø 16.000 ±0.002</text>
          </svg>
        ) : (
          /* Reversible Double-Ended Plug Gauge */
          <svg viewBox="0 0 280 160" className="w-full h-full max-h-40" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Knurled Center Hexagonal / Round Handle */}
            <rect x="95" y="65" width="90" height="30" rx="3" fill="#1E293B" stroke="#64748B" strokeWidth="1.5" />
            {/* Knurling Pattern */}
            <line x1="105" y1="65" x2="105" y2="95" stroke="#334155" strokeWidth="1" />
            <line x1="115" y1="65" x2="115" y2="95" stroke="#334155" strokeWidth="1" />
            <line x1="165" y1="65" x2="165" y2="95" stroke="#334155" strokeWidth="1" />
            <line x1="175" y1="65" x2="175" y2="95" stroke="#334155" strokeWidth="1" />

            {/* GO Plug End (Green band / Long cylinder) */}
            <rect x="35" y="68" width="60" height="24" rx="1.5" fill="#047857" fillOpacity="0.25" stroke="#10B981" strokeWidth="1.5" />
            <line x1="90" y1="68" x2="90" y2="92" stroke="#10B981" strokeWidth="2" />
            <text x="65" y="82" fill="#10B981" fontSize="8" fontFamily="JetBrains Mono" fontWeight="600" textAnchor="middle">GO</text>

            {/* NO-GO Plug End (Red band / Short cylinder) */}
            <rect x="185" y="70" width="45" height="20" rx="1.5" fill="#BE123C" fillOpacity="0.25" stroke="#F43F5E" strokeWidth="1.5" />
            <line x1="190" y1="70" x2="190" y2="90" stroke="#F43F5E" strokeWidth="2" />
            <text x="207" y="82" fill="#F43F5E" fontSize="7" fontFamily="JetBrains Mono" fontWeight="600" textAnchor="middle">NOGO</text>

            {/* Handle Laser Marking */}
            <text x="140" y="78" fill="#F8FAFC" fontSize="7" fontFamily="JetBrains Mono" fontWeight="600" textAnchor="middle">ACHSE</text>
            <text x="140" y="88" fill="#94A3B8" fontSize="6.5" fontFamily="JetBrains Mono" textAnchor="middle">Ø 12 H7</text>
          </svg>
        )}

        <div className="absolute bottom-2 right-2 flex items-center gap-1.5 bg-[#0F2A4A]/80 border border-slate-700 px-2 py-0.5 rounded text-[10px] font-mono-spec text-emerald-400">
          <span>{isSnap ? 'IS 863 / DIN' : isSlip ? 'ISO 3650 / Grade 0' : isRing ? 'DIN 2250 / ISO' : 'ISO / IS 3455'}</span>
        </div>
      </div>
    );
  }

  // 5. Automotive Components Schematic (Cold Formed Sleeves, Gear Blanks & Turned Shafts)
  if (productId === 'automotive-components' || productId === 'automotive-featured' || category === 'automotive') {
    return (
      <div className={`relative bg-[#0E1E2E] border border-slate-700/60 rounded-md overflow-hidden flex items-center justify-center p-3 select-none ${className}`}>
        <div className="absolute inset-0 bg-blueprint-dark opacity-40 pointer-events-none" />
        
        <svg viewBox="0 0 280 160" className="w-full h-full max-h-40" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Stepped Automotive Shaft with Flange & Spline Profile */}
          <line x1="20" y1="80" x2="260" y2="80" stroke="#EF4444" strokeWidth="0.8" strokeDasharray="6 2 2 2" opacity="0.7" />
          
          {/* Stepped Shaft Body */}
          <rect x="40" y="65" width="45" height="30" rx="1" fill="#1E293B" stroke="#38BDF8" strokeWidth="1.2" />
          {/* Flanged Collar */}
          <rect x="85" y="45" width="20" height="70" rx="2" fill="#0F2A4A" stroke="#38BDF8" strokeWidth="1.5" />
          {/* Formed Spline / Pinion Section */}
          <rect x="105" y="55" width="50" height="50" fill="#1E293B" stroke="#D97706" strokeWidth="1.5" />
          {/* Spline Teeth Lines */}
          <line x1="115" y1="55" x2="115" y2="105" stroke="#F59E0B" strokeWidth="1" />
          <line x1="125" y1="55" x2="125" y2="105" stroke="#F59E0B" strokeWidth="1" />
          <line x1="135" y1="55" x2="135" y2="105" stroke="#F59E0B" strokeWidth="1" />
          <line x1="145" y1="55" x2="145" y2="105" stroke="#F59E0B" strokeWidth="1" />

          {/* Precision Turned Journal */}
          <rect x="155" y="62" width="55" height="36" fill="#0B132B" stroke="#38BDF8" strokeWidth="1.2" />
          
          {/* Threaded End / Bush Fit */}
          <rect x="210" y="68" width="35" height="24" fill="#1E293B" stroke="#64748B" strokeWidth="1" />
          <line x1="216" y1="68" x2="216" y2="92" stroke="#94A3B8" strokeWidth="0.8" />
          <line x1="222" y1="68" x2="222" y2="92" stroke="#94A3B8" strokeWidth="0.8" />
          <line x1="228" y1="68" x2="228" y2="92" stroke="#94A3B8" strokeWidth="0.8" />
          <line x1="234" y1="68" x2="234" y2="92" stroke="#94A3B8" strokeWidth="0.8" />

          {/* Dimension Callout */}
          <line x1="85" y1="36" x2="155" y2="36" stroke="#94A3B8" strokeWidth="1" />
          <path d="M85 33 L85 39 M155 33 L155 39" stroke="#94A3B8" strokeWidth="1" />
          <text x="120" y="32" fill="#38BDF8" fontSize="7.5" fontFamily="JetBrains Mono" textAnchor="middle">COLD FORMED + CNC TURNED</text>

          {/* Achse Stamp */}
          <text x="120" y="142" fill="#F8FAFC" fontSize="7" fontFamily="JetBrains Mono" fontWeight="600" textAnchor="middle">ACHSE AUTOMOTIVE · PUNE</text>
        </svg>

        <div className="absolute bottom-2 right-2 flex items-center gap-1.5 bg-[#0F2A4A]/80 border border-slate-700 px-2 py-0.5 rounded text-[10px] font-mono-spec text-sky-400">
          <span>Near-Net Shape + CNC</span>
        </div>
      </div>
    );
  }

  // 6. Fasteners Default Technical Blueprint
  return (
    <div className={`relative bg-[#0E1E2E] border border-slate-700/60 rounded-md overflow-hidden flex items-center justify-center p-3 select-none ${className}`}>
      <div className="absolute inset-0 bg-blueprint-dark opacity-40 pointer-events-none" />
      
      <svg viewBox="0 0 280 160" className="w-full h-full max-h-40" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Hex Flange Bolt Technical Drawing */}
        <polygon points="45,62 60,54 75,62 75,98 60,106 45,98" fill="#1E293B" stroke="#38BDF8" strokeWidth="1.5" />
        <rect x="75" y="50" width="10" height="60" rx="1" fill="#0F2A4A" stroke="#38BDF8" strokeWidth="1.5" />
        
        {/* Bolt Shank (Unthreaded) */}
        <rect x="85" y="65" width="45" height="30" fill="#1E293B" stroke="#64748B" strokeWidth="1.2" />
        
        {/* Threaded Section */}
        <rect x="130" y="66" width="95" height="28" fill="#0F172A" stroke="#38BDF8" strokeWidth="1.2" />
        
        {/* Thread Ridges / Crests */}
        <line x1="140" y1="63" x2="140" y2="97" stroke="#D97706" strokeWidth="1" />
        <line x1="150" y1="63" x2="150" y2="97" stroke="#D97706" strokeWidth="1" />
        <line x1="160" y1="63" x2="160" y2="97" stroke="#D97706" strokeWidth="1" />
        <line x1="170" y1="63" x2="170" y2="97" stroke="#D97706" strokeWidth="1" />
        <line x1="180" y1="63" x2="180" y2="97" stroke="#D97706" strokeWidth="1" />
        <line x1="190" y1="63" x2="190" y2="97" stroke="#D97706" strokeWidth="1" />
        <line x1="200" y1="63" x2="200" y2="97" stroke="#D97706" strokeWidth="1" />
        <line x1="210" y1="63" x2="210" y2="97" stroke="#D97706" strokeWidth="1" />
        <line x1="220" y1="63" x2="220" y2="97" stroke="#D97706" strokeWidth="1" />

        {/* Centerline */}
        <line x1="30" y1="80" x2="245" y2="80" stroke="#EF4444" strokeWidth="0.8" strokeDasharray="6 2 2 2" opacity="0.7" />

        {/* Grade Stamp on Head */}
        <text x="60" y="82" fill="#F8FAFC" fontSize="6.5" fontFamily="JetBrains Mono" fontWeight="700" textAnchor="middle">10.9</text>
        
        {/* Dimension indicator */}
        <line x1="85" y1="36" x2="225" y2="36" stroke="#94A3B8" strokeWidth="1" />
        <path d="M85 33 L85 39 M225 33 L225 39" stroke="#94A3B8" strokeWidth="1" />
        <text x="155" y="32" fill="#94A3B8" fontSize="8" fontFamily="JetBrains Mono" textAnchor="middle">L = LENGTH TO SPEC</text>
      </svg>

      <div className="absolute bottom-2 right-2 flex items-center gap-1.5 bg-[#0F2A4A]/80 border border-slate-700 px-2 py-0.5 rounded text-[10px] font-mono-spec text-amber-400">
        <span>DIN 931 / ISO 4014</span>
      </div>
    </div>
  );
};

/**
 * Cold Forging 4-Stage Process Flow Diagram
 * (Wire Cutoff -> Preform -> Heading -> Trimming)
 */
export const ColdForgingSequenceDiagram: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`p-4 sm:p-6 bg-[#0E1E2E] border border-slate-700/80 rounded-lg w-full overflow-hidden ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 pb-3 border-b border-slate-700 gap-1.5">
        <div>
          <span className="text-xs font-mono-spec uppercase tracking-wider text-amber-400">Process Engineering</span>
          <h4 className="text-sm sm:text-base font-semibold text-white mt-0.5">Cold Forging Progression & Tooling Sequence</h4>
        </div>
        <div className="text-left sm:text-right">
          <span className="text-[11px] sm:text-xs font-mono-spec text-slate-400">Achse Design Support</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 w-full">
        {/* Stage 1: Cut-off */}
        <div className="p-2.5 sm:p-3 bg-slate-900/70 border border-slate-700/70 rounded-md flex flex-col items-center text-center">
          <div className="flex items-center justify-between w-full mb-1">
            <span className="text-[10px] sm:text-xs font-mono-spec text-amber-400/90 font-semibold">Stage 01</span>
            <span className="text-[9px] font-mono-spec text-slate-500 uppercase">Input</span>
          </div>
          <div className="w-12 sm:w-16 h-16 sm:h-20 flex items-center justify-center my-0.5 sm:my-1">
            <svg viewBox="0 0 60 80" className="w-full h-full" fill="none">
              <rect x="22" y="15" width="16" height="50" rx="1" fill="#334155" stroke="#94A3B8" strokeWidth="1.5" />
              {/* Quill Cut Line */}
              <line x1="12" y1="15" x2="48" y2="15" stroke="#EF4444" strokeWidth="1.5" strokeDasharray="3 2" />
              <text x="30" y="75" fill="#94A3B8" fontSize="6.5" fontFamily="JetBrains Mono" textAnchor="middle">Ø Wire</text>
            </svg>
          </div>
          <span className="text-xs font-semibold text-white mt-1 leading-snug">Shear & Cut-Off</span>
          <span className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 leading-tight">Burr-free wire blank</span>
        </div>

        {/* Stage 2: Preform / 1st Punch */}
        <div className="p-2.5 sm:p-3 bg-slate-900/70 border border-slate-700/70 rounded-md flex flex-col items-center text-center">
          <div className="flex items-center justify-between w-full mb-1">
            <span className="text-[10px] sm:text-xs font-mono-spec text-amber-400/90 font-semibold">Stage 02</span>
            <span className="text-[9px] font-mono-spec text-slate-500 uppercase">1st Punch</span>
          </div>
          <div className="w-12 sm:w-16 h-16 sm:h-20 flex items-center justify-center my-0.5 sm:my-1">
            <svg viewBox="0 0 60 80" className="w-full h-full" fill="none">
              <path d="M18 20 L42 20 L38 34 L38 65 L22 65 L22 34 Z" fill="#1E293B" stroke="#38BDF8" strokeWidth="1.5" />
              <text x="30" y="75" fill="#94A3B8" fontSize="6.5" fontFamily="JetBrains Mono" textAnchor="middle">Pre-head</text>
            </svg>
          </div>
          <span className="text-xs font-semibold text-white mt-1 leading-snug">1st Preform Heading</span>
          <span className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 leading-tight">Volume distribution</span>
        </div>

        {/* Stage 3: Final Head & Shank Extrusion */}
        <div className="p-2.5 sm:p-3 bg-slate-900/70 border border-slate-700/70 rounded-md flex flex-col items-center text-center">
          <div className="flex items-center justify-between w-full mb-1">
            <span className="text-[10px] sm:text-xs font-mono-spec text-amber-400/90 font-semibold">Stage 03</span>
            <span className="text-[9px] font-mono-spec text-slate-500 uppercase">2nd Die</span>
          </div>
          <div className="w-12 sm:w-16 h-16 sm:h-20 flex items-center justify-center my-0.5 sm:my-1">
            <svg viewBox="0 0 60 80" className="w-full h-full" fill="none">
              <rect x="12" y="16" width="36" height="12" rx="2" fill="#0F2A4A" stroke="#D97706" strokeWidth="1.5" />
              <rect x="23" y="28" width="14" height="42" fill="#1E293B" stroke="#38BDF8" strokeWidth="1.2" />
              <text x="30" y="77" fill="#94A3B8" fontSize="6.5" fontFamily="JetBrains Mono" textAnchor="middle">Final Form</text>
            </svg>
          </div>
          <span className="text-xs font-semibold text-white mt-1 leading-snug">2nd Punch & Form</span>
          <span className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 leading-tight">Carbide die cavity</span>
        </div>

        {/* Stage 4: Trimming / Secondary Threading */}
        <div className="p-2.5 sm:p-3 bg-slate-900/70 border border-slate-700/70 rounded-md flex flex-col items-center text-center">
          <div className="flex items-center justify-between w-full mb-1">
            <span className="text-[10px] sm:text-xs font-mono-spec text-amber-400/90 font-semibold">Stage 04</span>
            <span className="text-[9px] font-mono-spec text-slate-500 uppercase">QA Finish</span>
          </div>
          <div className="w-12 sm:w-16 h-16 sm:h-20 flex items-center justify-center my-0.5 sm:my-1">
            <svg viewBox="0 0 60 80" className="w-full h-full" fill="none">
              <polygon points="15,22 23,16 37,16 45,22 45,28 15,28" fill="#D97706" fillOpacity="0.3" stroke="#D97706" strokeWidth="1.5" />
              <rect x="23" y="28" width="14" height="42" fill="#1E293B" stroke="#38BDF8" strokeWidth="1.2" />
              <line x1="23" y1="46" x2="37" y2="46" stroke="#94A3B8" strokeWidth="0.8" />
              <line x1="23" y1="52" x2="37" y2="52" stroke="#94A3B8" strokeWidth="0.8" />
              <line x1="23" y1="58" x2="37" y2="58" stroke="#94A3B8" strokeWidth="0.8" />
              <text x="30" y="77" fill="#94A3B8" fontSize="6.5" fontFamily="JetBrains Mono" textAnchor="middle">Hex Trim</text>
            </svg>
          </div>
          <span className="text-xs font-semibold text-white mt-1 leading-snug">Trimming & Thread QA</span>
          <span className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 leading-tight">100% Gauge verified</span>
        </div>
      </div>
    </div>
  );
};
