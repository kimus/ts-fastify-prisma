import { PrismaClient } from '@prisma/client';
import fastify from 'fastify';
import { UsersRouter } from './routes/user';

const app = fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
});

const prisma = new PrismaClient();

app.register(UsersRouter, { prefix: '/users', prisma });

app.listen({ host: '0.0.0.0', port: +(process.env.port || 3333) });
