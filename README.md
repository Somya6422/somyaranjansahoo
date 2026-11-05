# Somya Ranjan Sahoo — Portfolio

A static, dependency-free portfolio site (HTML, CSS and vanilla JavaScript). No build step is required to run or deploy it.

## Structure

| Path | What it is |
|---|---|
| `index.html` | The portfolio page (hero, selected work and case studies, about, experience, credentials, contact) |
| `privacy.html` | Privacy notice for the contact form |
| `404.html` | Not-found page (used automatically by GitHub Pages) |
| `styles.css` | All styles, light and dark themes |
| `script.js` | Theme, navigation, project filters, contact form, image viewer |
| `assets/img/*.webp` | Responsive images (480/720/960/1600 px widths) built from the original photos and screenshots |
| `assets/Somya-Ranjan-Sahoo-Resume.pdf` | Resume (generated from `resume/resume.html`) |
| `assets/og-image.jpg` | Link-preview image |
| `.nojekyll` | Tells GitHub Pages to serve the files as they are |
| `robots.txt`, `sitemap.xml` | Search-engine rules and page list |
| `dev-server.js` | Local preview server |
| `resume/` | Source for the resume PDFs (local only, ignored by git) |

## Run locally

```bash
node dev-server.js
```

Then open http://localhost:4321.

## Deploy (GitHub Pages)

1. On GitHub open the repository, then **Settings > Pages**.
2. Under **Build and deployment**, set **Source** to *Deploy from a branch*, **Branch** to `main` and the folder to `/ (root)`, then **Save**.
3. After a minute or two the site is live at https://somya6422.github.io/somyaranjansahoo/

Every push to `main` then updates the site. The repository must stay public on a free GitHub plan.

### Desktop view on every device

The `viewport` tag in each page is `width=1200`, so phones and tablets lay the site out at desktop width and zoom out to fit. Visitors can pinch to zoom. To go back to the phone layout, set it to `width=device-width, initial-scale=1` in `index.html`, `privacy.html` and `404.html`.

### What differs from a server you control

- GitHub Pages cannot send custom headers, so the Content-Security-Policy lives in a `<meta>` tag at the top of each page. Change an inline `<script>` and its `sha256` hash in that tag must change too. `frame-ancestors` and `X-Frame-Options` have no equivalent there.
- There is no built-in analytics.

### Moving to a custom domain later

1. Register the domain, then add it under **Settings > Pages > Custom domain** and follow the DNS records GitHub shows.
2. Replace the `somya6422.github.io/somyaranjansahoo` address in `index.html`, `robots.txt`, `sitemap.xml` and the resume sources.
3. Change `<base href="/somyaranjansahoo/">` in `404.html` to `<base href="/">`.

## Contact form (FormSubmit)

The form posts to [FormSubmit](https://formsubmit.co), which emails submissions to `6422somyaranjansahoo@gmail.com`. No API key or secret is stored in the code.

- **One-time activation:** the first submission makes FormSubmit send an activation email to that inbox. Click the link in it once. Until then, submissions are not delivered — the form shows an error with a "email me directly" fallback, never a false success.
- **Optional:** after activation FormSubmit gives you a random alias. Replace the email in the form's `action` and `data-endpoint` with that alias to keep the address out of the HTML.
- **Spam protection:** a hidden honeypot field (`_honey`) plus required consent and validation. Without JavaScript the form still works as a normal POST (FormSubmit then shows its own captcha page).
- To switch providers, change `action` and `data-endpoint` on `#contactForm` in `index.html`, and `connect-src` / `form-action` in the Content-Security-Policy tag of each page, and update `privacy.html`.

## Resume

Edit `resume/resume.html`, then rebuild the PDF with Chrome (one A4 page):

```bash
"%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe" --headless=new --no-pdf-header-footer --print-to-pdf="assets\Somya-Ranjan-Sahoo-Resume.pdf" "file:///%CD%/resume/resume.html"
```

## Images

All site images are WebP files in `assets/img/` with several widths each, generated from the original files in `VIRUS/ACHIEVEMENTS & WORKS` and `VIRUS/PROJECTS`. The VECTOR screenshot is cropped to the app area (the original showed the desktop taskbar and browser tabs). The Smart Toll image uses only the map and ANPR-pipeline panels of `demo.png`.

## Security note

The toll project's local git remote (`✅TOLL_PLAZA-SYSTEM/.git/config`) contains a GitHub personal access token in plain text. Revoke it in GitHub → Settings → Developer settings → Personal access tokens, and use a credential manager instead.

## License

The MIT license in this repository covers the code only. Photos, certificates, resume files and other personal content belong to Somya Ranjan Sahoo and the people shown, and may not be reused without permission.
