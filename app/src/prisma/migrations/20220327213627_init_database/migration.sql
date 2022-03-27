-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(64) NOT NULL,
    "email" VARCHAR(64) NOT NULL,
    "password" VARCHAR(32) NOT NULL,
    "active" BOOLEAN DEFAULT false,
    "activationCode" VARCHAR(16),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refreshToken" (
    "id" VARCHAR(128) NOT NULL,
    "email" VARCHAR(64) NOT NULL,
    "userId" INTEGER NOT NULL,
    "iat" VARCHAR(10) NOT NULL,
    "exp" VARCHAR(10) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "refreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "book" (
    "bookId" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "title" VARCHAR(128) NOT NULL,
    "author" VARCHAR(128),
    "isbn_10" VARCHAR(10),
    "isbn_13" VARCHAR(13),
    "publisher" VARCHAR(128),
    "description" TEXT,
    "thumbnail" VARCHAR(255),
    "readStatus" INTEGER,
    "borrowStatus" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "book_pkey" PRIMARY KEY ("bookId")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_id_key" ON "user"("id");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "refreshToken_id_key" ON "refreshToken"("id");

-- CreateIndex
CREATE UNIQUE INDEX "book_bookId_key" ON "book"("bookId");

-- AddForeignKey
ALTER TABLE "refreshToken" ADD CONSTRAINT "refreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
