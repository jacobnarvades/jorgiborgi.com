# jorgiborgi.com

Personal site. Served by a Cloudflare Worker from the static files in `public/`.
`src/worker.js` runs only for `/media/*`, adding HTTP Range support so videos play in Safari.

## Edit content

Journal posts and projects live in the `POSTS` and `PROJECTS` arrays near the bottom of `public/index.html`.

## Deploy

Pushing to `main` deploys automatically (Cloudflare Workers Builds runs
`npx wrangler deploy`). To deploy manually from this folder:

```
npx wrangler deploy
```
