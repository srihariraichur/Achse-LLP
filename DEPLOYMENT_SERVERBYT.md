# ACHSE LLP — Deployment Guide for Serverbyt (StackCP)

This guide provides simple, step-by-step instructions to deploy the ACHSE LLP portal to your **Serverbyt (StackCP)** hosting account.

---

## Deployment Option 1: Standard Web Hosting (Recommended & Fastest)

If your Serverbyt package is a standard cloud/shared hosting plan:

### Step 1: Build the Files
The production build is already generated in the `/dist` directory. If rebuilding locally, run:
```bash
npm run build
```

### Step 2: Upload to `public_html`
1. Log in to your **Serverbyt** Client Area and open the **StackCP Control Panel**.
2. Go to **File Manager**.
3. Open the **`public_html`** directory (or your domain directory).
4. Upload all files and folders located inside the `dist/` folder:
   - `index.html`
   - `.htaccess` (included for clean SPA navigation)
   - `assets/` (contains all optimized JS, CSS, images, and PDF catalogues)
   - `api/` (contains `quote-request.php` for handling form submissions directly in Apache/PHP)

### Step 3: Database Connection on Serverbyt
Since your database is hosted directly on Serverbyt:
- In `public_html/api/quote-request.php`, the host can be `localhost` or `sdb-67.hosting.stackcp.net`.
- Inquiries submitted from the quotation modal and contact page will automatically save to your `quote_requests` table.

---

## Deployment Option 2: Node.js Web Application

If your Serverbyt package has the **Node.js Selector / Web Apps** tool:

### Step 1: Upload Project Files
Upload the following to your application directory on Serverbyt:
- `dist/` folder
- `server.js` (standalone bundled production server)
- `package.json`
- `.env` file

### Step 2: Configure Environment Variables in Serverbyt
Create a `.env` file in the application directory with your database secrets:
```env
PORT=3000
NODE_ENV=production
DB_HOST=localhost
DB_USER=achse-contact-info-353034375213
DB_PASS=your_database_password
DB_NAME=achse-contact-info-353034375213
DB_PORT=3306
```
*(Note: Within Serverbyt, `DB_HOST` can be `localhost` and `DB_PORT` is standard `3306` because the backend runs locally on the same server as the database!)*

### Step 3: Install Production Dependencies & Start
In the Serverbyt Terminal or Node.js manager:
```bash
npm install --omit=dev
```
Set the application startup file to:
```
server.js
```
Click **Restart / Start Application**.

---

## Verification Checklist After Deployment
- [ ] Visit your domain (e.g., `https://achse.in` or your Serverbyt domain).
- [ ] Test the **Download Catalogue (PDF)** buttons (all 3 PDFs download instantly).
- [ ] Submit an inquiry via **Request a Quote** or **Contact Us** form.
- [ ] Verify that inquiries are stored in your MySQL database table `quote_requests`.
- [ ] Click the **WhatsApp** widget to verify direct chat to `+91 91565 10992`.
