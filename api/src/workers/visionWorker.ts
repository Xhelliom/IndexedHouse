import { Worker } from 'bullmq';
import { prisma } from '../db/client.js';
import { describeImage } from '../workers/vision_providers/openaiVision.js';

type JobData = { photoId: string; subjectType?: 'item' | 'container' };

const connection = { connection: { url: process.env.REDIS_URL || 'redis://redis:6379' } } as const;

export const worker = new Worker<JobData>(
  'vision.describe',
  async (job) => {
    const { photoId, subjectType } = job.data;
    const photo = await prisma.photo.findUnique({ where: { id: photoId } });
    if (!photo) return;

    // Récupère une URL presignée plus tard; pour l'instant, passer la clé brute
    const result = await describeImage({ s3Key: photo.s3Key, subjectType });

    // Stocker suggestions côté item/container ultérieurement; ici on enregistre en description Photo
    await prisma.photo.update({ where: { id: photoId }, data: { subjectType } });
    return result;
  },
  connection
);


