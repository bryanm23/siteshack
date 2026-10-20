# The Site Shack

Marketing site for The Site Shack, a studio that builds websites for local and small businesses.

The page introduces the studio, the kinds of sites it builds, how a project runs, and a project form. It does not invent client lists, reviews, or prices. Quotes are written per project.

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
