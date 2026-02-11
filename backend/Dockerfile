# Backend Dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
RUN npm install

# Development image - run with ts-node
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=development

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 appuser

# Copy dependencies and source
COPY --from=deps /app/node_modules ./node_modules
COPY . .

USER appuser

EXPOSE 3001

CMD ["npm", "run", "dev"]
