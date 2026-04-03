import Fastify from 'fastify';
import cors from '@fastify/cors';
import { healthRoutes } from './routes/health.js';
import { profileRoutes } from './routes/profiles.js';
import { orderRoutes } from './routes/orders.js';
import { medicationRoutes } from './routes/medications.js';

const fastify = Fastify({ logger: true });

async function start() {
  await fastify.register(cors, { origin: true });

  await fastify.register(healthRoutes);
  await fastify.register(profileRoutes);
  await fastify.register(orderRoutes);
  await fastify.register(medicationRoutes);

  const port = Number(process.env.PORT) || 8080;

  try {
    await fastify.listen({ port, host: '0.0.0.0' });
    fastify.log.info(`Konsuldoc API server listening on port ${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();
