-- AlterTable
ALTER TABLE `Session` ADD COLUMN `device_name` VARCHAR(100) NULL,
    ADD COLUMN `device_os` VARCHAR(50) NULL,
    ADD COLUMN `device_type` VARCHAR(50) NULL,
    ADD COLUMN `ip_address` VARCHAR(50) NULL,
    ADD COLUMN `platform` VARCHAR(50) NULL;
