import type { FastifyInstance } from 'fastify';
import { prisma } from '../db/client.js';
import { requireUser } from '../utils/auth.js';

export async function registerSearchRoutes(app: FastifyInstance) {
  app.get('/search', { preHandler: requireUser }, async (req) => {
    const q = (req.query as { q?: string }).q?.trim() || '';
    const userId = req.userId!;
    if (!q) return { items: [], containers: [] };
    const items = await prisma.item.findMany({
      where: {
        userId,
        OR: [
          { title: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } }
        ]
      },
      take: 20
    });
    const containers = await prisma.container.findMany({
      where: {
        userId,
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { type: { contains: q, mode: 'insensitive' } }
        ]
      },
      take: 20
    });
    return { items, containers };
  });
}


