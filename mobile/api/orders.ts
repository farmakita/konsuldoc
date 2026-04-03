import { api } from './client';
import { CreateOrderInput, OrderResponse } from '../../shared/schemas/order';

export async function createOrder(input: CreateOrderInput): Promise<OrderResponse> {
  return api.post<OrderResponse>('/api/orders', input);
}

export async function getOrder(orderNumber: string): Promise<OrderResponse> {
  return api.get<OrderResponse>(`/api/orders/${orderNumber}`);
}
