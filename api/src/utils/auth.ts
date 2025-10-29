import type { FastifyReply, FastifyRequest } from 'fastify';
import { jwtVerify } from 'jose';

declare module 'fastify' {
  interface FastifyRequest {
    userId?: string;
  }
}

const cookieName = 'sid';

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 10) throw new Error('JWT_SECRET manquant');
  return new TextEncoder().encode(secret);
}

export async function requireUser(req: FastifyRequest, reply: FastifyReply) {
  const token = req.cookies?.[cookieName];
  if (!token) return reply.code(401).send({ error: 'Non authentifié' });
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    req.userId = payload.sub as string;
  } catch {
    return reply.code(401).send({ error: 'Session invalide' });
  }
}


