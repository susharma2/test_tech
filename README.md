# Verifcore Consultants — Website

Production-grade static website for Verifcore Consultants.

## Project Structure

```
verifcore/
├── index.html          ← Main HTML (all links use relative #anchors)
├── css/
│   └── styles.css      ← All styles, responsive, CSS custom properties
├── js/
│   ├── data.js         ← ALL site content (edit this to update text)
│   ├── services.js     ← Renders service cards
│   ├── approach.js     ← Renders approach steps + tool badges
│   ├── faq.js          ← Renders FAQ + accordion interaction
│   ├── form.js         ← Contact form validation + submission
│   └── main.js         ← Nav, scroll reveal, counters, mobile menu
└── assets/
    └── favicon.svg     ← Site icon
```

## How to Edit Content

Open `js/data.js` — every service, FAQ answer, and tool badge is stored there. No need to touch HTML.

## Deploying to GitHub Pages

1. Create a new GitHub repository (e.g. `verifcore-website`)
2. Upload **all files and folders** maintaining the folder structure above
3. Go to **Settings → Pages → Source** → select `main` branch → `/ (root)` → **Save**
4. Your site is live at `https://yourusername.github.io/verifcore-website/`

### Custom Domain
In **Settings → Pages → Custom domain**, enter your domain (e.g. `verifcore.com`).
Then add a CNAME record in your DNS pointing to `yourusername.github.io`.

## Contact Form — Backend Integration

The form works immediately via `mailto:` fallback.
For a no-code backend, sign up at [formspree.io](https://formspree.io), create a form,
and paste your Form ID into `js/form.js` at the `FORMSPREE_ID` variable.

## Tools Used

- Vanilla HTML5, CSS3, JavaScript (ES6+) — zero frameworks, zero build step
- Google Fonts (Space Grotesk + Inter) — loaded via CDN
- Intersection Observer API for scroll animations
- CSS custom properties for easy theming
