
const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');
const matter = require('gray-matter');
const { marked } = require('marked');

const ROOT = path.join(__dirname, '..');
const POSTS_DIR = path.join(ROOT, 'public', 'blog', 'posts');
const OUT_DIR = path.join(ROOT, 'public', 'blog');
const SITE_URL = process.env.SITE_URL || 'https://365cloud.ai';

function slugify(input){
  return String(input).toLowerCase().normalize('NFKD').replace(/[^a-z0-9\s-]/g,'').trim().replace(/[\s-]+/g,'-');
}
function escapeXml(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;'); }
function stripHtml(html){ return String(html).replace(/<[^>]*>/g,''); }

function pageHeader({ title, pageUrl, description }){
  const webPageLd = {
    "@context":"https://schema.org",
    "@type":"WebPage",
    "url": pageUrl,
    "name": title,
    "description": description || '',
    "isPartOf": {"@type":"WebSite","url":SITE_URL+"/","name":"365cloud.ai"}
  };
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${escapeXml(title)}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="description" content="${escapeXml(description||'')}" />
  <link rel="alternate" type="application/rss+xml" href="/blog/feed.xml" title="365cloud.ai Blog RSS" />
  <link rel="stylesheet" href="/assets/site.css" />
  <script src="/assets/site.js" defer></script>
  <script src="/assets/structured-data.js" defer></script>
  <script type="application/ld+json">${JSON.stringify(webPageLd)}</script>
</head>
<body itemscope itemtype="http://schema.org/WebSite" typeof="schema:WebSite">
  <header class="container">
    <button id="menuBtn" aria-controls="drawer" aria-expanded="false" aria-label="Open menu">☰</button>
    <span class="pill">365cloud.ai — Engineering Digital Transformations</span>
    <h1>${escapeXml(title)}</h1>
    ${description? `<h2 style="margin:.25rem 0 0; font-weight:500; color:var(--muted);">${escapeXml(description)}</h2>`: ''}
  </header>
  <div id="scrim" class="scrim" hidden></div>
  <aside id="drawer" class="drawer" aria-hidden="true" aria-label="Site menu">
    <nav class="menu" role="navigation">
      <a href="/">Home</a>
      <a href="/project-power/">Project Power</a>
      <a href="/blog/">Blog</a>
      <a href="/imprint/">Imprint</a>
      <hr style="border:1px solid var(--line);border-width:0 0 1px;margin:.5rem 0" />
      <label class="switch"><input id="themeToggle" type="checkbox"/> Light mode</label>
    </nav>
  </aside>
  <main class="container" style="padding:1.5rem 0;">`;
}

function pageFooter(){
  return `
  </main>
  <footer class="container">
    <span>© 2025 365cloud.ai</span>
  </footer>
</body>
</html>`;
}

async function readPosts(){
  const files = await fsp.readdir(POSTS_DIR);
  const posts = [];
  for(const file of files){
    if(!file.endsWith('.md')) continue;
    const raw = await fsp.readFile(path.join(POSTS_DIR, file), 'utf8');
    const parsed = matter(raw);
    const fm = parsed.data || {};
    const title = fm.Title || fm.title || path.basename(file, '.md');
    const date = fm.Date || fm.date || '';
    const description = fm.Description || fm.description || '';
    const slug = fm.Slug || fm.slug || slugify(title);
    const html = marked.parse(parsed.content);
    const text = stripHtml(html);
    posts.push({ title, date, description, slug, html, text });
  }
  posts.sort((a,b)=> (a.date < b.date ? 1 : -1));
  return posts;
}

function renderPostPage(p){
  const url = `${SITE_URL}/blog/${p.slug}/`;
  const blogPostingLd = {
    "@context":"https://schema.org",
    "@type":"BlogPosting",
    "headline": p.title,
    "datePublished": p.date || undefined,
    "description": p.description || undefined,
    "mainEntityOfPage": {"@type":"WebPage","@id": url},
    "author": {"@type":"Organization","name":"365cloud.ai"},
    "publisher": {"@type":"Organization","name":"365cloud.ai"},
    "url": url
  };
  const h2 = [p.date, p.description].filter(Boolean).join(' — ');
  const bodyHTML = `<article class="post">${p.html}</article>`; // main > article
  return pageHeader({ title: `${p.title} — 365cloud.ai`, pageUrl: url, description: h2 }) +
         `<script type="application/ld+json">${JSON.stringify(blogPostingLd)}</script>` +
         bodyHTML + pageFooter();
}

function renderIndexPage(posts){
  const url = `${SITE_URL}/blog/`;
  const body = posts.map(p=>{
    const meta = [p.date, p.description].filter(Boolean).join(' — ');
    return `<a href="/${['blog', p.slug, ''].join('/')}" class="item"><strong>${p.title}</strong><br><span class="muted">${meta}</span></a>`;
  }).join('\n');
  const bodyHTML = `<div class="list">${body || '<p>No posts yet.</p>'}</div>`;
  return pageHeader({ title: 'Blog — 365cloud.ai', pageUrl: url, description: 'Insights on Microsoft 365, Power Platform, Azure Cloud & Azure AI.' }) + bodyHTML + pageFooter();
}

function buildRss(posts){
  const now = new Date().toUTCString();
  const channelTitle = '365cloud.ai — Blog';
  const channelLink = `${SITE_URL}/blog/`;
  const channelDesc = 'Insights on Microsoft 365, Power Platform, Azure Cloud & Azure AI.';
  const itemsXml = posts.map(p=>{
    const link = `${SITE_URL}/blog/${p.slug}/`;
    const pubDate = p.date ? new Date(p.date).toUTCString() : now;
    const desc = escapeXml(p.description || (p.text || '').slice(0, 200));
    return `\n    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${desc}]]></description>
    </item>`;
  }).join('\n');

  return `<?xml version=\"1.0\" encoding=\"UTF-8\"?>
<rss version=\"2.0\">
  <channel>
    <title>${escapeXml(channelTitle)}</title>
    <link>${escapeXml(channelLink)}</link>
    <description>${escapeXml(channelDesc)}</description>
    <language>en</language>
    <lastBuildDate>${now}</lastBuildDate>
    <generator>365cloud.ai static generator</generator>${itemsXml}
  </channel>
</rss>\n`;
}

async function build(){
  await fsp.mkdir(OUT_DIR, { recursive: true });
  const posts = await readPosts();

  for(const p of posts){
    const dest = path.join(OUT_DIR, p.slug);
    await fsp.mkdir(dest, { recursive: true });
    await fsp.writeFile(path.join(dest, 'index.html'), renderPostPage(p), 'utf8');
  }

  await fsp.writeFile(path.join(OUT_DIR, 'index.html'), renderIndexPage(posts), 'utf8');

  const rss = buildRss(posts);
  await fsp.writeFile(path.join(OUT_DIR, 'feed.xml'), rss, 'utf8');

  console.log(`Built ${posts.length} post(s) and RSS feed.`);
}

build().catch(err=>{ console.error(err); process.exit(1); });
