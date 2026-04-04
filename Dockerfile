# uLern-Polish — Express Backend Dockerfile
# Deploy to RunPod (Docker container)

FROM node:20-alpine

WORKDIR /app

# Install dependencies first (layer cache optimization)
COPY package*.json ./

RUN npm ci --omit=dev --legacy-peer-deps

# Copy source (server.js only — no local lib deps)
COPY server.js ./

# Environment variables (set via RunPod secrets/env vars — see DEPLOY.md)
ENV PORT=5000
ENV NODE_ENV=production
ENV CORS_ORIGIN=https://YOUR_VERCEL_APP.vercel.app

EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:5000/api/health || exit 1

# Start Express server
CMD ["node", "server.js"]
