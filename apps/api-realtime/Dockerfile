# Multi-Stage Production Dockerfile for @sda/api-realtime
FROM node:20-alpine AS builder

WORKDIR /app

# Install build essentials
RUN apk add --no-cache python3 make g++

# Copy package manifests and configurations
COPY package*.json ./
COPY tsconfig.json ./
COPY packages/ ./packages/
COPY apps/api-realtime/ ./apps/api-realtime/

# Install dependencies and build shared packages & api-realtime
RUN npm ci
RUN npm run generate --workspace=@sda/database
RUN npm run build --workspace=@sda/database
RUN npm run build --workspace=@sda/api-realtime

# Runner stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV WS_PORT=4001

# Install runtime dependencies for Prisma & health checks
RUN apk add --no-cache curl openssl

COPY package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps/api-realtime/dist ./apps/api-realtime/dist
COPY --from=builder /app/apps/api-realtime/package.json ./apps/api-realtime/package.json

EXPOSE 4001

HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:4001/health || exit 1

CMD ["node", "apps/api-realtime/dist/main"]
