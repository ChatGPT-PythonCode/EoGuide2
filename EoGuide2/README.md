# EO Guides (GitHub Pages + Editor)

This project is set up for **GitHub Pages** (static hosting) with:

- **Static guide content** stored as Markdown in `content/guides/*.md`
- A build step that generates JSON into `client/public/data/guides/`
- **Decap CMS** editor at `/admin/` (for your team to add/edit guides + upload images)
- **User submissions** via a GitHub **Issue Form** (`Submit a Guide`)

---

## Quick start (local)

```bash
npm install
npm run dev
```

This runs:

1) `npm run generate` (builds `client/public/data/guides/*.json`)
2) `vite` dev server

Open the URL printed in the terminal.

---

## Content workflow

### Add/edit guides (Markdown)

Guides live here:

- `content/guides/<slug>.md`

Frontmatter fields supported:

```yaml
---
title: "My Guide"
slug: "my-guide"
category: "quest" # quest | travel | class | command | misc
summary: "Short summary…"
imageUrl: "uploads/my-image.png"     # optional
videoUrl: "https://youtube.com/..."  # optional (YouTube/Vimeo)
createdAt: "2026-01-23"              # optional
---
```

Body is standard Markdown.

### Images

Put images in:

- `client/public/uploads/`

Then reference them in Markdown like:

```md
![Alt text](uploads/my-image.png)
```

---

## Team editor (Decap CMS)

The editor is served at:

- `/admin/` (file: `client/public/admin/index.html`)

Config file:

- `client/public/admin/config.yml`

### GitHub Pages auth (important)

Because GitHub Pages is static, Decap CMS needs a small **OAuth proxy** hosted elsewhere
(Cloudflare Worker / serverless). In `config.yml`, set:

- `backend.repo: ChatGPT-PythonCode/EoGuide2`
- `backend.base_url: https://YOUR_OAUTH_PROXY_DOMAIN (see decap-proxy instructions below)`
- `site_url: https://chatgpt-pythoncode.github.io/EoGuide2/`

---

## User submissions (no backend required)

Users submit ideas via GitHub Issues:

- `.github/ISSUE_TEMPLATE/submit-guide.yml`

After someone submits, you review the issue and publish it by creating a new guide in `/admin`
(or by adding a Markdown file under `content/guides/`).

Update the **Contribute** link in:

- `client/src/components/Footer.tsx`

Replace `ChatGPT-PythonCode/EoGuide2` in the `submitUrl`.

---

## Deploy to GitHub Pages

This repo includes a GitHub Actions workflow:

- `.github/workflows/deploy.yml`

Steps on GitHub:

1) Go to **Settings → Pages**
2) Under **Build and deployment**, set **Source = GitHub Actions**
3) Push to `main` — it will build and deploy automatically

Build output is in:

- `dist/`

---

## Commands

```bash
npm run generate   # generate JSON from Markdown
npm run dev        # local dev server
npm run build      # build for GitHub Pages (dist/)
npm run preview    # preview the built site locally
```
