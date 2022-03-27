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
CREATE UNIQUE INDEX "book_bookId_key" ON "book"("bookId");
