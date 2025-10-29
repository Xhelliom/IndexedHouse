import { Queue } from 'bullmq';

const connection = { connection: { url: process.env.REDIS_URL || 'redis://redis:6379' } } as const;

export const visionQueue = new Queue('vision.describe', connection);


