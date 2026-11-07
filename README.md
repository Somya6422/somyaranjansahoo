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
3. After a minute or two the site is live at https://somyaranjansahoo6422.github.io/

Every push to `main` then updates the site. The repository must stay public on a free GitHub plan.

### What differs from a server you control

- GitHub Pages cannot send custom headers, so the Content-Security-Policy lives in a `<meta>` tag at the top of each page. Change an inline `<script>` and its `sha256` hash in that tag must change too. `frame-ancestors` and `X-Frame-Options` have no equivalent there.
- There is no built-in analytics.

### Moving to a custom domain later

1. Register the domain, then add it under **Settings > Pages > Custom domain** and follow the DNS records GitHub shows.
2. Replace the `somyaranjansahoo6422.github.io` address in `index.html`, `robots.txt`, `sitemap.xml` and the resume sources.

## Contact form (Web3Forms)

With JavaScript on, the form posts to [Web3Forms](https://web3forms.com), which emails submissions to the inbox tied to the access key. The key sits in `data-w3f` on `#contactForm` in `index.html`. Web3Forms keys are made for use in a public page, so it is not a secret.

- **Backup:** with JavaScript off, the form does a normal POST to [FormSubmit](https://formsubmit.co) instead. FormSubmit sends a one-time activation email to the inbox on its first submission.
- **Spam protection:** a hidden honeypot field (`_honey`) plus required consent and validation.
- To switch providers, change `data-w3f`, `action` and `data-endpoint` on `#contactForm`, and `connect-src` / `form-action` in the Content-Security-Policy.

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

## Publishing a change

The pages load minified files, so after editing any `.css` or `.js` file run:

```bash
node build.js
```

It rebuilds the `.min` files, versions them so visitors never get a new page with an old cached file, and refreshes the Content-Security-Policy hashes. It needs [esbuild](https://esbuild.github.io).

If the top of the page changes, regenerate its inline CSS first with `node tools/make-critical.js http://localhost:4321/`.

Phones paint from that inline CSS while the full stylesheet loads alongside. `sw.js` keeps files on the device so repeat visits are fast; pages always come fresh from the network.
