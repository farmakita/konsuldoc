import { z } from 'zod';

export const orderItemSchema = z.object({
  medicationId: z.string(),
  brand: z.string(),
  price: z.number().positive(),
  quantity: z.number().int().positive(),
});

export const createOrderSchema = z.object({
  deviceId: z.string().min(1),
  totalAmount: z.number().positive(),
  paymentMethod: z.string().min(1),
  deliveryAddress: z.string().min(1),
  deliveryLat: z.number().nullable(),
  deliveryLng: z.number().nullable(),
  courierId: z.string().min(1),
  courierPrice: z.number().min(0),
  items: z.array(orderItemSchema).min(1),
});

export const orderResponseSchema = z.object({
  orderNumber: z.string(),
  status: z.string(),
  totalAmount: z.number(),
  paymentMethod: z.string(),
  deliveryAddress: z.string(),
  courierId: z.string(),
  courierPrice: z.number(),
  items: z.array(orderItemSchema),
  createdAt: z.string(),
});

export const profileSchema = z.object({
  deviceId: z.string().min(1),
  ageYears: z.number().int().min(1).max(120),
  weightKg: z.number().min(1).max(300),
  allergies: z.array(z.string()),
  lang: z.enum(['id', 'en']),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type OrderResponse = z.infer<typeof orderResponseSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
