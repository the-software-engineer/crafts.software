<p align="center">crafts.software — the landing page for The Software Engineer Ltd.</p>

SvelteKit site deployed to Cloudflare Pages.

## Features

- SvelteKit + Svelte 5
- Cloudflare Pages via `@sveltejs/adapter-cloudflare`
- Tailwind for styling
- Bun as the package manager and task runner

## How to locally serve the page?

```shell
bun install
bun run dev -- --open
```

## How do I run checks?

```shell
bun run lint
bun run check
```

## Building

To create a production build:

```shell
bun run build
```

You can preview the production build with `bun run preview`.

## Deploying

Pushes to `main` deploy to Cloudflare Pages via `.github/workflows/deploy.yml`.
Every other branch gets a preview deployment via `.github/workflows/preview.yml`,
with the URL posted as a PR comment. See `wrangler.toml` for the Pages project
config.
