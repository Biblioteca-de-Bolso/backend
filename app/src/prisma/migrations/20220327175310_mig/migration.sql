/*
  Warnings:

  - You are about to alter the column `name` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(128)` to `VarChar(64)`.

*/
-- AlterTable
ALTER TABLE "user" ALTER COLUMN "name" SET DATA TYPE VARCHAR(64);

-- CreateTable
CREATE TABLE "refreshToken" (
    "id" VARCHAR(128) NOT NULL,
    "email" VARCHAR(64) NOT NULL,
    "userId" INTEGER NOT NULL,
    "iat" TIMESTAMP(3) NOT NULL,
    "exp" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "refreshToken_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "refreshToken" ADD CONSTRAINT "refreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
