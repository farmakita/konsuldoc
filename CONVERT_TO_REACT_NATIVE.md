# Konsuldoc — Convert Web Prototype to React Native (Expo)

I have a working web app prototype for an Indonesian pharmacy app called **Apotek Mutiara**. I need to convert it to a proper React Native mobile app called **Konsuldoc**.

**Source files are in `~/projects/apotek/app-prototype`** (index.html, js/app.js, js/i18n.js, js/medications.js, css/app.css). Read all of them thoroughly before writing any code.

**The new app must be created at `~/projects/apotek/konsuldoc`.**

---

## Architecture Overview

This is a two-part system:

1. **Mobile app** — Expo/React Native client (iOS + Android)
2. **API backend** — Node.js/Fastify server, containerized, deployed to Google Cloud Run

The mobile app communicates with the backend via a REST API. The backend owns all data persistence. The mobile app owns all UI state (Zustand) and only calls the API for operations that need to be persisted (orders, user profiles, medication catalogue).

```
[iOS / Android App]
        │
        │ HTTPS REST API
        ▼
[Google Cloud Run]
  └── Fastify API Server (Node.js + TypeScript) — Konsuldoc API
        └── Drizzle ORM
              └── SQLite (now) → PostgreSQL (later, zero app changes)
```

---

## Target Stack

### Mobile (Client)
- **Expo** (managed workflow, SDK 51+)
- **NativeWind v4** (Tailwind syntax for styling)
- **React Navigation v6** (stack + bottom tabs)
- **Zustand** (global state, replacing the App.state object)
- **AsyncStorage** (replacing localStorage for saved profile)
- **react-native-maps** + **Google Places API** (replacing Leaflet + Nominatim)
- **TypeScript** (strict mode)

### Backend (Server)
- **Fastify** — API framework (faster and lighter than Express, TypeScript-native)
- **Drizzle ORM** — database abstraction layer (see Database section below)
- **SQLite via better-sqlite3** — initial database (file-based, zero config)
- **Zod** — request/response validation and schema sharing with the frontend
- **TypeScript** (strict mode)

---

## What Must Be Preserved Exactly

1. **medications.js** — migrate as-is, TypeScript types added, zero logic changes
2. **i18n.js** — migrate as-is, keep all Indonesian and English strings
3. **All user flows** in exact order:
   - Welcome → Consultation → Doctor Offer → Searching → Recommendations → Cart → Payment → Delivery → Confirmation
4. **All business logic**: age group filtering, allergy filtering, category filtering (no obat keras), price sorting, consult cards
5. **Bilingual support** (Bahasa Indonesia / English toggle, persisted)
6. **Saved profile** (age, weight, allergies loaded on return visit via AsyncStorage)
7. **Progress bar** across the 5 main steps
8. **All 10 payment methods** with their sub-forms (card fields, phone input, QR placeholder, virtual account numbers)
9. **All courier groups** (regular, express, instant) with pricing
10. **Order confirmation** with generated order number and estimated arrival

---

## Screen-by-Screen Requirements

### Welcome Screen
- Full screen gradient (teal-600 → teal-700)
- App name, tagline, 3 feature highlights
- "Mulai Konsultasi" CTA button
- Language toggle button

### Consultation Screen
- Age + weight inputs (numeric keyboard)
- Allergy checkboxes (5 options + "no known allergies")
- Symptom grid (10 symptoms, 3 columns, emoji + label chips, multi-select)
- Free text field for additional symptoms
- Profile loaded banner if returning user
- Sticky bottom submit button

### Doctor Offer Screen
- Centered illustration layout
- Two buttons: consult doctor (shows "coming soon" bottom sheet) or skip to recommendations
- Warning note about prescription drugs

### Searching Screen
- Animated progress bar (2.8s)
- Cycling status messages
- Bouncing dots animation
- Auto-advances to recommendations

### Recommendations Screen
- Patient summary card (age, weight, age group)
- Medication cards showing:
  - Brand name, generic name, form, category badge (colour coded: green/blue/amber)
  - Price
  - Dosage box
  - Warning box
  - Add to cart button (disabled + style change once added)
- Consult cards (amber styling) for infant conditions
- Disclaimer card at bottom
- Sticky "View Cart" button appears once cart has items

### Cart Screen
- Item list with quantity +/− controls and remove button
- Price summary (subtotal, shipping TBD, total)
- Sticky checkout button

### Payment Screen
- Collapsed order summary (expandable)
- 4 payment groups: Card, Digital Wallet, QRIS, Bank Transfer
- Inline sub-form appears below selected group:
  - Card: number, expiry, CVV, name fields
  - Wallets: phone number field
  - QRIS: QR code placeholder
  - Bank: virtual account number display with copy button
- Sticky pay button with 1.5s processing simulation

### Delivery Screen
- Address textarea
- Interactive map (react-native-maps) with search bar using Google Places Autocomplete
- Tap to pin location on map
- 3 courier groups (regular / express / instant), 10 couriers total
- Selected courier shows tick indicator
- Sticky total + confirm button

### Confirmation Screen
- Animated checkmark
- Order number (APK-XXXXXXXX format)
- Estimated arrival date
- Order items list
- Payment and courier summary
- Track order button (shows toast: feature coming soon)
- Back to home button (resets all state except saved profile)

---

## Design System

Use NativeWind with this colour palette (match the web prototype exactly):

| Token | Hex |
|---|---|
| Primary | #0d9488 (teal-600) |
| Primary dark | #0f766e (teal-700) |
| Background | #ffffff / #f8fafc (slate-50) |
| Text primary | #1e293b (slate-800) |
| Text secondary | #64748b (slate-500) |
| Text hint | #94a3b8 (slate-400) |
| Error | #f87171 / #fef2f2 (red-400 / red-50) |
| Warning | #d97706 / #fffbeb (amber-600 / amber-50) |
| Success | #22c55e / #dcfce7 (green-500 / green-100) |

Typography: Use the system font stack. Weights: 400 (body), 600 (semibold), 700 (bold), 800 (black).

- Cards: `rounded-2xl shadow-sm border border-slate-100`
- Buttons: `rounded-xl py-3.5 font-bold`
- Inputs: `rounded-xl border border-slate-200` with teal focus ring

---

## Folder Structure

The project is a monorepo with two packages: `mobile` and `server`, created at `~/projects/apotek/konsuldoc`.

```
~/projects/apotek/konsuldoc/
/mobile                        ← Expo React Native app
  /app
    _layout.tsx
    index.tsx                  ← Welcome
    consultation.tsx
    doctor-offer.tsx
    searching.tsx
    recommendations.tsx
    cart.tsx
    payment.tsx
    delivery.tsx
    confirmation.tsx
  /components
    MedicationCard.tsx
    SymptomChip.tsx
    CourierCard.tsx
    PatientSummary.tsx
    CategoryBadge.tsx
    BottomBar.tsx
    ProgressBar.tsx
  /store
    useAppStore.ts             ← Zustand store
  /data
    medications.ts             ← Migrated from medications.js
    couriers.ts
  /i18n
    index.ts
  /api
    client.ts                  ← Typed API client (calls the backend)
    orders.ts
    profiles.ts
  app.json
  package.json

/server                        ← Fastify API backend
  /src
    index.ts                   ← Server entry point
    /routes
      orders.ts
      profiles.ts
      medications.ts
    /db
      index.ts                 ← Drizzle client (swap DB here only)
      schema.ts                ← All Drizzle table definitions
      /migrations              ← Auto-generated by Drizzle Kit
    /services
      orderService.ts
      profileService.ts
    /types
      index.ts
  Dockerfile
  package.json
  drizzle.config.ts

/shared                        ← Shared TypeScript types and Zod schemas
  /types
    index.ts                   ← Medication, Order, CartItem, Courier etc.
  /schemas
    order.ts                   ← Zod schemas used by both client and server

docker-compose.yml             ← Local development (server + sqlite volume)
package.json                   ← Monorepo root (npm workspaces)
README.md
```

---

## State Management (Zustand)

Migrate `App.state` exactly to a Zustand store:

```typescript
interface AppState {
  lang: 'id' | 'en'
  patient: { age: string; weight: string; allergies: string[] }
  symptoms: string[]
  customSymptoms: string
  recommendations: Medication[]
  cart: CartItem[]
  selectedPayment: string | null
  paymentSubData: Record<string, string>
  deliveryAddress: string
  selectedDelivery: Courier | null
  orderNumber: string | null
  orderTime: Date | null
  profileLoadedFromStorage: boolean
}
```

---

## Database — Drizzle ORM

Use **Drizzle ORM** as the database abstraction layer. The goal is that swapping SQLite for PostgreSQL later requires changes only inside `/server/src/db/index.ts` — nothing else in the application changes.

### Why Drizzle

- TypeScript-native, no code generation step
- Identical query API for SQLite and PostgreSQL
- Drizzle Kit handles migrations for both backends
- Lightweight — no heavyweight ORM magic

### Database Client (`/server/src/db/index.ts`)

Structure the client so the database backend is swapped in one place:

```typescript
// SQLite (current)
import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import * as schema from './schema'

const sqlite = new Database(process.env.DB_PATH ?? './data/konsuldoc.db')
export const db = drizzle(sqlite, { schema })

// To migrate to PostgreSQL later, replace the above with:
// import { Pool } from 'pg'
// import { drizzle } from 'drizzle-orm/node-postgres'
// const pool = new Pool({ connectionString: process.env.DATABASE_URL })
// export const db = drizzle(pool, { schema })
//
// Nothing else in the codebase changes.
```

### Schema (`/server/src/db/schema.ts`)

Define these tables:

```typescript
// users / saved profiles
profiles {
  id, deviceId, ageYears, weightKg, allergies (JSON), lang, createdAt, updatedAt
}

// placed orders
orders {
  id, orderNumber, deviceId, totalAmount, paymentMethod,
  deliveryAddress, deliveryLat, deliveryLng, courierId,
  courierPrice, status, createdAt
}

// line items per order
order_items {
  id, orderId, medicationId, brand, price, quantity
}
```

### Migrations

Use `drizzle-kit` to generate and run migrations:

```bash
npx drizzle-kit generate   # generate migration files
npx drizzle-kit migrate    # apply migrations
```

Migrations run automatically on server startup in development. In production (Cloud Run), run them as part of the container startup script.

---

## Backend API — Fastify

### Endpoints

```
POST   /api/profiles          ← Save or update patient profile (keyed by deviceId)
GET    /api/profiles/:deviceId ← Load saved profile

POST   /api/orders            ← Place a new order
GET    /api/orders/:orderNumber ← Get order status

GET    /api/medications       ← Return full medication catalogue (for future CMS use)
```

### Request / Response Validation

Use **Zod** schemas defined in `/shared/schemas/` for all request bodies and responses. Import the same schemas in the mobile app for typed API calls. This ensures the mobile client and server always agree on data shapes.

### Environment Variables

```bash
PORT=8080
DB_PATH=./data/konsuldoc.db   # SQLite file path (mounted volume in Cloud Run)
GOOGLE_MAPS_API_KEY=          # Used server-side for geocoding if needed
NODE_ENV=production
```

---

## Containerization

### Core Principle

**One Dockerfile. One image. Two environments.**

The exact same container image runs locally via Docker Compose and deploys to Cloud Run. The only differences between environments are injected via environment variables and how the `/data` volume is mounted. The container itself is identical and has no knowledge of where it is running.

```
Local:      docker-compose mounts a named Docker volume  → /data/konsuldoc.db
Cloud Run:  GCS FUSE mounts a Cloud Storage bucket       → /data/konsuldoc.db

The container sees /data/konsuldoc.db in both cases. Nothing changes.
```

---

### Dockerfile (`/server/Dockerfile`)

Single multi-stage Dockerfile used by both docker-compose and Cloud Run:

```dockerfile
# ── Stage 1: Build ──────────────────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci --frozen-lockfile

COPY . .
RUN npm run build

# ── Stage 2: Production image ───────────────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app

# sqlite3 native dependency
RUN apk add --no-cache sqlite

# Copy only what is needed to run
COPY --from=builder /app/dist        ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# Create the data mount point
# Locally: Docker named volume is mounted here
# Cloud Run: GCS FUSE bucket is mounted here
RUN mkdir -p /data

# Entrypoint runs migrations then starts the server
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:8080/health || exit 1

ENTRYPOINT ["/entrypoint.sh"]
```

---

### Entrypoint Script (`/server/entrypoint.sh`)

Runs database migrations automatically on every startup, then starts the server. Safe to run on every deploy — Drizzle migrations are idempotent.

```bash
#!/bin/sh
set -e

echo "→ Running database migrations..."
node dist/db/migrate.js

echo "→ Starting Konsuldoc API server..."
exec node dist/index.js
```

---

### Migration Runner (`/server/src/db/migrate.ts`)

Standalone script called by the entrypoint. Compiles to `dist/db/migrate.js`:

```typescript
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import { db } from './index'
import path from 'path'

migrate(db, {
  migrationsFolder: path.join(__dirname, '../../migrations')
})

console.log('Migrations complete.')
process.exit(0)
```

---

### Health Check Endpoint

Cloud Run requires a health check to know when the container is ready. Add this route in Fastify:

```typescript
// /server/src/routes/health.ts
fastify.get('/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() }
})
```

Cloud Run will call `GET /health` every 30 seconds. If it returns non-200 three times in a row, the instance is replaced.

---

### Environment Variables

All configuration is via environment variables. The container has no hardcoded environment-specific values.

**`/server/.env.example`** (commit this, never commit `.env`):

```bash
# Server
PORT=8080
NODE_ENV=development

# Database
# SQLite: path to the database file on the mounted volume
DB_PATH=/data/konsuldoc.db
# PostgreSQL (future): uncomment and set when migrating
# DATABASE_URL=postgresql://user:password@host:5432/konsuldoc

# Google Maps (server-side geocoding)
GOOGLE_MAPS_API_KEY=your_key_here
```

---

### Local Development — Docker Compose (`/docker-compose.yml`)

Builds the **same Dockerfile** as production. No separate dev Dockerfile.

```yaml
services:
  server:
    build:
      context: ./server
      dockerfile: Dockerfile
    ports:
      - "8080:8080"
    env_file:
      - ./server/.env          # local env vars (gitignored)
    environment:
      - NODE_ENV=development
      - DB_PATH=/data/konsuldoc.db
    volumes:
      - sqlite_data:/data      # named volume persists the SQLite file between restarts
    restart: unless-stopped

volumes:
  sqlite_data:                 # Docker manages this volume on the host machine
```

Local workflow:

```bash
# First time setup
cp server/.env.example server/.env
# (fill in GOOGLE_MAPS_API_KEY in server/.env)

# Start
docker compose up --build

# View logs
docker compose logs -f server

# Stop
docker compose down

# Wipe database and start fresh
docker compose down -v
```

---

### Google Cloud Run — Deployment

#### One-time GCP Setup

Before first deploy, run these once:

```bash
# Set your project
gcloud config set project YOUR_PROJECT_ID

# Enable required APIs
gcloud services enable run.googleapis.com \
  containerregistry.googleapis.com \
  storage.googleapis.com

# Create the GCS bucket for SQLite persistence
# Use the same region as your Cloud Run service
gsutil mb -l asia-southeast1 gs://konsuldoc-sqlite-data

# Give Cloud Run permission to mount the bucket
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:YOUR_PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
  --role="roles/storage.objectAdmin"
```

#### Cloud Run Service Definition (`/cloud-run.yaml`)

```yaml
apiVersion: serving.knative.dev/v1
kind: Service
metadata:
  name: konsuldoc-api
  annotations:
    run.googleapis.com/launch-stage: BETA   # required for GCS volume mounts
spec:
  template:
    metadata:
      annotations:
        autoscaling.knative.dev/minScale: "1"     # keep warm — avoids cold start on first user request
        autoscaling.knative.dev/maxScale: "10"
        run.googleapis.com/execution-environment: gen2  # required for volume mounts
    spec:
      containers:
        - image: gcr.io/YOUR_PROJECT_ID/konsuldoc-api:latest
          ports:
            - containerPort: 8080
          env:
            - name: NODE_ENV
              value: production
            - name: DB_PATH
              value: /data/konsuldoc.db
            - name: GOOGLE_MAPS_API_KEY
              valueFrom:
                secretKeyRef:
                  name: google-maps-api-key   # store secrets in Secret Manager, not plain env
                  key: latest
          resources:
            limits:
              cpu: "1"
              memory: 512Mi
          volumeMounts:
            - name: sqlite-storage
              mountPath: /data
      volumes:
        - name: sqlite-storage
          csi:
            driver: gcsfuse.run.googleapis.com
            volumeAttributes:
              bucketName: konsuldoc-sqlite-data
```

#### Deploy Script (`/deploy.sh`)

```bash
#!/bin/bash
set -e

PROJECT_ID="your-gcp-project-id"
REGION="asia-southeast1"
IMAGE="gcr.io/$PROJECT_ID/konsuldoc-api"

echo "→ Building image..."
docker build -t "$IMAGE:latest" ./server

echo "→ Pushing to Container Registry..."
docker push "$IMAGE:latest"

echo "→ Deploying to Cloud Run..."
gcloud run services replace cloud-run.yaml \
  --region "$REGION" \
  --project "$PROJECT_ID"

echo "→ Making service public..."
gcloud run services add-iam-policy-binding konsuldoc-api \
  --region "$REGION" \
  --member="allUsers" \
  --role="roles/run.invoker"

echo ""
echo "✓ Deployed. Service URL:"
gcloud run services describe konsuldoc-api \
  --region "$REGION" \
  --format="value(status.url)"
```

Make it executable: `chmod +x deploy.sh`

Deploy with: `./deploy.sh`

#### Migrating from SQLite to PostgreSQL (when ready)

When you outgrow SQLite, the migration requires changes in exactly two places:

1. **`/server/src/db/index.ts`** — swap the Drizzle client (already shown in the Database section)
2. **`/cloud-run.yaml`** — remove the GCS volume mount, add `DATABASE_URL` env var pointing to Cloud SQL

Nothing in routes, services, or application logic changes. This is the entire point of the Drizzle abstraction layer.

---

## Important Constraints

- **Android + iOS** both supported
- **No web-only APIs** — no localStorage, no DOM, no window object
- **Safe area** handling on all screens (notch, home indicator)
- **Keyboard avoiding** on all screens with text inputs
- **Indonesian locale** for number formatting (Rp currency)
- **No Expo Go limitations** — use a development build if needed for maps
- Medical disclaimer must appear on recommendations screen
- "Obat keras" (prescription drugs) must never appear in recommendations

---

## Deliverables

### Mobile App
1. Complete Expo project under `/mobile`, all files production-ready
2. `package.json` with all dependencies pinned
3. `app.json` with correct Expo config
4. All screens fully implemented — no placeholder screens

### Backend
5. Complete Fastify API server under `/server`
6. Drizzle schema with all tables defined
7. Migration files generated and applied on startup via `entrypoint.sh`
8. All API endpoints implemented and validated with Zod
9. `GET /health` endpoint for Cloud Run health checks

### Infrastructure
10. `Dockerfile` — single multi-stage image used by both docker-compose and Cloud Run
11. `entrypoint.sh` — runs migrations then starts the server
12. `docker-compose.yml` — local development with persistent SQLite named volume, builds the same Dockerfile as production
13. `cloud-run.yaml` — Cloud Run service definition with GCS FUSE volume mount
14. `deploy.sh` — build, push, and deploy script targeting `asia-southeast1`
15. `server/.env.example` — all environment variables documented, clearly marked which are required vs optional

### Documentation
16. `README.md` covering:
    - Monorepo setup (`npm install` from root)
    - Local development: `docker compose up --build`
    - One-time GCP setup commands
    - How to deploy: `./deploy.sh`
    - How to add Google Maps API key to Secret Manager
    - How to migrate from SQLite to PostgreSQL when ready (two file changes)

---

Begin by reading all source files in `~/projects/apotek/app-prototype`, then create the complete project under `~/projects/apotek/konsuldoc`, file by file.
