import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { prisma } from '../db/client.js';
import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

const LoginSchema = RegisterSchema;

const cookieName = 'sid';

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 10) throw new Error('JWT_SECRET manquant');
  return new TextEncoder().encode(secret);
}

async function createSession(userId: string) {
  const token = await new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getJwtSecret());
  return token;
}

async function verifySession(token: string) {
  const { payload } = await jwtVerify(token, getJwtSecret());
  return payload.sub as string;
}

export async function registerAuthRoutes(app: FastifyInstance) {
  // Cookies httpOnly pour stocker le JWT côté client de façon sécurisée
  app.addHook('onRequest', async (req, _res) => {
    // Hook placeholder si besoin d'ajouter du contexte
    return;
  });

  app.post('/auth/register', async (req: FastifyRequest, reply: FastifyReply) => {
    const parsed = RegisterSchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: parsed.error.flatten() });
    const { email, password } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return reply.code(409).send({ error: 'Email déjà utilisé' });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { email, passwordHash } });
    const token = await createSession(user.id);

    reply
      .setCookie(cookieName, token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
        path: '/'
      })
      .send({ id: user.id, email: user.email });
  });

  app.post('/auth/login', async (req: FastifyRequest, reply: FastifyReply) => {
    const parsed = LoginSchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: parsed.error.flatten() });
    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return reply.code(401).send({ error: 'Identifiants invalides' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return reply.code(401).send({ error: 'Identifiants invalides' });

    const token = await createSession(user.id);
    reply
      .setCookie(cookieName, token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
        path: '/'
      })
      .send({ id: user.id, email: user.email });
  });

  app.post('/auth/logout', async (_req, reply) => {
    reply.clearCookie(cookieName, { path: '/' }).send({ ok: true });
  });

  app.get('/auth/me', async (req, reply) => {
    const token = req.cookies?.[cookieName];
    if (!token) return reply.code(401).send({ error: 'Non authentifié' });
    try {
      const userId = await verifySession(token);
      const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, email: true } });
      if (!user) return reply.code(401).send({ error: 'Session invalide' });
      return user;
    } catch {
      return reply.code(401).send({ error: 'Session invalide' });
    }
  });
}


