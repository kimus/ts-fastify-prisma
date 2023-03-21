import { FastifyPluginCallback } from 'fastify';
import { PrismaClient } from '@prisma/client';

const LogRouter: FastifyPluginCallback<{ prisma: PrismaClient }> = (
  app,
  opts,
  done
) => {
  //const prisma = opts.prisma;

  app.get('/', async (request, reply) => {
    console.log(request.body);
    return reply.status(200).send({ ack: 1 });
  });

  app.post('/', async (request, reply) => {
    console.log(request.body);
    return reply.status(200).send({ ack: 1 });
  });

  done();
};

export default LogRouter;
