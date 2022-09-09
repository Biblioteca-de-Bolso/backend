/*
  Warnings:

  - The values [NO_STATUS] on the enum `ReadStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ReadStatus_new" AS ENUM ('PLANNING', 'READING', 'CONCLUDED', 'DROPPED');
ALTER TABLE "book" ALTER COLUMN "readStatus" DROP DEFAULT;
ALTER TABLE "book" ALTER COLUMN "readStatus" TYPE "ReadStatus_new" USING ("readStatus"::text::"ReadStatus_new");
ALTER TYPE "ReadStatus" RENAME TO "ReadStatus_old";
ALTER TYPE "ReadStatus_new" RENAME TO "ReadStatus";
DROP TYPE "ReadStatus_old";
ALTER TABLE "book" ALTER COLUMN "readStatus" SET DEFAULT 'PLANNING';
COMMIT;
