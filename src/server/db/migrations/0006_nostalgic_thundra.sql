CREATE TABLE `image` (
	`id` varchar(255) NOT NULL,
	`name` varchar(255),
	`user_id` varchar(255) NOT NULL,
	CONSTRAINT `image_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `product_file` ADD `name` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `product_image` ADD `name` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `image` ADD CONSTRAINT `image_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;