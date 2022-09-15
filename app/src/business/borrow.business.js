const prisma = require("../prisma");

const {
  OkStatus,
  ErrorStatus,
  NotFound,
  Forbidden,
  DatabaseFailure,
  BookAlreadyBorrowed,
} = require("../modules/codes");
const { ok, notFound, forbidden, failure, conflict } = require("../modules/http");

module.exports = {
  async create(userId, bookId, contactName) {
    const book = await prisma.book.findUnique({
      where: {
        id: bookId,
      },
    });

    if (!book) {
      return notFound({
        status: ErrorStatus,
        code: NotFound,
        message: "O livro informado não foi encontrado.",
      });
    }

    if (book.userId !== userId) {
      return forbidden({
        status: ErrorStatus,
        code: Forbidden,
        message: "O usuário informado não possui o privilégio para executar essa ação.",
      });
    }

    const currentBorrow = await prisma.borrow.findMany({
      where: {
        bookId,
        borrowStatus: "PENDING",
      },
    });

    if (currentBorrow.length > 0) {
      return conflict({
        status: ErrorStatus,
        code: BookAlreadyBorrowed,
        message: "O livro informado já possui um empréstimo em aberto.",
      });
    }

    const borrow = await prisma.borrow.create({
      data: {
        userId,
        bookId,
        contactName,
      },
    });

    if (borrow) {
      return ok({
        status: OkStatus,
        response: {
          borrow,
        },
      });
    } else {
      return failure({
        status: ErrorStatus,
        code: DatabaseFailure,
        message: "Não foi possível realizar a criação de um ou mais dados do banco de dados.",
      });
    }
  },
};
