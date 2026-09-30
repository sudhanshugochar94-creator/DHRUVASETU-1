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
