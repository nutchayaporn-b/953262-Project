-- CreateTable
CREATE TABLE `category` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NULL,
    `active` TINYINT NULL DEFAULT 1,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `food` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NULL,
    `description` VARCHAR(1000) NULL,
    `price` DOUBLE NULL,
    `category_id` INTEGER NULL,
    `active` TINYINT NULL DEFAULT 1,
    `image` VARCHAR(255) NULL,

    INDEX `fk_food_category_idx`(`category_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `invoice` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `total` DOUBLE NULL,
    `order_id` INTEGER NULL,
    `invoice_status_id` INTEGER NULL,

    INDEX `fk_invoice_invoice_status1_idx`(`invoice_status_id`),
    INDEX `fk_invoice_order1_idx`(`order_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `invoice_status` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `status` VARCHAR(45) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `order` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NULL,
    `created_at` DATETIME(0) NULL,
    `updated_at` DATETIME(0) NULL,

    INDEX `fk_order_user1_idx`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `order_item` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `amount` INTEGER NULL,
    `order_id` INTEGER NULL,
    `food_id` INTEGER NULL,
    `order_status_id` INTEGER NULL,

    INDEX `fk_order_item_food1_idx`(`food_id`),
    INDEX `fk_order_item_order1_idx`(`order_id`),
    INDEX `fk_order_item_order_status1_idx`(`order_status_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `order_status` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `status` VARCHAR(45) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NULL,
    `role` VARCHAR(45) NULL DEFAULT 'customer',
    `email` VARCHAR(255) NULL,
    `password` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `food` ADD CONSTRAINT `fk_food_category` FOREIGN KEY (`category_id`) REFERENCES `category`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `invoice` ADD CONSTRAINT `fk_invoice_invoice_status1` FOREIGN KEY (`invoice_status_id`) REFERENCES `invoice_status`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `invoice` ADD CONSTRAINT `fk_invoice_order1` FOREIGN KEY (`order_id`) REFERENCES `order`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `order` ADD CONSTRAINT `fk_order_user1` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `order_item` ADD CONSTRAINT `fk_order_item_food1` FOREIGN KEY (`food_id`) REFERENCES `food`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `order_item` ADD CONSTRAINT `fk_order_item_order1` FOREIGN KEY (`order_id`) REFERENCES `order`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `order_item` ADD CONSTRAINT `fk_order_item_order_status1` FOREIGN KEY (`order_status_id`) REFERENCES `order_status`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
