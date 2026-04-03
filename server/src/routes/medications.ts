import type { FastifyInstance } from 'fastify';

export async function medicationRoutes(fastify: FastifyInstance) {
  fastify.get('/api/medications', async () => {
    return {
      message: 'Medication catalogue endpoint - for future CMS use',
    };
  });
}
