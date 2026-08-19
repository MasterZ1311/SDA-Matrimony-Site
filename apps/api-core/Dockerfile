# Multi-Stage Production Dockerfile for @sda/api-core
FROM node:20-alpine AS builder

WORKDIR /app

# Install build essentials for native dependencies if needed
RUN apk add --no-cache python3 make g++

# Copy package manifests and configurations
COPY package*.json ./
COPY tsconfig.json ./
COPY packages/ ./packages/
COPY apps/api-core/ ./apps/api-core/

# Install dependencies and build shared packages & api-core
RUN npm ci
RUN npm run generate --workspace=@sda/database
RUN npm run build --workspace=@sda/database
RUN npm run build --workspace=@sda/api-core

# Runner stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV API_PORT=4000

# Install runtime dependencies for health checks & Prisma
RUN apk add --no-cache curl openssl

COPY package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps/api-core/dist ./apps/api-core/dist
COPY --from=builder /app/apps/api-core/package.json ./apps/api-core/package.json

EXPOSE 4000

HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:4000/api/v1/health || exit 1

CMD ["node", "apps/api-core/dist/main"]
