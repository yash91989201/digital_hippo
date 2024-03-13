RENAME TABLE `order_products` TO `order_product`;--> statement-breakpoint
ALTER TABLE `order_product` DROP FOREIGN KEY `order_products_order_id_order_id_fk`;
--> statement-breakpoint
ALTER TABLE `order_product` DROP FOREIGN KEY `order_products_product_id_product_id_fk`;
--> statement-breakpoint
ALTER TABLE `order_product` ADD CONSTRAINT `order_product_order_id_order_id_fk` FOREIGN KEY (`order_id`) REFERENCES `order`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `order_product` ADD CONSTRAINT `order_product_product_id_product_id_fk` FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON DELETE no action ON UPDATE no action;