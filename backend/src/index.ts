import express from 'express';
import os from 'os';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { errorHandler } from './middleware/error';
import { logger } from './middleware/logger';

// Minimal placeholder backend — keeps health endpoint for CI/infra
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '7d';

function signToken(payload: object): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES as any });
}

// Minimal auth endpoint to support name-based login for the demo UI
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, login, password } = req.body as { email?: string; login?: string; password?: string };
    const loginValue = login || email;
    if (!loginValue || !password) return res.status(400).json({ error: 'Missing credentials' });

    let user;
    if (loginValue.includes('@')) {
      user = await prisma.user.findUnique({ where: { email: loginValue } });
    } else {
      user = await prisma.user.findFirst({ where: { name: loginValue } });
    }

    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = signToken({ userId: user.id, email: user.email, role: user.role });
    res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role }, token });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    instance: os.hostname(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || 'placeholder',
  });
});

// Basic root so nginx/nginx-proxy health checks have something
app.get('/', (_req, res) => {
  res.send('Placeholder backend service');
});

// 404 and error handling
app.use((_req, res) => res.status(404).json({ error: 'Not found' }));
app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    logger.info(`Placeholder backend running on port ${PORT} | Instance: ${os.hostname()}`);
  });
}

export default app;
