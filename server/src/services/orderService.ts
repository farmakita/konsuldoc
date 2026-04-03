import { db } from '../db/index.js';
import { orders, orderItems } from '../db/schema.js';
import { eq } from 'drizzle-orm';

export interface OrderItemInput {
  medicationId: string;
  brand: string;
  price: number;
  quantity: number;
}

export interface CreateOrderInput {
  deviceId: string;
  totalAmount: number;
  paymentMethod: string;
  deliveryAddress: string;
  deliveryLat: number | null;
  deliveryLng: number | null;
  courierId: string;
  courierPrice: number;
  items: OrderItemInput[];
}

function generateOrderNumber(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'APK-';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function createOrder(input: CreateOrderInput) {
  const orderNumber = generateOrderNumber();

  const result = db.transaction((tx) => {
    const insertedOrder = tx
      .insert(orders)
      .values({
        orderNumber,
        deviceId: input.deviceId,
        totalAmount: input.totalAmount,
        paymentMethod: input.paymentMethod,
        deliveryAddress: input.deliveryAddress,
        deliveryLat: input.deliveryLat,
        deliveryLng: input.deliveryLng,
        courierId: input.courierId,
        courierPrice: input.courierPrice,
      })
      .returning()
      .get();

    const insertedItems = input.items.map((item) =>
      tx
        .insert(orderItems)
        .values({
          orderId: insertedOrder.id,
          medicationId: item.medicationId,
          brand: item.brand,
          price: item.price,
          quantity: item.quantity,
        })
        .returning()
        .get()
    );

    return { ...insertedOrder, items: insertedItems };
  });

  return result;
}

export async function getOrder(orderNumber: string) {
  const order = db
    .select()
    .from(orders)
    .where(eq(orders.orderNumber, orderNumber))
    .get();

  if (!order) {
    return null;
  }

  const items = db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, order.id))
    .all();

  return { ...order, items };
}
