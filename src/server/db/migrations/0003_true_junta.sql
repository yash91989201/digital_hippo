ALTER TABLE `verification_token` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `user` MODIFY COLUMN `name` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `verification_token` DROP COLUMN `id`;