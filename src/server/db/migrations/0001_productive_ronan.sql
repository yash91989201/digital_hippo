ALTER TABLE `user` ADD `email_verified` timestamp;--> statement-breakpoint
ALTER TABLE `user` ADD `two_factor_enabled` boolean DEFAULT false;