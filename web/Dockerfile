# Image Web Next.js - placeholder jusqu'à l'implémentation
FROM node:20-alpine AS base
WORKDIR /app

# Dépendances (placeholder: à compléter lors du scaffold frontend)
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN npm -v >/dev/null 2>&1 || true

# Copie du code (sera remplacé lors de l'implémentation)
COPY . .

# Port Web
EXPOSE 3000

# Commande par défaut (garde le conteneur vivant tant que le web n'est pas prêt)
CMD ["sh", "-c", "npm run start || (echo 'Web non encore construit, en attente...' && tail -f /dev/null)"]


