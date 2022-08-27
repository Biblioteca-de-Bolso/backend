-- CreateTable
CREATE TABLE "borrow" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "bookId" INTEGER NOT NULL,
    "contactName" VARCHAR(64) NOT NULL,
    "borrowStatus" "BorrowStatus" NOT NULL DEFAULT E'RETURNED',
    "borrowDate" TIMESTAMP(3),
    "devolutionDate" TIMESTAMP(3),

    CONSTRAINT "borrow_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "borrow_id_key" ON "borrow"("id");

-- AddForeignKey
ALTER TABLE "borrow" ADD CONSTRAINT "borrow_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "borrow" ADD CONSTRAINT "borrow_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
