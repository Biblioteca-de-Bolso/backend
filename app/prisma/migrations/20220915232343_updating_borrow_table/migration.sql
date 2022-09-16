/*
  Warnings:

  - Added the required column `updatedAt` to the `borrow` table without a default value. This is not possible if the table is not empty.
  - Made the column `borrowDate` on table `borrow` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "borrow" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "borrowStatus" SET DEFAULT E'PENDING',
ALTER COLUMN "borrowDate" SET NOT NULL,
ALTER COLUMN "borrowDate" SET DEFAULT CURRENT_TIMESTAMP;
