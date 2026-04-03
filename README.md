# Konsuldoc

Indonesian pharmacy consultation app — React Native (Expo) mobile client + Fastify API backend.

## Monorepo Structure

```
/mobile   — Expo React Native app (iOS + Android + Web)
/server   — Fastify API backend (Node.js + TypeScript)
/shared   — Shared TypeScript types and Zod schemas
```

## Requirements

- Docker and Docker Compose
- Make
- No local Node.js, npm, or other runtimes required

## Quick Start

```bash
make setup    # copy .env template (first time only)
make up       # build and start all services
```

Server runs at `http://localhost:8080`, mobile dev at `http://localhost:8081`.

## Makefile Targets

Run `make help` to see all targets:

```
  setup               First-time setup: copy env template
  up                  Start all services (server + mobile dev)
  down                Stop all services
  restart             Restart all services
  logs                Tail logs for all services
  server              Start server only
  server-build        Rebuild server image
  server-logs         Tail server logs
  server-shell        Open a shell inside the running server container
  mobile              Start mobile dev server (Expo web on :8081)
  mobile-build        Rebuild mobile dev image
  mobile-logs         Tail mobile dev server logs
  mobile-shell        Open a shell inside the running mobile container
  mobile-web          Build and serve mobile as static web app on :3000
  mobile-web-build    Rebuild mobile web image
  db-reset            Wipe the SQLite database and start fresh
  db-shell            Open SQLite CLI inside the server container
  deploy              Build, push, and deploy to Google Cloud Run
  clean               Stop all services, remove volumes and images
```

## Development Workflow

### Start everything

```bash
make up               # builds and starts server + mobile-dev
make logs             # tail all logs
```

### Server only

```bash
make server           # start server container
make server-logs      # watch logs
make server-shell     # get a shell inside the container
```

### Mobile (Expo web dev server)

```bash
make mobile           # start Expo dev server in web mode on :8081
make mobile-logs      # watch logs
make mobile-shell     # get a shell (run expo commands, install packages, etc.)
```

### Mobile (static web build)

```bash
make mobile-web       # build and serve as static web app on :3000
```

### Database

```bash
make db-shell         # open SQLite CLI
make db-reset         # wipe database and restart server
```

## Google Cloud Run Deployment

### One-time GCP Setup

```bash
gcloud config set project YOUR_PROJECT_ID

gcloud services enable run.googleapis.com \
  containerregistry.googleapis.com \
  storage.googleapis.com

gsutil mb -l asia-southeast1 gs://konsuldoc-sqlite-data

gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:YOUR_PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
  --role="roles/storage.objectAdmin"
```

### Add Google Maps API Key to Secret Manager

```bash
echo -n "YOUR_API_KEY" | gcloud secrets create google-maps-api-key \
  --replication-policy="automatic" \
  --data-file=-
```

### Deploy

```bash
make deploy
```

Edit `deploy.sh` and `cloud-run.yaml` to set your `PROJECT_ID` before deploying.

## Migrating from SQLite to PostgreSQL

When ready, change exactly two files:

1. **`/server/src/db/index.ts`** — swap the Drizzle client from `better-sqlite3` to `node-postgres`
2. **`/cloud-run.yaml`** — remove the GCS volume mount, add `DATABASE_URL` env var pointing to Cloud SQL

Nothing else in the codebase changes.
