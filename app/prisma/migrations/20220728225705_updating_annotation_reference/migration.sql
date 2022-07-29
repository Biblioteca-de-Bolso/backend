/*
  Warnings:

  - You are about to drop the column `page` on the `annotation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "annotation" DROP COLUMN "page",
ADD COLUMN     "reference" VARCHAR(128);
