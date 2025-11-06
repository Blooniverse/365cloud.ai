## Purpose

This file guides AI coding agents to be productive in this repository (a small static Express site + flat-file blog generator).

**Quick summary:** the app is a lightweight Express static server (`app.js`) that serves files from `public/`. The blog is a flat-file generator implemented in `scripts/build-blog.js` which reads Markdown from `public/blog/posts/*.md` (front-matter via `gray-matter`) and writes generated HTML under `public/blog/<slug>/index.html` plus `public/blog/feed.xml`.

**How to run locally**

- **Start server:** `npm start` (runs `node app.js`).
- **Rebuild blog after adding/updating Markdown posts:** `npm run build:blog` (runs `node scripts/build-blog.js`).
- **Important env:** `SITE_URL` controls absolute links in generated pages and RSS. Default is `https://365cloud.ai`.

**Big-picture architecture & flow**

- **Entry point:** `app.js` — serves `public/` and falls back to `public/index.html` for SPA-like navigation. Also exposes `/healthz`.
- **Static assets:** `public/assets/` contains `site.css`, `site.js`, `structured-data.js`. Generated blog pages reference these directly.
- **Content generation:** `scripts/build-blog.js` reads Markdown+YAML front matter and uses `marked` + `gray-matter` to produce HTML and JSON-LD. Output goes to `public/blog/`.

**Project-specific patterns & conventions (do not change without careful review)**

- **Front-matter keys:** front-matter commonly uses `Title`, `Date`, `Description`, `Slug` (capitalized OR lowercase). `build-blog.js` accepts either (e.g., `fm.Title || fm.title`).
- **Slugging:** the canonical slug logic lives in `scripts/build-blog.js` (`slugify()`); keep URL patterns as `/blog/<slug>/`.
- **Date handling:** dates are optional but used for sorting and RSS `pubDate`. Prefer ISO-style dates for predictable RSS output.
- **Schema data:** generated pages include Schema.org JSON-LD (`WebPage` / `BlogPosting`) via templates in `build-blog.js`. Preserve `application/ld+json` inclusion when editing templates.
- **Generated vs. source files:** `public/blog/posts/*.md` are sources. Do not edit generated files under `public/blog/<slug>/index.html`—modify source Markdown and re-run `npm run build:blog`.

**Where to look for examples**

- Example Markdown posts: `public/blog/posts/2025-10-31-welcome.md`, `public/blog/posts/2025-11-01-flat-file-blog.md`.
- Server behavior: `app.js` (static middleware + health check + index fallback).
- Blog generator: `scripts/build-blog.js` (pageHeader/pageFooter helpers, `renderPostPage`, `renderIndexPage`, `buildRss`).

**Common tasks and tips for agents**

- To add a new post: create `public/blog/posts/YYYY-MM-DD-slug.md` with YAML front-matter. Then run `npm run build:blog` and verify `public/blog/<slug>/index.html` and `public/blog/feed.xml` updated.
- When editing templates in `scripts/build-blog.js`, preserve `escapeXml`, `stripHtml`, and how JSON-LD is output to avoid XSS or broken structured data.
- Use `SITE_URL` during generation to create correct absolute URLs (important for RSS and canonical JSON-LD). When testing locally, set `SITE_URL=http://localhost:3000`.
- The server expects Node >= 24 (see `package.json` `engines`).

**What agents should not do**

- Do not remove or rename `public/assets/*` references without updating `app.js` and `build-blog.js` templates.
- Do not commit generated HTML in `public/blog/<slug>/index.html` if you intend to keep posts as source-markdown-only; the repo currently contains generated output but treat `public/blog/posts/` as source of truth.

**If merging into an existing `.github/copilot-instructions.md`**

- Preserve any human-written custom sections. Insert or update the "How to run locally" and "Where to look for examples" sections to reflect the files above.

If anything in these instructions is unclear or you'd like more detail (e.g., examples of front-matter, sample post commit flow, or test/debug steps), tell me which part to expand.
