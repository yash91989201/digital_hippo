CREATE TABLE `order_products` (
	`order_id` varchar(255) NOT NULL,
	`product_id` varchar(255) NOT NULL,
	CONSTRAINT `orderProductsKey` PRIMARY KEY(`order_id`,`product_id`)
);
--> statement-breakpoint
CREATE TABLE `order` (
	`id` varchar(255) NOT NULL,
	`is_paid` boolean NOT NULL DEFAULT false,
	`user_id` varchar(255) NOT NULL,
	CONSTRAINT `order_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `product_file` (
	`id` varchar(255) NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`product_id` varchar(255) NOT NULL,
	CONSTRAINT `product_file_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `product_image` (
	`id` varchar(255) NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`product_id` varchar(255) NOT NULL,
	CONSTRAINT `product_image_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `product` (
	`id` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`price` int NOT NULL,
	`category` enum('ui_kits','icons') NOT NULL,
	`sale_status` enum('PENDING','APPROVED','DENIED') NOT NULL DEFAULT 'PENDING',
	`approved_for_sale` boolean NOT NULL DEFAULT false,
	`price_id` varchar(255) NOT NULL,
	`stripe_id` varchar(255) NOT NULL,
	`user_id` varchar(255) NOT NULL,
	CONSTRAINT `product_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `order_products` ADD CONSTRAINT `order_products_order_id_order_id_fk` FOREIGN KEY (`order_id`) REFERENCES `order`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `order_products` ADD CONSTRAINT `order_products_product_id_product_id_fk` FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `order` ADD CONSTRAINT `order_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `product_file` ADD CONSTRAINT `product_file_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `product_file` ADD CONSTRAINT `product_file_product_id_product_id_fk` FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `product_image` ADD CONSTRAINT `product_image_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `product_image` ADD CONSTRAINT `product_image_product_id_product_id_fk` FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `product` ADD CONSTRAINT `product_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;