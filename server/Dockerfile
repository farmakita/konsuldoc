# Stage 1: Builder
# Build context is the repo root (set in docker-compose.yml)
FROM node:22-alpine AS builder

# Proxy build args (works with or without proxy)
ARG HTTP_PROXY
ARG HTTPS_PROXY
ARG NO_PROXY
ARG http_proxy
ARG https_proxy
ARG no_proxy

ENV HTTP_PROXY=${HTTP_PROXY} \
    HTTPS_PROXY=${HTTPS_PROXY} \
    NO_PROXY=${NO_PROXY} \
    http_proxy=${http_proxy} \
    https_proxy=${https_proxy} \
    no_proxy=${no_proxy}

WORKDIR /app

# Use HTTP repos to avoid proxy TLS issues with Alpine package manager
RUN echo "http://dl-cdn.alpinelinux.org/alpine/v3.21/main" > /etc/apk/repositories && \
    echo "http://dl-cdn.alpinelinux.org/alpine/v3.21/community" >> /etc/apk/repositories

# Configure npm for proxy if present
RUN if [ -n "$HTTP_PROXY" ]; then \
        npm config set proxy $HTTP_PROXY && \
        npm config set https-proxy $HTTPS_PROXY && \
        npm config set strict-ssl false; \
    fi

# Copy shared types (dependency for @konsuldoc/shared)
COPY shared ./shared

# Copy server package files and install
COPY server/package.json ./
RUN if [ -n "$HTTP_PROXY" ]; then \
        NODE_TLS_REJECT_UNAUTHORIZED=0 npm install; \
    else \
        npm install; \
    fi

# Copy server source
COPY server/tsconfig.json ./
COPY server/drizzle.config.ts ./
COPY server/src ./src

RUN if [ -n "$HTTP_PROXY" ]; then \
        NODE_TLS_REJECT_UNAUTHORIZED=0 npm run build; \
    else \
        npm run build; \
    fi

# Stage 2: Runner
FROM node:22-alpine

WORKDIR /app

# Use HTTP repos to avoid proxy TLS issues
RUN echo "http://dl-cdn.alpinelinux.org/alpine/v3.21/main" > /etc/apk/repositories && \
    echo "http://dl-cdn.alpinelinux.org/alpine/v3.21/community" >> /etc/apk/repositories

RUN apk add --no-cache sqlite

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/shared ./shared
COPY --from=builder /app/src/db/migrations ./src/db/migrations

RUN mkdir -p /data

COPY server/entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -Y off --no-verbose --tries=1 --spider http://127.0.0.1:8080/health || exit 1

ENTRYPOINT ["./entrypoint.sh"]
