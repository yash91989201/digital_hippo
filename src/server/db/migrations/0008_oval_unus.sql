CREATE TABLE `file` (
	`id` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`url` text NOT NULL,
	`size` int NOT NULL,
	`user_id` varchar(255) NOT NULL,
	CONSTRAINT `file_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `file` ADD CONSTRAINT `file_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;