import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const profiles = sqliteTable('profiles', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  deviceId: text('device_id').notNull().unique(),
  ageYears: integer('age_years').notNull(),
  weightKg: real('weight_kg').notNull(),
  allergies: text('allergies').notNull(), // JSON string
  lang: text('lang').notNull().default('id'),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const orders = sqliteTable('orders', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  orderNumber: text('order_number').notNull().unique(),
  deviceId: text('device_id').notNull(),
  totalAmount: integer('total_amount').notNull(),
  paymentMethod: text('payment_method').notNull(),
  deliveryAddress: text('delivery_address').notNull(),
  deliveryLat: real('delivery_lat'),
  deliveryLng: real('delivery_lng'),
  courierId: text('courier_id').notNull(),
  courierPrice: integer('courier_price').notNull(),
  status: text('status').notNull().default('confirmed'),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const orderItems = sqliteTable('order_items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  orderId: integer('order_id').notNull().references(() => orders.id),
  medicationId: text('medication_id').notNull(),
  brand: text('brand').notNull(),
  price: integer('price').notNull(),
  quantity: integer('quantity').notNull(),
});
