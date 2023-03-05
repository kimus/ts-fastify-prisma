import { PrismaClient } from '@prisma/client';
import fastify from 'fastify';
import fs from 'fs';
import path from 'path';

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

// app.register(UsersRouter, { prefix: '/users', prisma });

const routesRoot = path.resolve(path.join(__dirname, 'routes'));
fs.readdirSync(routesRoot).forEach((file) => {
  if (file !== 'index.js') {
    var name = file.replace(/.(js|ts)/, '');
    console.log(`--> added '/${name}' route`);
    const router = require('./routes/' + file);
    app.register(router, { prefix: `/${name}`, prisma });
  }
});

app.listen({ host: '0.0.0.0', port: +(process.env.port || 3333) });
