# svpeddi.com

Personal site of Sai Vivek Peddi, founder of [mlpal](https://mlpal.ai). A
glass-and-cobalt site with a 3D hero, physics stickers and a hyperspace finale.

## Stack

- Vite + React + TypeScript + Tailwind v4, no client router. Every page is prerendered to
  static HTML at build time (`scripts/prerender.mjs`), then hydrated.
- Motion: three.js (hero), matter.js (sticker physics), GSAP ScrollTrigger + Lenis (scroll),
  the same stack the Awwwards references use. three.js and matter.js are code-split and load
  after first paint.
- Type: TikTok Sans (variable, OFL) for everything, Geist Mono for UI labels.
- The hero writes "sai" as a glass tube along a hand-drawn path (`src/components/hero/saiPath.ts`,
  also used for the signature). On a software WebGL renderer, or a device that can't hold the
  frame rate, it falls back to a static backdrop or a frozen frame.
- `prefers-reduced-motion` turns off smooth scroll, the write-on and the sticker drop.

## Commands

```bash
npm run dev         # dev server (client-rendered)
npm run build       # client build + SSR build + prerender
npm run preview     # serve the production build on :4173
npm run typecheck
npm test            # unit tests (vitest)
npm run test:e2e    # smoke tests against the production build (playwright)
```

## Writing a note

Add `src/notes/<slug>.mdx`:

```mdx
---
title: A title
date: 2026-10-05
summary: One or two sentences for cards, RSS and link previews.
tags: [harness, agents]
---

Body in Markdown.
```

It appears on the home page, `/notes/`, `/notes/<slug>/`, the RSS feed and the sitemap. Bad frontmatter fails the build with the
note's slug in the error. Reading time is computed at compile time.

## Content

Copy lives in `src/content/`:

- `profile.ts`: name, links, email.
- `work.ts`: the project cards (screenshots in `public/work/` are captures of mlpal.ai).
- `research.ts`: mirrors <https://mlpal.ai/research>.
- `openSource.ts`: repos and install commands.

## Deploy

`.github/workflows/deploy.yml` runs typecheck, unit tests, build and e2e on every push
and PR. On `main` it publishes `dist/client` to the `gh-pages` branch, which GitHub Pages
serves at www.svpeddi.com (`public/CNAME`). To roll back, revert on `main`, or re-run the
deploy job of an earlier green run.
