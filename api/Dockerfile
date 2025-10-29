# Image API Node.js (Fastify) - placeholder jusqu'à l'implémentation
FROM node:20-alpine AS base
WORKDIR /app

# Installation des dépendances
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN if [ -f package-lock.json ]; then npm ci; \
    elif [ -f yarn.lock ]; then corepack enable && yarn install --frozen-lockfile; \
    elif [ -f pnpm-lock.yaml ]; then corepack enable && pnpm install --frozen-lockfile; \
    else npm install; fi

# Copie du code et build
COPY prisma ./prisma
COPY tsconfig.json ./
COPY src ./src
RUN npx prisma generate && npm run build

# Port API
EXPOSE 4000

# Démarrage (applique les migrations avant de lancer l'API)
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]


