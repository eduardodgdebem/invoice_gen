/*
  Warnings:

  - You are about to drop the `ServiceCategory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `ServiceItems` DROP FOREIGN KEY `ServiceItems_categoryId_fkey`;

-- -- DropTable
-- DROP TABLE `ServiceCategory`;

-- -- CreateTable
-- CREATE TABLE `ServiceCategories` (
--     `id` INTEGER NOT NULL AUTO_INCREMENT,
--     `name` VARCHAR(191) NOT NULL,

--     PRIMARY KEY (`id`)
-- ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

RENAME TABLE `ServiceCategory` TO `ServiceCategories`;

-- AddForeignKey
ALTER TABLE `ServiceItems` ADD CONSTRAINT `ServiceItems_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `ServiceCategories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
