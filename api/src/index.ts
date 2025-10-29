import { createServer } from './server.js';

// Démarre le serveur Fastify
const start = async () => {
  const port = Number(process.env.PORT || 4000);
  const host = '0.0.0.0';
  const app = await createServer();
  try {
    await app.listen({ port, host });
    app.log.info({ port }, 'API démarrée');
  } catch (err) {
    app.log.error(err, 'Erreur au démarrage');
    process.exit(1);
  }
};

void start();


