-- AlterTable
ALTER TABLE `user` ADD COLUMN `isDeactivated` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `isEmailVerified` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `role` ENUM('ADMIN', 'MANAGER', 'EMPLOYEE') NOT NULL DEFAULT 'ADMIN';

-- CreateTable
CREATE TABLE `passwordresettoken` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `passwordresettoken_token_key`(`token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `passwordresettoken` ADD CONSTRAINT `PasswordResetToken_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
