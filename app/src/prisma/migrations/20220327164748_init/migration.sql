-- CreateTable
CREATE TABLE "user" (
    "userId" SERIAL NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("userId")
);
