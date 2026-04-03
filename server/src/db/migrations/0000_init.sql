CREATE TABLE `profiles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`device_id` text NOT NULL,
	`age_years` integer NOT NULL,
	`weight_kg` real NOT NULL,
	`allergies` text NOT NULL,
	`lang` text DEFAULT 'id' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `profiles_device_id_unique` ON `profiles` (`device_id`);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`order_number` text NOT NULL,
	`device_id` text NOT NULL,
	`total_amount` integer NOT NULL,
	`payment_method` text NOT NULL,
	`delivery_address` text NOT NULL,
	`delivery_lat` real,
	`delivery_lng` real,
	`courier_id` text NOT NULL,
	`courier_price` integer NOT NULL,
	`status` text DEFAULT 'confirmed' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `orders_order_number_unique` ON `orders` (`order_number`);
--> statement-breakpoint
CREATE TABLE `order_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`order_id` integer NOT NULL REFERENCES `orders`(`id`),
	`medication_id` text NOT NULL,
	`brand` text NOT NULL,
	`price` integer NOT NULL,
	`quantity` integer NOT NULL
);
