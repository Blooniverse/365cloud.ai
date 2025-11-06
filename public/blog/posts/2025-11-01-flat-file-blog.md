---
Title: A tiny flat-file blog that ships
Date: 2025-11-01
Description: Markdown → HTML → RSS, no databases, no heavy build chain.
---

Keep posts as markdown under `/public/blog/posts` and run:

```
npm run build:blog
```

The script will generate per-post pages, the blog archive, and `/blog/feed.xml`.
