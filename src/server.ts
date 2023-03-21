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

// register all files in 'routes' folder
const routesRoot = path.resolve(path.join(__dirname, 'routes'));
fs.readdirSync(routesRoot).forEach((file) => {
  const name = file.replace(/.(js|ts)/, '');
  console.log(`--> added '/${name}' route`);
  const router = require('./routes/' + file);
  app.register(router, { prefix: `/${name}`, prisma });
});

const host = process.env.HOST || '0.0.0.0';
const port = +(process.env.PORT || 3333);

console.log(`listening at http://${host}:${port}/...`);

app.listen({ host, port });
