# portfolio

Vance Wallace's portfolio site — side projects and playable demos. Built with [Astro](https://astro.build), deployed on Vercel.

## Run locally

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # static output in dist/
```

## Add or edit a project

Everything lives in `src/data/projects.ts`. Each entry becomes a card on the home page and, unless it has an `externalUrl`, its own page at `/projects/<slug>/`.

- **Thumbnail:** drop a GIF or image in `public/projects/` and set `thumbnail: '/projects/your-file.gif'`.
- **Playable demo:** set `embedUrl` to a hosted build and it's embedded in an iframe on the project page. A game can also live in this repo: put its built files in `public/demos/<slug>/` and use `embedUrl: '/demos/<slug>/index.html'`.

Placeholders in `[BRACKETS]` still need real values (résumé link, LinkedIn, YouTube, demo URLs, domain).

## Deploy

Pushing to `main` deploys automatically once the repo is imported in Vercel (framework preset: Astro, no extra settings).
