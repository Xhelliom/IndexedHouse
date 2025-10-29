import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../db/client.js';
import { requireUser } from '../utils/auth.js';

const CreateContainer = z.object({
  name: z.string().min(1),
  type: z.string().min(1),
  roomId: z.string().optional(),
  parentContainerId: z.string().optional()
});

const UpdateContainer = CreateContainer.partial();

export async function registerContainerRoutes(app: FastifyInstance) {
  app.get('/containers', { preHandler: requireUser }, async (req) => {
    const userId = req.userId!;
    return prisma.container.findMany({ where: { userId } });
  });

  app.post('/containers', { preHandler: requireUser }, async (req, reply) => {
    const parsed = CreateContainer.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: parsed.error.flatten() });
    const userId = req.userId!;
    return prisma.container.create({ data: { ...parsed.data, userId } });
  });

  app.get('/containers/:id', { preHandler: requireUser }, async (req, reply) => {
    const id = (req.params as { id: string }).id;
    const userId = req.userId!;
    const found = await prisma.container.findUnique({ where: { id } });
    if (!found || found.userId !== userId) return reply.code(404).send({ error: 'Not found' });
    return found;
  });

  app.patch('/containers/:id', { preHandler: requireUser }, async (req, reply) => {
    const id = (req.params as { id: string }).id;
    const userId = req.userId!;
    const parsed = UpdateContainer.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: parsed.error.flatten() });
    const found = await prisma.container.findUnique({ where: { id } });
    if (!found || found.userId !== userId) return reply.code(404).send({ error: 'Not found' });
    return prisma.container.update({ where: { id }, data: parsed.data });
  });

  app.delete('/containers/:id', { preHandler: requireUser }, async (req, reply) => {
    const id = (req.params as { id: string }).id;
    const userId = req.userId!;
    const found = await prisma.container.findUnique({ where: { id } });
    if (!found || found.userId !== userId) return reply.code(404).send({ error: 'Not found' });
    await prisma.container.delete({ where: { id } });
    return { ok: true };
  });
}


