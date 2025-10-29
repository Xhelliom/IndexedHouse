import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../db/client.js';
import { requireUser } from '../utils/auth.js';

const CreateRoom = z.object({ name: z.string().min(1) });
const UpdateRoom = z.object({ name: z.string().min(1) });

export async function registerRoomRoutes(app: FastifyInstance) {
  app.get('/rooms', { preHandler: requireUser }, async (req) => {
    const userId = req.userId!;
    return prisma.room.findMany({ where: { userId } });
  });

  app.post('/rooms', { preHandler: requireUser }, async (req, reply) => {
    const parsed = CreateRoom.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: parsed.error.flatten() });
    const userId = req.userId!;
    const room = await prisma.room.create({ data: { name: parsed.data.name, userId } });
    return room;
  });

  app.patch('/rooms/:id', { preHandler: requireUser }, async (req, reply) => {
    const parsed = UpdateRoom.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: parsed.error.flatten() });
    const userId = req.userId!;
    const id = (req.params as { id: string }).id;
    const updated = await prisma.room.update({ where: { id }, data: { name: parsed.data.name } });
    if (updated.userId !== userId) return reply.code(403).send({ error: 'Forbidden' });
    return updated;
  });

  app.delete('/rooms/:id', { preHandler: requireUser }, async (req, reply) => {
    const userId = req.userId!;
    const id = (req.params as { id: string }).id;
    const room = await prisma.room.findUnique({ where: { id } });
    if (!room || room.userId !== userId) return reply.code(404).send({ error: 'Not found' });
    await prisma.room.delete({ where: { id } });
    return { ok: true };
  });
}


