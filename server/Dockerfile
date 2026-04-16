# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY server/package.json server/pnpm-lock.yaml* ./

# Install dependencies
RUN corepack enable && pnpm install --frozen-lockfile

# Copy source code
COPY server/src ./src
COPY server/tsconfig.json .

# Build the application
RUN pnpm run build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodeapp

# Copy built files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json .

# Copy .env file (should be set via env vars in production)
COPY server/.env.example ./.env.example

# Switch to non-root user
USER nodeapp

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api/users/me || exit 1

# Start the server
CMD ["pnpm", "run", "start"]