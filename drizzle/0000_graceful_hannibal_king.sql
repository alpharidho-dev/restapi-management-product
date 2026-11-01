CREATE TABLE `products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(150) NOT NULL,
	`category` varchar(100) NOT NULL,
	`price` decimal(12,2) NOT NULL,
	`stock` int NOT NULL DEFAULT 0,
	`description` text,
	`image_url` varchar(500),
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `products_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`username` varchar(100) NOT NULL,
	`email` varchar(100) NOT NULL,
	`password` varchar(255) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
