# ACHSE LLP — Netlify Deployment Guide

This project is pre-configured for **Netlify** via `netlify.toml`, `public/_redirects`, and serverless functions under `netlify/functions/`.

---

## Option 1: Deploy from GitHub (Recommended — Auto-Deploys & Functions)

1. **Push your latest code to GitHub**:
   ```bash
   git add .
   git commit -m "chore: configure Netlify deployment with netlify.toml and serverless functions"
   git push -u origin main
   ```
2. **Connect in Netlify**:
   - Log in to [app.netlify.com](https://app.netlify.com/).
   - Click **Add new site** ➔ **Import an existing project** ➔ **GitHub**.
   - Select your repository.
3. **Build Settings** (auto-detected from `netlify.toml`):
   - **Build command**: `npm run build:netlify`
   - **Publish directory**: `dist`
   - **Functions directory**: `netlify/functions`
4. **Environment Variables** (Site configuration ➔ Environment variables):
   - Add your Firebase Web SDK variables (if connecting to your live Firebase project):
     - `VITE_FIREBASE_API_KEY`
     - `VITE_FIREBASE_AUTH_DOMAIN`
     - `VITE_FIREBASE_PROJECT_ID`
     - `VITE_FIREBASE_STORAGE_BUCKET`
     - `VITE_FIREBASE_MESSAGING_SENDER_ID`
     - `VITE_FIREBASE_APP_ID`
   - *(Optional)* Add MySQL environment variables if mirroring RFQs to an external MySQL database:
     - `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME`, `DB_PORT`, `DB_SSL`
5. Click **Deploy site**.

---

## Option 2: Deploy via Netlify CLI

```bash
npm install -g netlify-cli
netlify login
npm run build:netlify
netlify deploy --prod
```

---

## Option 3: Instant Drag-and-Drop (Netlify Drop)

1. Run `npm run build:netlify` to generate the `dist/` folder (already contains `_redirects` for SPA routing).
2. Open [app.netlify.com/drop](https://app.netlify.com/drop).
3. Drag and drop the `dist/` folder onto the page.

---

## Custom Domain (`achse.in`) & Firebase Auth Checklist

1. **Connect Custom Domain in Netlify**:
   - Go to **Domain management** ➔ **Add a domain** ➔ enter `achse.in`.
   - Point your DNS records:
     - `A` record `@` ➔ `75.2.60.5` (Netlify Load Balancer)
     - `CNAME` record `www` ➔ `<your-site-name>.netlify.app`
   - Netlify automatically provisions a free **Let's Encrypt SSL certificate**.
2. **Authorize Domain in Firebase Console** (required for Admin Login):
   - Open Firebase Console ➔ **Authentication** ➔ **Settings** ➔ **Authorized domains**.
   - Add both `<your-site-name>.netlify.app` and `achse.in` (plus `www.achse.in`).
3. **Verify Live Endpoints**:
   - Public site: `https://achse.in/`
   - Admin Portal: `https://achse.in/admin/login` (or `/#admin/login`)
   - Health Function: `https://achse.in/api/health`
