/*
  Warnings:

  - You are about to drop the column `isbn_10` on the `book` table. All the data in the column will be lost.
  - You are about to drop the column `isbn_13` on the `book` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "book" DROP COLUMN "isbn_10",
DROP COLUMN "isbn_13",
ADD COLUMN     "isbn10" VARCHAR(10),
ADD COLUMN     "isbn13" VARCHAR(13);
