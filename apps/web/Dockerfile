# Multi-Stage Production Dockerfile for @sda/web (Next.js)
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
COPY packages/ ./packages/
COPY apps/web/ ./apps/web/

RUN npm ci
RUN npm run build --workspace=@sda/web

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

RUN apk add --no-cache curl

COPY package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/web/.next ./apps/web/.next
COPY --from=builder /app/apps/web/package.json ./apps/web/package.json
COPY --from=builder /app/apps/web/next.config.mjs ./apps/web/next.config.mjs
COPY --from=builder /app/packages ./packages

EXPOSE 3000

HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3000 || exit 1

CMD ["npm", "run", "start", "--workspace=@sda/web"]
