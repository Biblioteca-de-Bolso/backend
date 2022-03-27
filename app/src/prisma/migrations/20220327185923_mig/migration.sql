/*
  Warnings:

  - Changed the type of `iat` on the `refreshToken` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `exp` on the `refreshToken` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "refreshToken" DROP COLUMN "iat",
ADD COLUMN     "iat" VARCHAR(10) NOT NULL,
DROP COLUMN "exp",
ADD COLUMN     "exp" VARCHAR(10) NOT NULL;
