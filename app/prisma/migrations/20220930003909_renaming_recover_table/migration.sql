/*
  Warnings:

  - You are about to drop the `Recover` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Recover" DROP CONSTRAINT "Recover_userId_fkey";

-- DropTable
DROP TABLE "Recover";

-- CreateTable
CREATE TABLE "recover" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "code" VARCHAR(16) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "redeemed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "recover_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "recover_id_key" ON "recover"("id");

-- AddForeignKey
ALTER TABLE "recover" ADD CONSTRAINT "recover_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
