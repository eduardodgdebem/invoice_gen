-- DropForeignKey
ALTER TABLE `ServiceItems` DROP FOREIGN KEY `InvoiceDescriptionItems_categoryId_fkey`;

-- AddForeignKey
ALTER TABLE `ServiceItems` ADD CONSTRAINT `ServiceItems_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `ServiceCategory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `ServiceItems` RENAME INDEX `InvoiceDescriptionItems_description_idx` TO `ServiceItems_description_idx`;
