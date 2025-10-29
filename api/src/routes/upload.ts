import type { FastifyInstance } from 'fastify';
import multipart from '@fastify/multipart';
import { requireUser } from '../utils/auth.js';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3, S3_BUCKET } from '../utils/s3.js';
import sharp from 'sharp';
import { prisma } from '../db/client.js';

export async function registerUploadRoutes(app: FastifyInstance) {
  await app.register(multipart, { attachFieldsToBody: true, limits: { fileSize: 20 * 1024 * 1024 } });

  app.post('/upload', { preHandler: requireUser }, async (req, reply) => {
    // Le champ de fichier doit s'appeler "file" côté client
    const file = (req.body as any)?.file;
    if (!file || typeof file !== 'object' || !('toBuffer' in file)) {
      return reply.code(400).send({ error: 'Fichier manquant' });
    }

    const userId = req.userId!;
    const buffer: Buffer = await (file as any).toBuffer();
    const mime: string = (file as any).mimetype || 'application/octet-stream';

    // Clés S3 organisées par utilisateur
    const baseKey = `${userId}/raw/${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const key = `${baseKey}`;

    // Upload original
    await s3.send(new PutObjectCommand({ Bucket: S3_BUCKET, Key: key, Body: buffer, ContentType: mime }));

    // Génération thumbnail
    const thumbBuf = await sharp(buffer).resize(512).jpeg({ quality: 80 }).toBuffer();
    const thumbnailKey = `${userId}/thumb/${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;
    await s3.send(new PutObjectCommand({ Bucket: S3_BUCKET, Key: thumbnailKey, Body: thumbBuf, ContentType: 'image/jpeg' }));

    // Enregistrement en BDD
    const photo = await prisma.photo.create({
      data: { userId, s3Key: key, thumbnailKey }
    });

    return { photo };
  });
}


