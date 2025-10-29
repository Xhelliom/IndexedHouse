import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { requireUser } from '../utils/auth.js';
import { visionQueue } from '../queue/index.js';

const DescribeSchema = z.object({ photoId: z.string(), subjectType: z.enum(['item', 'container']).optional() });

export async function registerAiRoutes(app: FastifyInstance) {
  app.post('/ai/describe', { preHandler: requireUser }, async (req, reply) => {
    const parsed = DescribeSchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: parsed.error.flatten() });
    const job = await visionQueue.add('describe', parsed.data);
    return { jobId: job.id };
  });

  app.get('/ai/result/:jobId', { preHandler: requireUser }, async (req) => {
    const jobId = (req.params as { jobId: string }).jobId;
    const job = await visionQueue.getJob(jobId);
    if (!job) return { status: 'not_found' };
    const state = await job.getState();
    const result = (state === 'completed') ? await job.returnvalue : undefined;
    return { status: state, result };
  });
}


