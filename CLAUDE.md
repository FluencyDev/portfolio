# CLAUDE.md - Renato Waru Portfolio

## Project Overview
Professional portfolio site for Renato Waru — Strategic Brand Designer & Art Director.
Live at: https://renatowaru.com
GitHub: https://github.com/FluencyDev/portfolio
Auto-deployed from GitHub to Hostinger via webhook.

## Brand Identity
- **Name:** Renato Waru
- **Consultancy:** Navemãe Design Multimídia
- **Title:** Strategic Brand Designer & Art Director (recently updated from "Art Director" to "Creative Director")
- **Philosophy:** #designcomsignificado (Design with Meaning)
- **Core Values:** Narrative-driven, significance-focused, trust-building partnerships

## Project Context

### Current Role
- Strategic partner to Riza Sementes (agribusiness, monthly retainer)
- Portfolio repositioning toward international clients and premium-currency markets
- Challenge: exposure and public declaration (not capability)

### Case Studies Featured
1. **Riza Sementes** — Brand direction, wayfinding system, website redesign (active)
2. **Better Work Together** — Art direction for Enspiral Foundation (5-continent distributed)
3. **Waru Piracaia** — Designed life project (5,000m² property, bioconstruction, Airbnb glamping)
4. **Open Lunar Foundation** — Annual report design

### Personal Context
- Lives in Piracaia, SP (rural property)
- Partner: Maga (yoga teacher, stress management author)
- Children in Melbourne, Australia
- Maintains daily hand-drawing practice (watercolor, ink, Caran d'Ache)
- Co-manages Preto Inácio (family asset administration company)

## Tech Stack

### Development
- **Frontend:** HTML + CSS + JS (vanilla, no framework)
- **Design Tool:** Figma (for design systems)
- **Version Control:** Git + GitHub
- **Hosting:** Hostinger (auto-deploy via GitHub webhook)
- **Deployment:** Automatic on git push

### Tools for Development
- **Editor:** VS Code
- **AI Assistant:** Claude Code (Terminal) + VS Code
- **Design Assistant:** Antigravity (Google, for visual editing)
- **Models:** Claude Sonnet 4.6 (recommended for this project)

## Design & Content Strategy

### Visual Language
- Warm, editorial aesthetic
- Professional minimalism
- Human-centered, narrative-first
- Typography: Syne (current)

### Content Pillars
1. **Work:** Case studies with strategic depth
2. **Thinking:** Essays on design meets strategy
3. **Practice:** Hand drawings, visual journal

### Key Pages
- `index.html` — Home (hero, featured work, CTA)
- `bwt.html` — Better Work Together case study
- `riza.html` — Riza Sementes case study
- `fw.html` — Featured work

## Git Workflow

### Local Development
```bash
# 1. Edit files in VS Code or Antigravity
# 2. Save (Cmd+S)
# 3. Stage and commit
git add .
git commit -m "Clear, present-tense description"
# 4. Push
git push
```

### Deployment
- GitHub webhook triggers automatically on push
- Hostinger pulls changes
- Site updates at renatowaru.com (live in seconds)

### Sync Between Mac Mini & MacBook
```bash
# On other Mac before starting work:
git pull  # Get latest changes
# Make edits
git push  # Send back
```

## Project Structure

```
portfolio/
├── index.html          # Home (hero, Wall of Trust, featured project, craft, quick wins, services)
├── about.html          # Bio, personal practice
├── riza.html           # Case study — Riza Sementes
├── bwt.html            # Case study — Better Work Together
├── aquaponia.html      # Case study — Introdução à Aquaponia (authored book)
├── partials/
│   ├── header.html     # Shared header — edit here, never inside the pages
│   └── footer.html     # Shared footer — edit here, never inside the pages
├── build.py            # Propagates the partials into each root *.html
├── .githooks/
│   └── pre-commit      # Runs build.py and re-stages the pages it updates
├── css/style.css       # Single stylesheet for the whole site
├── js/main.js          # Single script: mobile nav drawer + current-page highlight
├── fonts/Syne/         # Self-hosted Syne (variable font + static weights)
└── assets/
    ├── images/         # All images served by the site (webp/png/jpg/svg)
    │   └── bwt/        # Better Work Together case images
    └── mobile-src/     # Working originals for the mobile crops — git-ignored, never published
```

Notes:
- `build.py` is not a site generator. It only replaces the content between
  `<!-- HEADER:START -->` / `<!-- HEADER:END -->` and `<!-- FOOTER:START -->` /
  `<!-- FOOTER:END -->` in each `*.html` at the project root (it does not descend
  into subfolders). Everything outside those two blocks is hand-written and is
  never touched by the build.
- The `pre-commit` hook only runs if hooks are wired up once per clone:
  `git config core.hooksPath .githooks`.

## Conventions

- **Single breakpoint: 768px.** All responsive rules live in
  `@media (max-width: 768px)` in `css/style.css` (two blocks: the mobile nav
  drawer and the general mobile layout). `js/main.js` mirrors it with
  `matchMedia('(min-width: 769px)')`. Intermediate sizes are handled with
  `clamp()`, not with extra breakpoints.
- **Mobile images:** use `<picture>` with
  `<source media="(max-width: 768px)" srcset="assets/images/NAME-mobile.webp">`
  and the desktop `<img>` as the fallback. Both files sit side by side in
  `assets/images/` (`NAME-desktop.webp` / `NAME-mobile.webp`). Reference
  implementation: the hero in `aquaponia.html`. Working originals go in
  `assets/mobile-src/`, which is git-ignored.
- **Branch flow:** do mobile work on the `mobile-fixes` branch. A push to `main`
  deploys straight to production through the Hostinger webhook, so merge into
  `main` only after Renato approves.
- **Header and footer:** edit `partials/header.html` / `partials/footer.html`,
  then run `python3 build.py` and commit the pages it reports as `updated`.
  Never edit the header or footer markup inside the pages.
