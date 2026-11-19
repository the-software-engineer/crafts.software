<p align="center">crafts.software, the landing page for The Software Engineer Ltd.</p>

SvelteKit site deployed to Cloudflare Pages.

## Features

- SvelteKit + Svelte 5
- Cloudflare Pages via `@sveltejs/adapter-cloudflare`
- Tailwind for styling
- Bun as the package manager and task runner

## The home page

The home page is the Paper board `Home · Desktop` and `Home · Mobile` (file "TSE &
Personal Sites", page "crafts.software"). Change it in Paper first. It is
prerendered; only `/api/subscribe` runs as a Pages Function.

- The page is the board scaled to fit one screen. `--u` (one board pixel) is
  set in `src/routes/+page.svelte`, and a class like `pt-u88` or `text-u36` is
  that many board pixels (`tailwind.config.cjs`). Write board values, not CSS
  pixels.
- Desktop (768px and wider) scales everything, from 0.55 up to board size. It
  fits any window at least 617px tall.
- Mobile keeps the buttons, the field, 14px text and the 24px gutters at board
  size, and scales the rest, never below a 16px sentence. The sentence may wrap
  to fewer lines than the board. Screens shorter than about 790px (814px at
  360 wide) scroll.
- Text never drops below 12px (desktop) or 14px (mobile), and keeps the
  board's Inter optical size, so a scaled line breaks where the board's does.
- Product icons live in `static/products/` at 48, 72 and 108 px.
- Links to other sites Theo runs carry `utm_source=crafts.software`,
  `utm_medium=website` and `utm_content=body` (or `footer`), built by
  `src/lib/campaign-link.ts`. See `the-foundry/standards/site-footer.md`.

## Newsletter sign-up

The form writes to Theo's newsletter list, `gregory_subscribers`, the same list
gregory.sh writes to. It posts to `/api/subscribe`, which checks Cloudflare
Turnstile and then calls the newsroom lists API
(`https://the-newsroom-lists.crafts.software`). The site keeps no list of its own.
Each new signup is saved with `fields.source = crafts.software`.

- `src/lib/newsroom/` is the same client as gregory.sh and landing-template:
  `client.server.ts` and `lists.server.ts` are server only, and `types.ts` and
  `openapi.json` are generated. `bun run newsroom:pull` refreshes the pinned
  schema, `bun run newsroom:generate` rewrites the types, and
  `bun run newsroom:check` (run in CI) fails when they drift.
- Turnstile widget: `crafts_software_email_forms` in `tse/infrastructure`, for
  crafts.software and www.crafts.software only. The sitekey is in
  `src/lib/turnstile-config.ts`. Other hosts (localhost, pages.dev) get
  Cloudflare's test key, whose tokens the server rejects, so local dev and
  previews can never write to the list.
- Turnstile loads on the first interaction with the form, not on page load.
- Without `TURNSTILE_SECRET_KEY` or `NEWSROOM_LISTS_TOKEN`, the endpoint answers 503
  and the form shows a short refusal. The Newsletter button links to
  gregory.sh/subscribe either way.

## How to locally serve the page?

```shell
bun install
bun run dev -- --open
```

Locally the form always refuses: there is no Turnstile secret or list token.

## How do I run checks?

```shell
bun run lint
bun run check
bun run newsroom:check
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

The only GitHub secret is the org-level `OP_SERVICE_ACCOUNT_TOKEN`; it is what reads
1Password. Both workflows load their values in one `op run` step:

- `CLOUDFLARE_PAGES_DEPLOYMENT_API_TOKEN` (`github actions - pages deployment`, vault
  `TSE Systems`, field `credential`). This item is shared across landing-template
  and its forks; this repo does not hold its own copy.
- `NEWSROOM_LISTS_TOKEN` (`gregory.sh - the-newsroom-lists bearer token`, field
  `token`), deploy only. The newsroom gives each list one token, so this site
  shares gregory.sh's. Theo waived the one-token-per-site rule for this on
  2026-11-18 (TSE-873). Rotating it means redeploying gregory.sh, crafts.software
  and the-newsroom-lists together. `deploy.yml` writes it to both Pages
  environments.
- `TURNSTILE_SECRET_KEY` (`crafts.software - turnstile secret key`, field
  `credential`), deploy only. The widget's server-side secret. `deploy.yml`
  writes it to the production Pages environment only, so previews keep
  Cloudflare's test keys.

`deploy.yml` sets these Pages secrets before deploying. If that step fails, the
deploy goes on with a warning.
