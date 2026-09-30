# DhruvaSetu

Polar science outreach, knowledge repository and media portal for NCPOR (SIH26063). React + TypeScript + Vite + Tailwind + Supabase.

```bash
npm install
cp .env.example .env   # add your Supabase URL and anon key
npm run dev
```

## Project structure

```
src/
  app/          App entry, providers, routes
  features/     One folder per feature: pages/, components/, services/, data/
    home  repository  expeditions  datasets  publications  media
    outreach  learn  about  studio  dashboard  auth
  shared/       ui/ (buttons, modals...), layout/ (sidebar, shell, footer),
                art/ (mountain SVG), context/, lib/, types/
```

Imports across folders use the `@/` alias (for example `@/shared/ui/Button`).

## Production build

```bash
npm ci
npm run build
```

The production output is written to `dist/`.

## Deploying to Vercel

Import this repository into Vercel with the Vite framework preset. Use `npm ci`
for the install command, `npm run build` for the build command, and `dist` as
the output directory. `vercel.json` rewrites app routes to the SPA entry point
so direct links and page refreshes work.

Set these variables in the Vercel project settings for each deployment
environment:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Use the public Supabase URL and anon key only; never expose a service-role key
or other private credentials in a `VITE_*` variable. Configure the deployed
site URL in Supabase Auth's allowed site and redirect URLs.

The agent features require the separate Python service in `agents/`. Deploy it
to a public HTTPS endpoint and set `VITE_AGENT_API_URL` to that endpoint. The
service must allow requests from the deployed Vercel domain via CORS. Without
that service, the rest of the web app can run, but agent actions will be
unavailable. The local default `http://localhost:8000` is only for development.
