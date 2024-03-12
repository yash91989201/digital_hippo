ALTER TABLE `image` MODIFY COLUMN `name` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `image` ADD `url` text NOT NULL;--> statement-breakpoint
ALTER TABLE `image` ADD `size` int NOT NULL;