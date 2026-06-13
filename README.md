# Job Pipeline Tracker

A local-first job application tracker. Track your applications, see funnel health (Applied, Screen, Interview, Offer), and keep every byte of your job search data on your own machine.

**Live demo: https://jt.dkvasnikov.ru**

Open the link, click "Load demo data", and explore. No account, no signup, no cookies.

## Privacy by architecture

Job search data is sensitive: companies, stages, rejections, notes about interviewers. This app is built so that data cannot leak, because the app never receives it.

- All data lives in your browser via IndexedDB (Dexie).
- There is no backend. The server only serves static files.
- No network calls after page load: no analytics, no external fonts, no CDNs, no telemetry.
- Backup and portability via JSON export and import.

Clearing your browser storage deletes your data. Export to JSON if you want a backup.

## Features

- Applications table: company, role, link, source, stage, dates, next action, notes. Add, edit, delete, sort, filter.
- Funnel view: counts per stage with conversion percentages, rendered as hand-rolled SVG (no chart library).
- JSON export and import for full backup and restore.
- Demo mode: seed about 15 fictional applications with one click, clear everything with another.

## Stack

- Vite, React, TypeScript
- Dexie and dexie-react-hooks for IndexedDB persistence
- No router, no chart library, minimal dependencies

## Run locally

```sh
npm install
npm run dev      # dev server
npm run build    # type-check + production build to dist/
npm run preview  # serve the production build locally
```

## Deployment

The production build is a static bundle (`dist/`) served by nginx on a VPS:

- An nginx server block serves the files with SPA-safe routing (`try_files ... /index.html`). See [deploy/nginx-jt.conf](deploy/nginx-jt.conf).
- Cache policy: hashed assets in `/assets/` are cached long-term and immutable, `index.html` is never cached, so deploys take effect immediately.
- HTTPS is terminated at the edge with a valid certificate. Because port 443 on this host is already used by another service, nginx listens on a non-standard TLS port and the edge forwards to it. That detail is specific to this host; the app itself just needs any static web server.

### One-time server provisioning

```sh
# copy the build up once, then run the provisioning script on the server
bash scripts/server-setup.sh
```

[scripts/server-setup.sh](scripts/server-setup.sh) is idempotent: it creates the web root, an origin TLS cert, the nginx server block, and a firewall rule, then tests and reloads nginx. It does not touch any other site on the host.

### Updating (one command)

```sh
./scripts/deploy.sh
```

[scripts/deploy.sh](scripts/deploy.sh) rebuilds the bundle, ships it, and reloads nginx. Override the SSH host with `DEPLOY_HOST=myhost ./scripts/deploy.sh`.

## Credits

Vibe-coded with [Claude Code](https://claude.com/claude-code). Product spec in [PRD.md](PRD.md).
