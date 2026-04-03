import type { FastifyInstance } from 'fastify';
import { profileSchema } from '../../shared/schemas/order.js';
import { upsertProfile, getProfile } from '../services/profileService.js';

export async function profileRoutes(fastify: FastifyInstance) {
  fastify.post('/api/profiles', async (request, reply) => {
    try {
      const parsed = profileSchema.parse(request.body);
      const profile = await upsertProfile(parsed);
      return reply.status(200).send(profile);
    } catch (error) {
      if (error instanceof Error && error.name === 'ZodError') {
        return reply.status(400).send({ error: 'Validation failed', details: error });
      }
      throw error;
    }
  });

  fastify.get<{ Params: { deviceId: string } }>(
    '/api/profiles/:deviceId',
    async (request, reply) => {
      const { deviceId } = request.params;
      const profile = await getProfile(deviceId);

      if (!profile) {
        return reply.status(404).send({ error: 'Profile not found' });
      }

      return reply.status(200).send(profile);
    }
  );
}
