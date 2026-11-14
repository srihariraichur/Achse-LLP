# ACHSE LLP — Deployment Without Node.js
**Target: Standard Shared Hosting / Serverbyt / cPanel (PHP + Apache / Nginx)**

You do **NOT** need Node.js installed on your server. This application is configured to run as a **high-performance static Single Page Application (SPA)** with native **PHP API endpoints** and **Firebase backend**:

- **Frontend**: Pre-compiled React SPA (`dist/` directory) with zero runtime dependencies.
- **Admin Portal**: Connects directly from the browser to Firebase (Auth + Firestore + Storage). No server daemon needed.
- **Inquiries / Quotes**: Processed directly via Firebase and native `api/quote-request.php`.
- **Catalogue Downloads & Assets**: Directly served by Apache with HTTP caching & compression.

---

## Method 1: Deploy Using Git Version Control (Recommended)

Because `dist/` is pre-compiled and tracked in Git, you can still deploy using GitHub and your hosting's **Git Version Control**:

### Step 1: Push from your computer to GitHub
```bash
# In your project folder:
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

### Step 2: Set up Git Version Control in Serverbyt / cPanel
1. Open **cPanel ➔ Git™ Version Control**.
2. Click **Create**:
   - **Clone URL**: Paste your GitHub repository URL (`https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git`).
   - **Repository Path**: `repositories/achse`.
   - **Repository Name**: `achse`.
3. Click **Create**.
4. Once cloned, click **Manage** ➔ **Deploy HEAD Commit**.
   - The included `.cpanel.yml` will automatically copy all production files from `dist/` directly into `/home/USERNAME/public_html/`.
5. Whenever you push changes to GitHub, simply click **"Update from Remote"** and **"Deploy HEAD Commit"** to instantly update your website.

---

## Method 2: Direct Upload via cPanel File Manager (No Terminal Needed)

If you prefer a 2-minute visual upload without Git:

1. Locate the pre-packaged zip file:
   **`achse_public_html.zip`** (located in this project root).
2. Log into your **cPanel / Serverbyt control panel**.
3. Open **File Manager** and enter the **`public_html`** folder.
4. Click **Upload** and upload `achse_public_html.zip`.
5. Right-click `achse_public_html.zip` in `public_html` and select **Extract**.
6. Ensure the extracted files (`index.html`, `.htaccess`, `assets/`, `api/`, `robots.txt`, `sitemap.xml`) sit directly inside `public_html/` (not inside a subfolder).
7. Delete `achse_public_html.zip`.

---

## Verifying Your Live Deployment

Visit your domain `https://achse.in`:

| Feature | URL to test | Expected Result |
| :--- | :--- | :--- |
| **Public Website** | `https://achse.in/` | Instant load with cold forging dies, gauges, catalogues |
| **API Health Check** | `https://achse.in/api/health` | Returns `{"status":"ok","runtime":"PHP/Apache..."}` |
| **Admin Portal** | `https://achse.in/#admin/login` | Secure login card with Firebase authentication |
| **Drawing Catalogues** | Download links on home & products | PDF files download immediately |
