import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../db/client.js';
import { requireUser } from '../utils/auth.js';

const CreateItem = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  quantity: z.number().int().positive().default(1),
  barcode: z.string().optional(),
  primaryContainerId: z.string().optional(),
  roomId: z.string().optional()
});

const UpdateItem = CreateItem.partial();

export async function registerItemRoutes(app: FastifyInstance) {
  app.get('/items', { preHandler: requireUser }, async (req) => {
    const userId = req.userId!;
    return prisma.item.findMany({ where: { userId } });
  });

  app.post('/items', { preHandler: requireUser }, async (req, reply) => {
    const parsed = CreateItem.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: parsed.error.flatten() });
    const userId = req.userId!;
    return prisma.item.create({ data: { ...parsed.data, userId } });
  });

  app.get('/items/:id', { preHandler: requireUser }, async (req, reply) => {
    const id = (req.params as { id: string }).id;
    const userId = req.userId!;
    const found = await prisma.item.findUnique({ where: { id } });
    if (!found || found.userId !== userId) return reply.code(404).send({ error: 'Not found' });
    return found;
  });

  app.patch('/items/:id', { preHandler: requireUser }, async (req, reply) => {
    const id = (req.params as { id: string }).id;
    const userId = req.userId!;
    const parsed = UpdateItem.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: parsed.error.flatten() });
    const found = await prisma.item.findUnique({ where: { id } });
    if (!found || found.userId !== userId) return reply.code(404).send({ error: 'Not found' });
    return prisma.item.update({ where: { id }, data: parsed.data });
  });

  app.delete('/items/:id', { preHandler: requireUser }, async (req, reply) => {
    const id = (req.params as { id: string }).id;
    const userId = req.userId!;
    const found = await prisma.item.findUnique({ where: { id } });
    if (!found || found.userId !== userId) return reply.code(404).send({ error: 'Not found' });
    await prisma.item.delete({ where: { id } });
    return { ok: true };
  });
}


