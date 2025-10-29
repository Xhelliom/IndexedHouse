import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import { env } from './utils/env.js';
import cookie from '@fastify/cookie';
import { registerAuthRoutes } from './routes/auth.js';
import { registerRoomRoutes } from './routes/rooms.js';
import { registerContainerRoutes } from './routes/containers.js';
import { registerItemRoutes } from './routes/items.js';
import { registerUploadRoutes } from './routes/upload.js';
import { registerAiRoutes } from './routes/ai.js';
import { registerSearchRoutes } from './routes/search.js';

export async function createServer() {
  // Logger JSON lisible par pino-pretty en dev
  const app = Fastify({ logger: true });

  // Sécurité basique + CORS pour le domaine frontend
  void app.register(helmet);
  void app.register(cookie, {
    // clé de signature optionnelle si besoin de cookies signés
  });
  void app.register(cors, {
    origin: (origin, cb) => {
      // Autorise localhost et NEXT_PUBLIC_API_URL si présent
      const allowed = [
        'http://localhost',
        'http://localhost:3000',
        process.env.NEXT_PUBLIC_API_URL ?? ''
      ].filter(Boolean);
      if (!origin || allowed.some((a) => origin.startsWith(a))) cb(null, true);
      else cb(new Error('CORS non autorisé'), false);
    },
    credentials: true
  });

  // Healthcheck
  app.get('/healthz', async () => ({ status: 'ok' }));

  // Préfixe des routes API
  app.get('/', async () => ({ name: 'inventory-api', version: '0.1.0' }));

  // Routes Auth
  await registerAuthRoutes(app);
  await registerRoomRoutes(app);
  await registerContainerRoutes(app);
  await registerItemRoutes(app);
  await registerUploadRoutes(app);
  await registerAiRoutes(app);
  await registerSearchRoutes(app);

  return app;
}


