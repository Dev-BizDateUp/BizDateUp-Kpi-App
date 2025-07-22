/*
  Warnings:

  - You are about to drop the column `threshold_amber_max` on the `kpis` table. All the data in the column will be lost.
  - You are about to drop the column `threshold_amber_min` on the `kpis` table. All the data in the column will be lost.
  - You are about to drop the column `threshold_green_max` on the `kpis` table. All the data in the column will be lost.
  - You are about to drop the column `threshold_green_min` on the `kpis` table. All the data in the column will be lost.
  - You are about to drop the column `threshold_red_max` on the `kpis` table. All the data in the column will be lost.
  - You are about to drop the column `threshold_red_min` on the `kpis` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "kpis" DROP COLUMN "threshold_amber_max",
DROP COLUMN "threshold_amber_min",
DROP COLUMN "threshold_green_max",
DROP COLUMN "threshold_green_min",
DROP COLUMN "threshold_red_max",
DROP COLUMN "threshold_red_min",
ADD COLUMN     "green_threshold" DOUBLE PRECISION,
ADD COLUMN     "yellow_threshold" DOUBLE PRECISION;
