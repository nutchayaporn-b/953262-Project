/*
  Warnings:

  - You are about to drop the column `order_id` on the `invoice` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `invoice` DROP FOREIGN KEY `fk_invoice_order1`;

-- AlterTable
ALTER TABLE `invoice` DROP COLUMN `order_id`;

-- AlterTable
ALTER TABLE `order` ADD COLUMN `invoice_id` INTEGER NULL;

-- CreateIndex
CREATE INDEX `fk_order_invoice1_idx` ON `order`(`invoice_id`);

-- AddForeignKey
ALTER TABLE `order` ADD CONSTRAINT `fk_order_invoice1` FOREIGN KEY (`invoice_id`) REFERENCES `invoice`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
