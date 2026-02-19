# ============================================================================
# Protocol Zero - Production Dockerfile (Render / Docker deployments)
# ============================================================================
# This image includes git + npm so the Self-Healing sandbox can:
#   1. Clone repositories into /tmp/self-healing/
#   2. Run npm install inside cloned repos
#   3. Execute test suites (npm test, pytest, etc.)
#   4. Push fixes back via git
# ============================================================================

# ── Stage 1: Install dependencies ──────────────────────────────────────────
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN \
  if [ -f package-lock.json ]; then npm ci --ignore-scripts; \
  else npm install --ignore-scripts; \
  fi

# ── Stage 2: Build the Next.js app ────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set standalone output for smaller image
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PRIVATE_STANDALONE=true

# Build (validate-env runs as part of build script)
RUN npm run build

# ── Stage 3: Production runner ─────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# ┌─────────────────────────────────────────────────────────────┐
# │  CRITICAL: Install git + Python for Self-Healing sandbox    │
# │  Without these, the sandbox cannot clone repos or run tests │
# └─────────────────────────────────────────────────────────────┘
RUN apk add --no-cache \
  git \
  python3 \
  py3-pip \
  openssh-client \
  curl \
  && git config --global user.email "ai-agent@protocol-zero.dev" \
  && git config --global user.name "Protocol Zero AI Agent" \
  && git config --global init.defaultBranch main

# Create sandbox directory with proper permissions
RUN mkdir -p /tmp/self-healing && chmod 777 /tmp/self-healing

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built app
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Give nextjs user access to tmp
RUN chown -R nextjs:nodejs /tmp/self-healing

USER nextjs

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

CMD ["node", "server.js"]
