/*
  Warnings:

  - You are about to drop the column `clockInAt` on the `clockin` table. All the data in the column will be lost.
  - You are about to drop the column `clockOutAt` on the `clockin` table. All the data in the column will be lost.
  - You are about to drop the column `geoCity` on the `clockin` table. All the data in the column will be lost.
  - You are about to drop the column `geoCountry` on the `clockin` table. All the data in the column will be lost.
  - You are about to drop the column `shiftId` on the `clockin` table. All the data in the column will be lost.
  - Added the required column `clockId` to the `clockIn` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `clockin` DROP FOREIGN KEY `ClockIn_shiftId_fkey`;

-- DropIndex
DROP INDEX `ClockIn_shiftId_fkey` ON `clockin`;

-- AlterTable
ALTER TABLE `clockin` DROP COLUMN `clockInAt`,
    DROP COLUMN `clockOutAt`,
    DROP COLUMN `geoCity`,
    DROP COLUMN `geoCountry`,
    DROP COLUMN `shiftId`,
    ADD COLUMN `clockAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `clockId` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `clock` (
    `id` VARCHAR(191) NOT NULL,
    `shiftId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `createdById` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `clock_shiftId_idx`(`shiftId`),
    INDEX `clock_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `clockOut` (
    `id` VARCHAR(191) NOT NULL,
    `clockId` VARCHAR(191) NOT NULL,
    `clockAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `method` VARCHAR(191) NULL,
    `latitude` DOUBLE NULL,
    `longitude` DOUBLE NULL,
    `ipAddress` VARCHAR(191) NULL,
    `device` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `clockOut_clockId_idx`(`clockId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `clockIn_clockId_idx` ON `clockIn`(`clockId`);

-- AddForeignKey
ALTER TABLE `clock` ADD CONSTRAINT `clock_shiftId_fkey` FOREIGN KEY (`shiftId`) REFERENCES `shift`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `clock` ADD CONSTRAINT `clock_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `clockIn` ADD CONSTRAINT `clockIn_clockId_fkey` FOREIGN KEY (`clockId`) REFERENCES `clock`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `clockOut` ADD CONSTRAINT `clockOut_clockId_fkey` FOREIGN KEY (`clockId`) REFERENCES `clock`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
