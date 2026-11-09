/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * ACHSE LLP — Corporate Content & Product Repository
 * Single source of truth for all website text, product catalogue items,
 * specifications, contact details, and engineering capabilities.
 */

export interface ProductItem {
  id: string;
  name: string;
  category: 'dies' | 'gauges' | 'fasteners' | 'machined';
  subcategory: string;
  shortDesc: string;
  specifications: { label: string; value: string }[];
  application: string;
  badge?: string;
  featured?: boolean;
  drawingRef?: string;
  image?: string;
}

export interface CapabilityItem {
  category: string;
  items: string[];
  notes?: string;
}

export const siteConfig = {
  companyName: "ACHSE LLP",
  tagline: "Precision Tooling, Fastener Solutions, Machined Engineering Components and Cold Forging Consultation With Training",
  shortTagline: "Engineered to Drawing. Verified by Gauge.",
  valueProposition: "Supplying precision cold forging dies, verified inspection gauges, high-tensile fasteners, and custom CNC machined components — backed by professional Cold Forging Consultation and Technical Training from Pune.",
  establishedYear: "2026",
  city: "Pune",
  state: "Maharashtra",
  country: "India",
  phone: "+91 91565 10992",
  email: "srihari@achse.in",
  website: "www.achse.in",
  address: "Pune, Maharashtra, India",
  workingHours: "Monday – Saturday: 09:00 to 18:00 IST | Sunday: Closed",
  whatsappNumber: "+919156510992",
  whatsappDisplay: "+91 91565 10992",
  catalogues: {
    tooling: "/assets/Achse_Cold_Forging_Dies_and_Gauges_Catalogue.pdf",
    fasteners: "/assets/Achse_Fasteners_Catalogue.pdf",
    automotive: "/assets/Achse_Automotive_Components_Catalogue.pdf",
  },
  catalogueDownloadUrl: "/assets/Achse_Cold_Forging_Dies_and_Gauges_Catalogue.pdf",
};

/**
 * Generates direct WhatsApp chat link with pre-filled message
 */
export const getWhatsAppUrl = (customMessage?: string): string => {
  const cleanNumber = siteConfig.whatsappNumber.replace(/[^0-9]/g, '');
  const defaultText = "Hello Achse LLP, I would like to inquire regarding tooling, fasteners, and engineering capabilities.";
  const text = encodeURIComponent(customMessage || defaultText);
  return `https://wa.me/${cleanNumber}?text=${text}`;
};

export const businessPillars = [
  {
    id: "cold-forging-tooling",
    title: "Cold Forging Tools & Gauges",
    subtitle: "Dies & Gauges to Drawing",
    desc: "Precision tungsten carbide heading dies, trimming dies, extrusion tooling, and micron-accurate inspection gauges supplied to customer drawings.",
    actionText: "Explore Tooling & Gauges",
    targetSection: "tools-gauges",
  },
  {
    id: "fastener-solutions",
    title: "Fasteners Solution",
    subtitle: "Standard & Custom Fasteners",
    desc: "High-tensile bolts, screws, studs, nuts, and cold-forged special parts supplied to IS / DIN / ISO / ASTM standards with managed quality and delivery.",
    actionText: "View Fasteners",
    targetSection: "fasteners",
  },
  {
    id: "automotive-machined",
    title: "Automotive Components",
    subtitle: "Machined Solutions & CNC Turning",
    desc: "Custom components and tools manufactured on CNC machines to customer drawings with stringent dimensional accuracy and reliability.",
    actionText: "View Machined Solutions",
    targetSection: "automotive",
  },
  {
    id: "cold-forging-consultation-training",
    title: "Consultation & Training",
    subtitle: "Process Advisory & Skill Training",
    desc: "Cold forging design advisory, multi-station progression layout, shrink-fit pre-stress analysis, and customized hands-on training for manufacturing teams.",
    actionText: "Explore Advisory & Training",
    targetSection: "consultant",
  },
];

export const whyAchsePoints = [
  {
    id: "precision-focus",
    title: "Dimensional Precision & Gauge Verification",
    desc: "Every component, die, and gauge is verified against stringent tolerances with calibrated measurement gauges and inspection reports.",
  },
  {
    id: "cnc-machining",
    title: "CNC Machining Capability",
    desc: "Specialized machined components and custom tools manufactured on CNC machines, strictly to customer drawings and technical specifications.",
  },
  {
    id: "design-support",
    title: "Cold Forging Consultation & Training",
    desc: "Process and tooling design advisory, heading progression optimization, and technical training from raw part blueprint through to production.",
  },
  {
    id: "global-network",
    title: "Global Tooling Partner Network",
    desc: "Established international partner network spanning specialized tooling manufacturers, including China and Taiwan, for custom tooling supplied to your drawing.",
  },
  {
    id: "on-time-delivery",
    title: "Managed On-Time Delivery",
    desc: "Dedicated supply chain planning, batch traceability, and prompt dispatch from Pune to eliminate assembly line stoppages.",
  },
  {
    id: "pune-hub",
    title: "Pune Industrial Base",
    desc: "Strategically located in Pune's prime manufacturing corridor, enabling rapid technical collaboration and dependable local logistics.",
  },
];

export const industriesServed = [
  {
    name: "General Engineering",
    desc: "Precision turned pins, bushes, fasteners, and custom tooling for mechanical assemblies.",
  },
  {
    name: "Industrial Machinery & Equipment",
    desc: "Heavy-duty fasteners, wear-resistant carbide dies, and CNC machined parts for machine builders.",
  },
  {
    name: "Electrical & Power Equipment",
    desc: "Conductive brass/copper fasteners, switchgear components, and precision thread gauges.",
  },
  {
    name: "Construction & Infrastructure",
    desc: "High-tensile structural bolts, anchor studs, and heavy hex fasteners compliant with international codes.",
  },
  {
    name: "Agriculture & Farm Equipment",
    desc: "Cold-forged linkages, heavy pins, high-fatigue bolts, and durable wear tooling.",
  },
  {
    name: "OEMs & Capital Goods",
    desc: "Sub-contracted CNC components and scheduled batch supply of verified fastener hardware.",
  },
];

export const coldForgingCatalogue: ProductItem[] = [
  {
    id: "tc-heading-dies",
    name: "Tungsten Carbide Heading Dies",
    category: "dies",
    subcategory: "Cold Forging Dies",
    shortDesc: "High-compression tungsten carbide inserts fitted into alloy steel stress rings for cold heading fastener heads, rivets, and stepped shafts.",
    specifications: [
      { label: "Insert Material", value: "Micro-grain Tungsten Carbide (WC-Co)" },
      { label: "Casing / Stress Ring", value: "High-Tensile Alloy Tool Steel (H13 / DIN 1.2344)" },
      { label: "Bore Surface Finish", value: "Mirror Polish, Ra < 0.1 µm" },
      { label: "Supply Condition", value: "Supplied to your drawing & specification" },
      { label: "Concentricity", value: "Within 0.005 mm" },
    ],
    application: "Single and multi-station bolt makers, screw heading headers, rivet formers.",
    featured: true,
    image: "/assets/aistudio/Carbide_die_e6330945.webp",
  },
  {
    id: "trimming-dies",
    name: "Hexagon & Socket Trimming Dies",
    category: "dies",
    subcategory: "Cold Forging Dies",
    shortDesc: "Precision cold forging trimming dies for hex heads, flanged heads, and internal socket profiles with sharp, wear-resistant cutting profiles.",
    specifications: [
      { label: "Cutting Profile", value: "Hexagonal, Flange Hex, Torx, Square, Custom" },
      { label: "Material", value: "Premium Carbide / Powder Metallurgy High-Speed Steel" },
      { label: "Cutting Edge Hardness", value: "HRC 62–64 or Tungsten Carbide Grade" },
      { label: "Supply Condition", value: "Supplied to your drawing & specification" },
    ],
    application: "Cold header bolt trimming stations and secondary trimming presses.",
    featured: true,
    image: "/assets/aistudio/trimming_die_11017fef.png",
  },
  {
    id: "extrusion-dies",
    name: "Extrusion & Reduction Dies",
    category: "dies",
    subcategory: "Cold Forging Dies",
    shortDesc: "Forward and backward cold extrusion dies engineered to withstand extreme hydrostatic pressures during severe cross-sectional reduction.",
    specifications: [
      { label: "Die Type", value: "Forward / Backward / Combined Extrusion" },
      { label: "Carbide Grade", value: "Impact-tough fine grain carbide" },
      { label: "Reduction Angle", value: "Precision ground to tooling blueprint" },
      { label: "Supply Condition", value: "Supplied to your drawing & specification" },
    ],
    application: "Stepped shaft forging, hollow cylinder forming, automotive transmission blanks.",
    image: "/assets/aistudio/reduction_or_extrusion_die_bf5a768f.png",
  },
  {
    id: "heading-punches",
    name: "Heading Punches & Pin Punches",
    category: "dies",
    subcategory: "Cold Forging Dies",
    shortDesc: "Precision cold heading 1st & 2nd punch inserts, knock-out pins, and recess pins for cross-recess, Torx, and hex socket configurations.",
    specifications: [
      { label: "Tool Material", value: "High-Speed Steel (M2 / M42) or Tungsten Carbide" },
      { label: "Surface Coating", value: "TiN / TiAlN / DLC coating available" },
      { label: "Recess Profiles", value: "Phillips, Pozi, Torx, Hex Socket, Custom" },
      { label: "Supply Condition", value: "Supplied to your drawing & specification" },
    ],
    application: "Header stations for fastener recess forming and blank ejection.",
    image: "/assets/aistudio/punch_5bde4143.jpg",
  },
  {
    id: "shear-blades-cutters",
    name: "Cut-off Knives & Shear Quills",
    category: "dies",
    subcategory: "Cold Forging Dies",
    shortDesc: "Wire cut-off knives, quill bushings, and shear cutters delivering clean, burr-free perpendicular wire blank faces without distortion.",
    specifications: [
      { label: "Material", value: "Hardened Tool Steel or Carbide Lined" },
      { label: "Cutting Edge", value: "Precision micro-honed edge geometry" },
      { label: "Wire Diameters", value: "Customized to wire coil diameter" },
      { label: "Supply Condition", value: "Supplied to your drawing & specification" },
    ],
    application: "Wire feed cut-off mechanism on high-speed cold heading machinery.",
    image: "/assets/aistudio/Cut-off-Knife_aac9deca.jpg",
  },
  {
    id: "split-segmental-dies",
    name: "Segmental / Split Dies & Ejector Pins",
    category: "dies",
    subcategory: "Cold Forging Dies",
    shortDesc: "Segmented multi-piece cold forging dies and high-fatigue ejector pins designed for undercuts and non-symmetrical cold-forged parts.",
    specifications: [
      { label: "Segments", value: "2-piece, 3-piece, or 4-piece precision split" },
      { label: "Carbide Precision", value: "Matched segment gap < 0.003 mm" },
      { label: "Ejector Pin Core", value: "High-toughness core with hardened surface" },
      { label: "Supply Condition", value: "Supplied to your drawing & specification" },
    ],
    application: "Complex automotive parts, ball studs, and non-round forged components.",
    image: "/assets/aistudio/segmented_hex_die_556f0cde.png",
  },
  {
    id: "plain-ring-gauges",
    name: "Plain Ring Gauges (GO / NO-GO)",
    category: "gauges",
    subcategory: "Precision Gauges",
    shortDesc: "High-stability precision cylindrical ring gauges for verifying external shaft diameters, cold-forged blank diameters, and outside dimensions.",
    specifications: [
      { label: "Standard", value: "IS 3485 / DIN 2250 / ISO" },
      { label: "Material", value: "High Carbon High Chromium Alloy Steel / Carbide" },
      { label: "Stability", value: "Sub-zero treated for dimensional longevity" },
      { label: "Tolerance Standard", value: "Compliant with IS / DIN / ISO (±0.002 mm)" },
      { label: "Supply Condition", value: "Supplied to your drawing & specification with calibration report" },
    ],
    application: "Fastener blank OD check, CNC turned diameter pass/fail verification.",
    featured: true,
    image: "/assets/aistudio/plain_ring_gauges_e6374a17.jpg",
  },
  {
    id: "slip-gauges",
    name: "Precision Slip Gauges (Gauge Blocks)",
    category: "gauges",
    subcategory: "Precision Gauges",
    shortDesc: "High-accuracy rectangular slip gauges (Johansson gauge blocks) in tungsten carbide and hardened alloy steel manufactured to ISO 3650 for inspection masters and calibrating measuring instruments.",
    specifications: [
      { label: "Standard", value: "ISO 3650 / IS 2984 / DIN EN ISO 3650" },
      { label: "Material Options", value: "Tungsten Carbide / Hardened Alloy Steel (HRC 64+)" },
      { label: "Accuracy Grades", value: "Grade 0 (Reference/Inspection), Grade 1 (Toolroom), Grade 2 (Shopfloor)" },
      { label: "Surface Finish", value: "Mirror-lapped faces (Ra < 0.012 µm) with high wringing adhesion" },
      { label: "Set Sizes", value: "Available in 83, 87, 103, 112 pc sets or individual custom blocks" },
      { label: "Supply Condition", value: "Supplied in protective case with traceable calibration report" },
    ],
    application: "Setting standards for micrometers, vernier calipers, snap gauges, height gauges, and CNC machine calibration.",
    featured: true,
    image: "/assets/aistudio/slip_gauges_1_8a8e1b75.jpg",
  },
  {
    id: "thread-plug-gauges",
    name: "Thread Plug Gauges (Metric & Inch)",
    category: "gauges",
    subcategory: "Precision Gauges",
    shortDesc: "Precision ground thread plug gauges for internal thread inspection across Metric ISO, UNC, UNF, BSW, and NPT thread profiles.",
    specifications: [
      { label: "Thread Profiles", value: "Metric ISO (M), UNC, UNF, BSW, BSP, Trapezoidal" },
      { label: "Tolerance Class", value: "6H, 6G, 4H, 2B, 3B" },
      { label: "Hardness", value: "Above 60 HRC wear-treated threads" },
      { label: "Supply Condition", value: "Supplied to your drawing & specification" },
    ],
    application: "Inspection of tapped holes in machined bodies, nuts, and assemblies.",
    image: "/assets/aistudio/thread-plug-gauge_4018280a.jpg",
  },
  {
    id: "thread-ring-gauges",
    name: "Thread Ring Gauges (GO / NO-GO)",
    category: "gauges",
    subcategory: "Precision Gauges",
    shortDesc: "Calibrated thread ring gauges for testing external screw threads on high-tensile bolts, studs, and threaded machine components.",
    specifications: [
      { label: "Thread Standard", value: "ISO 965 / ANSI B1.1 / BS 919" },
      { label: "Tolerance Class", value: "6g, 6e, 4h, 2A, 3A" },
      { label: "Type", value: "Solid Ring / Adjustable split with lock screw" },
      { label: "Supply Condition", value: "Supplied to your drawing & specification" },
    ],
    application: "Fastener thread rolling QA, CNC thread turning inspection.",
    image: "/assets/aistudio/thread_ring_gauge_f21b8238.png",
  },
  {
    id: "snap-gauges",
    name: "Precision Snap Gauges (GO / NO-GO)",
    category: "gauges",
    subcategory: "Precision Gauges",
    shortDesc: "C-frame adjustable and dial-indicating snap gauges engineered for rapid, high-accuracy external diameter, shaft thickness, and groove verification directly at the machine.",
    specifications: [
      { label: "Gauge Frame", value: "Rigid forged / cast C-frame with thermal insulating grip" },
      { label: "Anvil Material", value: "Tungsten Carbide tipped or hardened tool steel (HRC 62+)" },
      { label: "Measuring Range", value: "0–25 mm up to 150 mm in standard steps (to drawing)" },
      { label: "Tolerance Standard", value: "Compliant with IS / DIN 863 / ISO (±0.002 mm accuracy)" },
      { label: "Supply Condition", value: "Supplied to your drawing & specification with calibration report" },
    ],
    application: "Shop-floor cylindrical grinding, CNC turned shaft OD checks, and fastener shank inspection.",
    image: "/assets/aistudio/snap-gauge_b293d926.jpg",
  },
  {
    id: "custom-profile-gauges",
    name: "Precision GO / NO-GO Plug & Profile Gauges",
    category: "gauges",
    subcategory: "Precision Gauges",
    shortDesc: "Double-ended precision cylindrical GO / NO-GO plain plug and pin gauge sets laser-etched with ACHSE branding for high-accuracy bore and step diameter inspection.",
    specifications: [
      { label: "Gauge Type", value: "Double-Ended GO / NO-GO Plain Plug & Pin Gauge Set" },
      { label: "Laser Marking", value: "ACHSE LLP branded, calibrated diameters & tolerances" },
      { label: "Colour Coding", value: "Green Anodized (GO) / Red Anodized (NO-GO)" },
      { label: "Standard Tolerances", value: "Down to ±0.002 mm (ISO 286 / DIN 2245 / IS 3455)" },
      { label: "Hardness", value: "HRC 60–64 wear-resistant alloy tool steel" },
      { label: "Supply Condition", value: "Supplied to your drawing & specification with calibration report" },
    ],
    application: "Shop-floor fast bore check, reamed hole tolerance QA, stepped diameter verification.",
    image: "/assets/aistudio/Precision_Go_No-Go_Gauge_Set_0b6f750a.png",
  },
];

/**
 * 4 Distinct Boxes for Home Page Featured Section (As requested by User):
 * 1. Tungsten carbide Tools
 * 2. Punch pins and trimming Die
 * 3. Fasteners
 * 4. Automotive components
 */
export interface FeaturedBox {
  id: string;
  name: string;
  categoryTitle: string;
  targetTab: 'tools-gauges' | 'fasteners' | 'automotive' | 'consultant';
  targetFilter?: 'dies' | 'gauges' | 'all';
  schematicId: string;
  category: string;
  shortDesc: string;
  specifications: { label: string; value: string }[];
  inquiryName: string;
  image?: string;
}

export const featuredHomePageBoxes: FeaturedBox[] = [
  {
    id: "box-tungsten-carbide-tools",
    name: "Tungsten carbide Tools",
    categoryTitle: "Cold Forging Tooling",
    targetTab: "tools-gauges",
    targetFilter: "dies",
    schematicId: "tc-heading-dies",
    category: "dies",
    shortDesc: "Fine-grain tungsten carbide heading dies, reduction inserts, and pre-stressed casings designed for extreme wear resistance and multi-station cold heading.",
    specifications: [
      { label: "Carbide Grades", value: "Fine-grain WC-Co (10%–20% Co)" },
      { label: "Hardness", value: "HRA 88–92 / HRC 70+" },
      { label: "Casing Material", value: "H13 Tool Steel with shrink-fit" },
      { label: "Supply Tolerance", value: "Down to ±0.003 mm to drawing" },
    ],
    inquiryName: "Tungsten carbide Tools",
    image: "/assets/aistudio/Carbide_die_e6330945.webp",
  },
  {
    id: "box-punch-pins-trimming-die",
    name: "Punch pins and trimming Die",
    categoryTitle: "Heading & Trimming Tooling",
    targetTab: "tools-gauges",
    targetFilter: "dies",
    schematicId: "trimming-dies",
    category: "dies",
    shortDesc: "High-speed steel (M2, M42) and carbide punch pins, 1st & 2nd coning punches, and hex/square trimming dies engineered for clean shear without burrs.",
    specifications: [
      { label: "Punch Materials", value: "M2, M42 HSS & Solid Carbide" },
      { label: "Profiles", value: "Hexagonal, Square, Torx, Custom" },
      { label: "Coatings", value: "PVD TiN, TiAlN, DLC low-friction" },
      { label: "Pass Criteria", value: "100% GO/NO-GO gauge verified" },
    ],
    inquiryName: "Punch pins and trimming Die",
    image: "/assets/aistudio/punch_5bde4143.jpg",
  },
  {
    id: "box-fasteners",
    name: "Fasteners",
    categoryTitle: "Fasteners Solution",
    targetTab: "fasteners",
    schematicId: "fasteners",
    category: "fasteners",
    shortDesc: "Bolts, screws, nuts, washers, pins and rivets supplied to your drawing and DIN/ISO standards. Released only after Achse thread-gauge inspection.",
    specifications: [
      { label: "Product Range", value: "M2.5 to M24 / stepped & weld bolts" },
      { label: "Property Classes", value: "4.8, 8.8, 10.9, 12.9, SS A2/A4" },
      { label: "Standards", value: "DIN 931/933, DIN 912, DIN 7981/7982" },
      { label: "Quality Release", value: "Dimensional & thread-gauge checked" },
    ],
    inquiryName: "Fasteners",
    image: "/assets/aistudio/Hex_Head_bolts_5c186322.jpg",
  },
  {
    id: "box-automotive-components",
    name: "Automotive components",
    categoryTitle: "Automotive Components",
    targetTab: "automotive",
    schematicId: "automotive-components",
    category: "automotive",
    shortDesc: "Cold formed near-net blanks and finished CNC turned sleeves, stepped shafts, bushes, and flanges. Drawing review, machining, and inspection as one job.",
    specifications: [
      { label: "Processes", value: "Cold Forming + In-House CNC Turning" },
      { label: "Materials", value: "Carbon & Alloy Steels, SS, Brass, Al" },
      { label: "Capabilities", value: "Tight tolerances, bores & cross holes" },
      { label: "Job Work", value: "Prototypes to production batches" },
    ],
    inquiryName: "Automotive components",
    image: "/assets/aistudio/cnc_turned_parts_6fca7ce8.jpg",
  },
];

/**
 * FASTENERS CATALOGUE DATA (From Achse Fasteners Catalogue PDF)
 */
export const fastenersCatalogueData = {
  title: "Fasteners",
  subtitle: "Bolts, Screws, Nuts, Washers, Pins and Rivets, supplied to your specification",
  cataloguePdf: "/assets/Achse_Fasteners_Catalogue.pdf",
  whatWeDo: "Achse supplies industrial fasteners the way an engineering company should. We read your drawing, confirm the material, grade and finish, arrange supply through our qualified manufacturing partners, and release each lot only after Achse inspection. For special parts, send us the drawing and we arrange it for you.",
  pillars: [
    { title: "To your drawing", desc: "Material, grade and finish confirmed against your drawing or standard." },
    { title: "Qualified partners", desc: "Backed by established manufacturing partners." },
    { title: "Inspected lots", desc: "Dimensional and visual checks by Achse before dispatch." },
    { title: "Special parts", desc: "Non-standard bolts, studs, pins and rivets made to your drawing." },
  ],
  groups: [
    {
      id: "bolts-screws",
      title: "Bolts & Fastening Screws",
      description: "Standard and custom engineered bolts and socket screws.",
      items: [
        { name: "Hex head bolts", standard: "DIN 931 / 933 | ISO 4014 / 4017", desc: "Part and full thread hex bolts for general fastening.", image: "/assets/aistudio/Hex_Head_bolts_5c186322.jpg" },
        { name: "Hex flange bolts", standard: "DIN 6921", desc: "Integral flange spreads load, so no separate washer is needed.", image: "/assets/aistudio/Hex_flange_bolts_640563f2.jpg" },
        { name: "Socket head cap screws", standard: "DIN 912 | ISO 4762", desc: "Hex socket drive for compact, high-strength fastening.", image: "/assets/aistudio/allen-bolts_b9051c2c.jpg" },
        { name: "Button head socket screws", standard: "ISO 7380", desc: "Low domed head with hex socket for a neat finish.", image: "/assets/aistudio/Button_head_bolts_eda33904.jpg" },
        { name: "Stepped bolts", standard: "ISO 7379 OR TO DRAWING", desc: "Ground shoulder for pivots, guides and accurate location.", image: "/assets/aistudio/Stepped_bolt_722f041b.jpg" },
        { name: "Weld bolts", standard: "TO YOUR DRAWING", desc: "Projection-weld bolts for fixing to sheet and plate.", image: "/assets/aistudio/weld-bolt_4deaf543.jpg" },
      ],
    },
    {
      id: "screws-pins",
      title: "Self-Tapping Screws & Pins",
      description: "Precision driving screws, dowels and locating pins.",
      items: [
        { name: "CSK self-tapping screws", standard: "DIN 7982", desc: "Countersunk head, Phillips drive, for flush fastening in sheet metal.", image: "/assets/aistudio/cOUNTER_SUNK_SELF_TAPPING_SCREW_d72e2840.jpg" },
        { name: "Pan head self-tapping screws", standard: "DIN 7981", desc: "Phillips pan head with a self-tapping thread.", image: "/assets/aistudio/pHILLIPS_PAN_HEAD_SELF_TAPPING_SCREW_ecbc395f.webp" },
        { name: "Torx countersunk screws", standard: "ISO 14581", desc: "Six-lobe drive for better torque transfer and less cam-out.", image: "/assets/aistudio/TORX_CSK_SCREW_d769f761.jpg" },
        { name: "Torx security screws", standard: "TO YOUR DRAWING", desc: "Pin-in Torx drive for tamper-resistant fastening.", image: "/assets/aistudio/tORX_SCREW_da5d4315.jpg" },
        { name: "Dowel pins", standard: "DIN 6325 | ISO 8734", desc: "Ground pins for accurate location and alignment.", image: "/assets/aistudio/DOWEL_PIN_976e4520.jpg" },
        { name: "Hollow dowels", standard: "TO YOUR DRAWING", desc: "Hollow sleeves for location in tooling and fixtures.", image: "/assets/aistudio/hollow-dowels_3a9db976.jpg" },
      ],
    },
    {
      id: "nuts-washers-rivets",
      title: "Nuts, Washers & Rivets",
      description: "Mating hardware, retention components and solid rivets.",
      items: [
        { name: "Hex nuts", standard: "DIN 934 | ISO 4032", desc: "Standard hex nuts in a range of sizes and grades.", image: "/assets/aistudio/HEX_NUT_755c9f45.jpg" },
        { name: "Hex flange nuts", standard: "DIN 6923", desc: "Serrated flange nuts that resist loosening.", image: "/assets/aistudio/HEX_FLANG_NUTS_0b232616.jpg" },
        { name: "Hex weld nuts", standard: "DIN 929", desc: "Projection-weld nuts for fixing to sheet and plate.", image: "/assets/aistudio/_Hex_Weld_Nut_8ad03e0f.webp" },
        { name: "Plain washers", standard: "DIN 125 | ISO 7089", desc: "Flat washers that spread load under heads and nuts.", image: "/assets/aistudio/pLANE_wASHER_6b4acf36.jpg" },
        { name: "Spring washers", standard: "DIN 127", desc: "Split lock washers that resist vibration loosening.", image: "/assets/aistudio/spring_washer_82066838.jpg" },
        { name: "Round head rivets", standard: "DIN 660", desc: "Solid round head rivets for permanent joints.", image: "/assets/aistudio/Rivet_eef8a2c8.jpg" },
      ],
    },
  ],
  specifications: {
    title: "Specified, Supplied, Inspected",
    matrix: [
      { label: "Materials", value: "Stainless steel, carbon steel and alloy steel" },
      { label: "Finishes", value: "Plain, zinc plated, black oxide and others on request" },
      { label: "Grades", value: "Property class as per requirement: 8.8, 10.9, 12.9 or A2-70 / A4-80" },
      { label: "Standards", value: "IS, ISO, DIN, ASME or your own drawing" },
    ],
    oneResponsibility: [
      "Drawing and specification review before quotation",
      "Samples for approval before bulk supply",
      "Dimensional and visual inspection before dispatch",
      "Inspection report on request",
      "Special and non-standard parts built to your drawing",
    ],
    howToOrder: [
      { step: "1", title: "Enquire", desc: "Drawing, sample or standard, with quantity" },
      { step: "2", title: "Review", desc: "We confirm material, grade and finish" },
      { step: "3", title: "Quote", desc: "Price and lead time for your approval" },
      { step: "4", title: "Sample", desc: "Approval sample where needed" },
      { step: "5", title: "Supply", desc: "Inspected lots dispatched on schedule" },
    ],
  },
};

/**
 * AUTOMOTIVE COMPONENTS CATALOGUE DATA (From Achse Automotive Components Catalogue PDF)
 */
export const automotiveCatalogueData = {
  title: "Automotive Components",
  subtitle: "Cold Forming | CNC Turning | CNC Turning Job Work",
  cataloguePdf: "/assets/Achse_Automotive_Components_Catalogue.pdf",
  whatWeDo: "Achse delivers precision automotive components made two ways: cold formed for strength and repeatability at volume, and CNC turned for tight-tolerance, complex or low-volume parts. Formed parts can be finished on our in-house CNC machines, so one team is responsible for the drawing, the process and the inspection.",
  badges: [
    { title: "Design support", desc: "Process and drawing review before any part is made." },
    { title: "In-house CNC", desc: "Turning and finishing on our own CNC machines." },
    { title: "Inspected lots", desc: "Dimensional and visual checks by Achse before dispatch." },
    { title: "Quality focus", desc: "Process discipline modelled on automotive quality practice." },
  ],
  pillars: [
    {
      id: "cold-formed",
      number: "1",
      title: "Cold Formed Components",
      summary: "Sleeves, bushes, shafts and gear forms formed to near-net shape.",
      typicalComponents: [
        { name: "Sleeves & bushes", desc: "Plain, flanged and shaped sleeves for shafts, linkages and housings." },
        { name: "Shafts & pins", desc: "Stepped shafts, pins and spindles formed close to final size." },
        { name: "Gear & pinion forms", desc: "Toothed and splined forms with continuous grain flow." },
        { name: "Caps & housings", desc: "Cup and cap shaped parts with controlled wall thickness." },
        { name: "Fitted parts", desc: "Formed bodies with threaded studs or machined features added." },
      ],
      whyColdForming: [
        "Less material wasted than machining bar",
        "Grain flow adds strength",
        "Consistent dimensions across batches",
        "Smooth surface finish",
        "Lower cost per part at volume",
      ],
      formedThenFinished: "Formed parts can be finished on our in-house CNC machines for threads, cross holes and tight diameters, with Achse inspection before dispatch.",
      images: [
        { url: "/assets/aistudio/cold_forged_components_880d65cd.png", caption: "Cold formed sleeves, bushes & stepped blanks" },
        { url: "/assets/aistudio/Cold-forged-1-1_5ae08928.jpg", caption: "Formed gear blank & pinion form with continuous grain flow" }
      ],
    },
    {
      id: "cnc-turned",
      number: "2",
      title: "CNC Turned Components",
      summary: "Shafts, bushes, flanges and fittings turned to your drawing.",
      typicalComponents: [
        { name: "Shafts & stepped pins", desc: "Turned shafts with steps, grooves, threads and cross holes." },
        { name: "Bushes & sleeves", desc: "Plain and flanged bushes, spacers and sleeves." },
        { name: "Flanges & rings", desc: "Drilled flanges, collars and rings to your drawing." },
        { name: "Fittings & couplings", desc: "Threaded fittings, nuts and connectors." },
        { name: "Valve & hydraulic parts", desc: "Spools, plugs and bodies with grooves and ports." },
      ],
      madeToDrawing: [
        "Carbon and alloy steels",
        "Stainless steel grades",
        "Brass and aluminium",
        "Threads, grooves, cross holes and bores",
        "Finishes and heat treatment as specified",
      ],
      heldToTolerance: "Turned on our in-house CNC machines and checked against your drawing, with an inspection report on request.",
      images: [
        { url: "/assets/aistudio/cnc_turned_parts_6fca7ce8.jpg", caption: "CNC turned precision shafts, collars, spheres & sleeves" },
        { url: "/assets/aistudio/cnc_turned_parts-2_4e21f0d2.jpg", caption: "Turned brass and steel hydraulic fittings & threaded bushes" }
      ],
    },
    {
      id: "cnc-job-work",
      number: "3",
      title: "CNC Turning Job Work",
      summary: "Send drawing and material; we turn, inspect and deliver.",
      tagline: "Your drawing, our machines",
      features: [
        "Prototypes to production batches",
        "Free-issue material or material arranged by Achse",
        "Drawing review before machining starts",
        "Inspection before dispatch",
        "Packing and delivery on the agreed schedule",
      ],
      howJobWorkRuns: [
        { step: "1", title: "Enquire", desc: "Drawing, material and quantity" },
        { step: "2", title: "Review", desc: "We check feasibility and tolerances" },
        { step: "3", title: "Machine", desc: "Turned on our CNC machines" },
        { step: "4", title: "Inspect", desc: "Checked against your drawing" },
        { step: "5", title: "Deliver", desc: "Packed and dispatched on time" },
      ],
      images: [
        { url: "/assets/aistudio/CNC_job_work_56ce5447.jpg", caption: "CNC turning machine in operation on precision workpiece" }
      ],
    },
  ],
  oneTeamStatement: "Whether your part is cold formed, CNC turned or both, Achse handles the drawing review, machining and inspection as one job with one point of contact.",
};

/**
 * COLD FORGING CONSULTATION & TRAINING DATA
 */
export const coldForgingConsultantData = {
  title: "Cold Forging Consultation & Training",
  subtitle: "Process & Tooling Design Advisory & Industry Training — From Part Blueprint to Production Rollout",
  overview: "Achse LLP provides comprehensive engineering consultation and practical technical training for cold forging manufacturing companies, tool-rooms, fastener producers, and shop-floor engineers. We analyze component geometry, design multi-station heading sequences, calculate pre-stress ratios, troubleshoot die wear, and conduct hands-on training to upskill engineering teams.",
  showcaseImages: [
    { url: "/assets/aistudio/segmented_hex_die_556f0cde.png", caption: "Precision segmented hex cold forging die set with stress ring" },
    { url: "/assets/aistudio/Cold-forged-1-1_5ae08928.jpg", caption: "Near-net cold formed stepped gear blank with continuous grain flow" },
    { url: "/assets/aistudio/reduction_or_extrusion_die_bf5a768f.png", caption: "Cold extrusion & reduction die insert with internal reduction profile" }
  ],
  consultingAreas: [
    {
      title: "Part Drawing & Cold Forgeability Assessment",
      desc: "Detailed evaluation of raw part blueprints to determine cold forming feasibility, upsetting ratios, cross-sectional reduction limits, and material deformation behavior.",
    },
    {
      title: "Volume Distribution & Slug Optimization",
      desc: "Accurate wire cut-off slug sizing, volume allocation per station, and mass conservation calculations to prevent underfilling or flash generation.",
    },
    {
      title: "Multi-Station Heading Progression Layout",
      desc: "Complete step-by-step station design (1st preform, extrusion, heading punch, trimming die) optimized for smooth material flow without shear failure.",
    },
    {
      title: "Shrink-Fit Pre-Stress Calculations",
      desc: "Interference calculations for tungsten carbide inserts fitted into H13 tool steel stress rings, minimizing tensile hoop stress and preventing catastrophic carbide cracking.",
    },
    {
      title: "Carbide Grade & Coating Selection",
      desc: "Matching specific cobalt binder percentages and grain sizes (ultra-fine to coarse) to forming impact requirements, paired with PVD coatings (TiN, TiAlN, DLC).",
    },
    {
      title: "Troubleshooting Wear, Chipping & Galling",
      desc: "Root-cause metallurgical and dimensional failure analysis for prematurely chipped dies, galling on extrusion corners, and wire feed irregularities.",
    },
  ],
  engagementSteps: [
    { step: "01", title: "Blueprint Submission", desc: "Share your 2D CAD print or 3D STEP model with target production volume and raw material grade." },
    { step: "02", title: "Design & Feasibility Study", desc: "Our Pune engineering desk calculates deformation steps, station counts, and tooling stress profiles." },
    { step: "03", title: "Tooling Sequence Blueprint", desc: "We deliver full tooling layout schematics, shrink-fit specifications, and recommended carbide grades." },
    { step: "04", title: "Tooling Supply & Trial Validation", desc: "Achse supplies the verified dies and punches, followed by initial trial evaluation and dimensional checks." },
  ],
};

export const qualityAndSupport = {
  headline: "Quality Verification & Engineering Support",
  subheadline: "Rigorous gauge-based verification, full documentation, and end-to-end cold forging technical assistance.",
  inspectionApproach: [
    {
      title: "Gauge-Based Pass/Fail Verification",
      desc: "Every critical dimension is verified using calibrated GO/NO-GO plug, ring, and thread gauges to guarantee flawless assembly line fitment.",
    },
    {
      title: "Inspection Reports & Documentation",
      desc: "Supplied with comprehensive dimensional inspection reports, plating thickness validation, and Material Test Certificates (MTC 3.1) [to be confirmed].",
    },
    {
      title: "Surface Finish & Hardness Checks",
      desc: "Surface roughness (Ra) verification for carbide die bores and Rockwell/Vickers hardness checks on heat-treated tool steel and fasteners.",
    },
  ],
  engineeringSupport: {
    title: "Cold Forging Process & Tooling Design Support",
    desc: "Our engineering team provides hands-on technical guidance across the entire cold forging lifecycle — from initial part drawing review and volume distribution to multi-station die sequence, preform layout, and carbide grade selection.",
    deliverables: [
      "Process feasibility review of component cold forgeability",
      "Multi-stage tooling layout (cutoff, preform, heading, trimming)",
      "Carbide grade and shrink-fit pre-stress calculation advisory",
      "Troubleshooting tooling wear, chipping, and galling",
    ],
  },
  howWeWorkSteps: [
    {
      step: "01",
      title: "Share Drawing & Requirement",
      desc: "Send your 2D/3D drawing (PDF, DWG, STEP) with annual/batch quantities, material grade, and tolerance specifications.",
    },
    {
      step: "02",
      title: "Technical Review & Quotation",
      desc: "Our technical team reviews geometry, tooling feasibility, and standards to deliver a precise, competitive quotation with lead times.",
    },
    {
      step: "03",
      title: "Production & Inspection",
      desc: "Manufacturing on CNC machines or supply through our verified global tooling network with rigorous gauge-based inspection.",
    },
    {
      step: "04",
      title: "Dispatch & Support",
      desc: "Careful protective packaging, inspection documentation, and on-time delivery from Pune with continuing engineering support.",
    },
  ],
};

export const companyStory = {
  aboutHeadline: "Precision Engineering Partner for Manufacturing Leaders",
  story: "Established in 2026 in Pune, India's premier engineering and automotive hub, Achse LLP was founded to provide manufacturing companies with dependable, high-precision engineering solutions. We specialize in cold forging tooling (dies and gauges), standard and custom fastener solutions, and precision CNC machined components.",
  vision: "To be recognized by purchase managers and tool-room leaders as the most dependable and technically proficient engineering partner for cold forging tooling, fastener supply, and precision machined components.",
  mission: "Deliver components and tooling that adhere strictly to customer drawings, verified through rigorous gauge inspection, on-time delivery, and collaborative engineering design support.",
  values: [
    { title: "Precision First", desc: "Uncompromising adherence to geometric tolerances, material grades, and surface finishes." },
    { title: "Technical Transparency", desc: "Honest technical feasibility reviews, clear specifications, and documented inspection results." },
    { title: "Reliable Supply", desc: "Proactive production planning and schedule management to protect our customers' production lines." },
    { title: "Collaborative Support", desc: "Working alongside customer tool-rooms and design engineers to optimize tooling life and part quality." },
  ],
};

export const specialToolsHighlight = {
  title: "Special Tools on Request",
  description: "We source special and custom tooling through our global network, including China and Taiwan, to your specification.",
  benefits: [
    "Specialized carbide grades and multi-action die sets not readily available locally",
    "Stringent incoming inspection and dimensional verification in Pune before customer dispatch",
    "Competitive lead times with consolidated international freight and customs handling",
    "Complete technical alignment with your drawing and tool-room expectations",
  ],
};
