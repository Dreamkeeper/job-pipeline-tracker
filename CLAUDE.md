# Job Pipeline Tracker

Local-first job application tracker. See PRD.md for full product spec.

## Hard constraints

- **No backend, ever.** All data lives in the browser via IndexedDB (Dexie). No fetch calls to any server after page load, no analytics, no external fonts or CDNs.
- Output is a static Vite bundle served by nginx. Nothing in the code may assume a server runtime.
- English UI.
- No em dashes in any user-facing text (UI strings, docs). Use periods, commas, colons, parentheses.

## Stack

- Vite + React + TypeScript
- Dexie + dexie-react-hooks for persistence
- Hand-rolled SVG for the funnel chart. Do not add chart libraries.
- Keep dependencies minimal. Justify any new dependency.

## Commands

- `npm run dev` — dev server
- `npm run build` — type-check + production build to `dist/`
- `npm run preview` — serve the production build locally

## Conventions

- Single-page app, no router unless a real second page appears.
- Database access only through `src/db.ts`. Components use `useLiveQuery` from dexie-react-hooks.
- Stages are a fixed ordered list defined once in `src/types.ts`.
