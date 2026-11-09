# ACHSE LLP — Corporate Engineering Website

Production-quality, responsive corporate website built for **ACHSE LLP** (est. 2026, Pune, India) — precision automotive components, cold forging tooling (dies and gauges), and industrial fastener solutions.

---

## 1. How to Edit Content
All website copy, product catalogue items, specifications, contact details, and engineering capabilities are centralized in **one single file**:

📁 `src/data/content.ts`

- **Contact Information & Address**: Update `siteConfig` (phone, email, Pune address, GSTIN, WhatsApp number).
- **WhatsApp Integration**:
  - The WhatsApp number is defined in `src/data/content.ts` under `siteConfig.whatsappNumber` (e.g. `"+919876543210"`).
  - The website includes a floating quick-chat widget, contextual WhatsApp buttons on all product cards, in the RFQ modal, on the Contact page, and in the Footer.
- **Product Catalogue**: Add or edit items in `coldForgingCatalogue`. Each item has:
  - `id`: Unique identifier
  - `name`: Product title (e.g., Tungsten Carbide Heading Dies)
  - `category`: `'dies' | 'gauges' | 'fasteners' | 'machined'`
  - `shortDesc`: Brief technical summary
  - `specifications`: Array of `{ label, value }` pairs (materials, tolerances, standards)
  - `application`: Machine or manufacturing context
- **Fasteners Grid**: Edit `fastenerCapabilities.grid` to update materials, finishes, grades, and quantity tiers.
- **CNC Machining & Automotive**: Update `cncMachiningCapabilities` and `automotiveCapabilities`.

---

## 2. How to Replace Logo and Product Images
- **Logo**:
  - The logo component is located in `src/components/Logo.tsx`.
  - It automatically checks for an official logo file at `/assets/aistudio/Alogo_6f9ab2ce.png` (or place your vector SVG / PNG in `public/assets/logo.png`).
  - If no file is detected, it falls back to the high-precision ACHSE axis monogram and typography.
- **Product Images & Technical Drawings**:
  - Technical CAD schematics and blueprints are in `src/components/TechnicalVisuals.tsx`.
  - To display photography alongside or in place of schematics, place product photos in `public/products/` and reference them in `coldForgingCatalogue`.

---

## 3. How to Connect Backend for the RFQ Form
- In `src/components/ContactSection.tsx` and `src/components/QuoteModal.tsx`, look for the comment:
  ```javascript
  /* Connect backend here: */
  ```
- You can hook it directly to:
  - A serverless endpoint or Express API route (`/api/quote`)
  - Formspree / Formbold / Netlify forms
  - An email dispatch service (e.g. Resend, SendGrid)

---

## 4. How to Build & Deploy
- **Development**:
  ```bash
  npm run dev
  ```
- **Production Build**:
  ```bash
  npm run build
  ```
- The production output will be generated in `/dist` and is ready for static deployment on Vercel, Netlify, Cloudflare Pages, Firebase Hosting, or Cloud Run.

---

## 5. Placeholders List (To Be Confirmed)
The following fields are marked `[to be confirmed]` per the client brief and should be updated once official company documents are ready:
1. `siteConfig.phone`: Official Pune office phone number
2. `siteConfig.email`: Corporate email address (e.g. `info@achsellp.com` or `sales@achsellp.com`)
3. `siteConfig.address`: Full street address / MIDC industrial plot in Pune (e.g. Bhosari MIDC / Chakan)
4. `siteConfig.gstin`: GSTIN registration number
5. `siteConfig.whatsappNumber`: Official WhatsApp business number
6. Fasteners capability table: Brass fasteners & ASTM A193 B7/B8 grades marked `[to be confirmed]`
7. 3.1 Material Test Certificate availability: marked `[to be confirmed]`

---

## 6. SEO & #1 Search Ranking Architecture
The website is engineered with production B2B SEO optimizations for search engines like Google:
1. **Robots & Sitemap**:
   - `/public/robots.txt`: Directs all major crawlers.
   - `/public/sitemap.xml`: Complete indexed structure with URL priority mapping.
2. **Schema.org Multi-Entity Knowledge Graph (JSON-LD)** in `index.html`:
   - `LocalBusiness` / `ManufacturingBusiness` (Pune MIDC, GPS coordinates, operating hours).
   - `ItemList` / `Product` Catalog with rich specifications for carbide dies, gauges, and fasteners.
   - `FAQPage` Schema directly aligned with the on-page Technical FAQ for Position 0 / Rich Snippet capture.
3. **Target Search Queries Optimized**:
   - *"Cold forging tooling manufacturers Pune"*
   - *"Tungsten carbide dies Pune"*
   - *"Thread plug gauges supplier Maharashtra"*
   - *"High tensile industrial fasteners Pune"*
   - *"Cold forging design support India"*
4. **Google Search Console Next Step**:
   - Once your custom domain (e.g., `achsellp.com`) is mapped, submit `https://yourdomain.com/sitemap.xml` directly in Google Search Console to index within 24-48 hours.
