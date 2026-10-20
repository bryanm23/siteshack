# The Site Shack

Marketing site for The Site Shack, a New Jersey studio that builds websites for small businesses. A simple site starts at $500 and stays online for 5 years.

The page introduces the studio, the kinds of sites it builds, sample layouts for common trades, how a project runs, and a project form. The sample businesses are examples, not clients.

## Develop

```bash
npm install
npm run dev
```

The dev server runs at `http://localhost:5173`.

```bash
npm run build
npm run preview
```

`npm run build` writes a static site to `dist/`.

Cloudflare Workers deploys that folder with `npx wrangler deploy`. The Worker settings live in `wrangler.jsonc`.

## Before you publish

Change the studio address in the footer of `index.html` (`hello@thesiteshack.com`). The project form addresses that same link.

Replace the copy anywhere the town, offer, or process should be more specific. Prices stay off the page on purpose: the form promises a written quote.
