# Stage 1: Install dependencies
FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci

# Stage 2: Build the production application
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# Stage 3: Runner
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy built bundles, static assets, and database configurations
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

EXPOSE 3005
CMD ["npx", "next", "start", "-p", "3005"]
