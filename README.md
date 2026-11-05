# Somya Ranjan Sahoo — Portfolio

A static, dependency-free portfolio site (HTML, CSS and vanilla JavaScript). No build step is required to run or deploy it.

## Structure

| Path | What it is |
|---|---|
| `index.html` | The portfolio page (hero, selected work and case studies, about, experience, credentials, contact) |
| `privacy.html` | Privacy notice for the contact form |
| `404.html` | Not-found page (used automatically by Vercel) |
| `styles.css` | All styles, light and dark themes |
| `script.js` | Theme, navigation, project filters, contact form, image viewer, analytics loader |
| `assets/img/*.webp` | Responsive images (480/720/960/1600 px widths) built from the original photos and screenshots |
| `assets/Somya-Ranjan-Sahoo-Resume.pdf` | Resume (generated from `resume/resume.html`) |
| `assets/og-image.jpg` | Link-preview image |
| `vercel.json` | Clean URLs, security headers (CSP etc.) and caching |
| `robots.txt` | Search-engine rules |
| `dev-server.js` | Local server that applies the same headers as `vercel.json` (not deployed) |
| `resume/resume.html` | Source for the resume PDF (not deployed) |

`.vercelignore` keeps `resume/`, `dev-server.js`, `run-local.bat` and this README out of the deployment.

## Run locally

```bash
node dev-server.js
```

Then open http://localhost:4321. (Opening `index.html` directly from disk also works, but the security headers and clean URLs only apply through the server.)

## Deploy (Vercel)

1. Push this folder to a GitHub repository (or run `vercel deploy --prod` from this folder with the Vercel CLI).
2. Import the repository in Vercel. Framework preset: **Other**. No build command, output directory = project root.
3. Vercel serves the site over **HTTPS** automatically on its `*.vercel.app` domain and on any custom domain you add (it issues the certificate). Check the padlock in the browser after the first deploy.
4. **Web Analytics:** in the Vercel dashboard open the project → Analytics → Enable. `script.js` already loads `/_vercel/insights/script.js` on the live https site (it is skipped on localhost).

### After you know the production domain

Replace `YOUR-DOMAIN` below and add these:

- In `index.html` `<head>`: `<link rel="canonical" href="https://YOUR-DOMAIN/">` and change `og:image` to `https://YOUR-DOMAIN/assets/og-image.jpg` (link previews need an absolute URL).
- Create `sitemap.xml`:
  ```xml
  <?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url><loc>https://YOUR-DOMAIN/</loc></url>
    <url><loc>https://YOUR-DOMAIN/privacy</loc></url>
  </urlset>
  ```
- Uncomment the `Sitemap:` line in `robots.txt`, then submit the site in Google Search Console.

## Contact form (FormSubmit)

The form posts to [FormSubmit](https://formsubmit.co), which emails submissions to `6422somyaranjansahoo@gmail.com`. No API key or secret is stored in the code.

- **One-time activation:** the first submission makes FormSubmit send an activation email to that inbox. Click the link in it once. Until then, submissions are not delivered — the form shows an error with a "email me directly" fallback, never a false success.
- **Optional:** after activation FormSubmit gives you a random alias. Replace the email in the form's `action` and `data-endpoint` with that alias to keep the address out of the HTML.
- **Spam protection:** a hidden honeypot field (`_honey`) plus required consent and validation. Without JavaScript the form still works as a normal POST (FormSubmit then shows its own captcha page).
- To switch providers, change `action` and `data-endpoint` on `#contactForm` in `index.html`, and `connect-src` / `form-action` in `vercel.json`, and update `privacy.html`.

## Resume

Edit `resume/resume.html`, then rebuild the PDF with Chrome (one A4 page):

```bash
"%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe" --headless=new --no-pdf-header-footer --print-to-pdf="assets\Somya-Ranjan-Sahoo-Resume.pdf" "file:///%CD%/resume/resume.html"
```

## Images

All site images are WebP files in `assets/img/` with several widths each, generated from the original files in `VIRUS/ACHIEVEMENTS & WORKS` and `VIRUS/PROJECTS`. The VECTOR screenshot is cropped to the app area (the original showed the desktop taskbar and browser tabs). The Smart Toll image uses only the map and ANPR-pipeline panels of `demo.png`.

## Security note

The toll project's local git remote (`✅TOLL_PLAZA-SYSTEM/.git/config`) contains a GitHub personal access token in plain text. Revoke it in GitHub → Settings → Developer settings → Personal access tokens, and use a credential manager instead.
