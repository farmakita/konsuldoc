.PHONY: help setup build up down restart logs \
       server server-logs server-shell \
       mobile mobile-logs mobile-shell \
       mobile-web \
       db-reset db-shell \
       deploy clean

# ──────────────────────────────────────────────────────────────
#  Konsuldoc — fully containerised development
#  Nothing runs on the host OS. Everything runs in Docker.
# ──────────────────────────────────────────────────────────────

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

# ── First-time setup ─────────────────────────────────────────

setup: ## First-time setup: copy env template
	@test -f server/.env || cp server/.env.example server/.env
	@echo "Created server/.env — edit it to add your GOOGLE_MAPS_API_KEY"

# ── Build ────────────────────────────────────────────────────

build: setup ## Build all Docker images
	docker compose build

# ── Full stack ───────────────────────────────────────────────

up: build ## Start all services (server + mobile dev)
	docker compose up -d

down: ## Stop all services
	docker compose down

restart: build ## Restart all services
	docker compose down
	docker compose up -d

logs: ## Tail logs for all services
	docker compose logs -f

# ── Server ───────────────────────────────────────────────────

server: build ## Start server only
	docker compose up -d server

server-logs: ## Tail server logs
	docker compose logs -f server

server-shell: ## Open a shell inside the running server container
	docker compose exec server /bin/sh

# ── Mobile (Expo dev server — web mode) ──────────────────────

mobile: build ## Start mobile dev server (Expo web on :8081)
	docker compose up -d mobile-dev

mobile-logs: ## Tail mobile dev server logs
	docker compose logs -f mobile-dev

mobile-shell: ## Open a shell inside the running mobile container
	docker compose exec mobile-dev /bin/sh

# ── Mobile (static web build) ───────────────────────────────

mobile-web: build ## Build and serve mobile as static web app on :3000
	docker compose up -d mobile-web

# ── Database ─────────────────────────────────────────────────

db-reset: build ## Wipe the SQLite database and start fresh
	docker compose down -v
	docker compose up -d server

db-shell: ## Open SQLite CLI inside the server container
	docker compose exec server sqlite3 /data/konsuldoc.db

# ── Production deploy ────────────────────────────────────────

deploy: build ## Build, push, and deploy to Google Cloud Run
	./deploy.sh

# ── Cleanup ──────────────────────────────────────────────────

clean: ## Stop all services, remove volumes and images
	docker compose down -v --rmi local
