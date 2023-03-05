import { z, ZodError } from 'zod';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { FastifyPluginCallback } from 'fastify';
import { PrismaClient } from '@prisma/client';

export const UsersRouter: FastifyPluginCallback<{ prisma: PrismaClient }> = (
  app,
  opts,
  done
) => {
  const prisma = opts.prisma;
  app.get('/', async () => {
    const users = await prisma.user.findMany();
    return { users };
  });

  app.post('/', async (request, reply) => {
    const createUserSchema = z.object({
      name: z.string(),
      email: z.string().email(),
    });

    try {
      const { name, email } = createUserSchema.parse(request.body);
      await prisma.user.create({ data: { name, email } });
      return reply.status(201).send();
    } catch (error: any) {
      if (error instanceof ZodError) {
        const err = error as ZodError;
        return reply.status(400).send({
          message: 'Validation Error',
          errors: err.errors,
        });
      }

      if ((error as any).clientVersion !== undefined) {
        const err = error as PrismaClientKnownRequestError;
        return reply.status(400).send({
          message: 'Database Error',
          errors: [
            {
              code: err.code,
              message: err.message,
              path: [err.meta?.target],
            },
          ],
        });
      }

      console.log(error);
      return reply
        .status(500)
        .send({ message: 'Internal Server Error', error: error.message });
    }
  });

  app.get('//:id', async (request) => {
    const { id } = request.params as { id: string };
    const user = await prisma.user.findUnique({ where: { id } });
    return user;
  });

  app.put('//:id', async (request, reply) => {
    const createUserSchema = z.object({
      name: z.string(),
    });
    const { id } = request.params as { id: string };
    const { name } = createUserSchema.parse(request.body);
    const updated = await prisma.user.update({ where: { id }, data: { name } });
    return reply.status(201).send(updated);
  });

  done();
};
