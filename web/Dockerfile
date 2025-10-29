# Image Web Next.js - placeholder jusqu'à l'implémentation
FROM node:20-alpine AS base
WORKDIR /app

# Dépendances
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN if [ -f package-lock.json ]; then npm ci; \
    elif [ -f yarn.lock ]; then corepack enable && yarn install --frozen-lockfile; \
    elif [ -f pnpm-lock.yaml ]; then corepack enable && pnpm install --frozen-lockfile; \
    else npm install; fi

# Copie du code
COPY . .

# Build de l'app Next pour le démarrage en prod
RUN npm run build

# Port Web
EXPOSE 3000

# Commande par défaut
CMD ["npm", "run", "start"]


