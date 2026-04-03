import type { FastifyInstance } from 'fastify';
import { createOrderSchema } from '../../shared/schemas/order.js';
import { createOrder, getOrder } from '../services/orderService.js';

export async function orderRoutes(fastify: FastifyInstance) {
  fastify.post('/api/orders', async (request, reply) => {
    try {
      const parsed = createOrderSchema.parse(request.body);
      const order = await createOrder(parsed);
      return reply.status(201).send(order);
    } catch (error) {
      if (error instanceof Error && error.name === 'ZodError') {
        return reply.status(400).send({ error: 'Validation failed', details: error });
      }
      throw error;
    }
  });

  fastify.get<{ Params: { orderNumber: string } }>(
    '/api/orders/:orderNumber',
    async (request, reply) => {
      const { orderNumber } = request.params;
      const order = await getOrder(orderNumber);

      if (!order) {
        return reply.status(404).send({ error: 'Order not found' });
      }

      return reply.status(200).send(order);
    }
  );
}
