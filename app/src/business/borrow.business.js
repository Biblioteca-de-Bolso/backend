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
const { PAGE_SIZE } = require("../modules/constants");
const { BorrowStatus } = require("@prisma/client");

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

  async delete(userId, borrowId) {
    const borrow = await prisma.borrow.findUnique({
      where: {
        id: borrowId,
      },
    });

    if (!borrow) {
      return notFound({
        status: ErrorStatus,
        code: NotFound,
        message: "O empréstimo informado não foi encontrado",
      });
    }

    if (borrow.userId !== userId) {
      return forbidden({
        status: ErrorStatus,
        code: Forbidden,
        message: "O usuário informado não possui o privilégio para executar essa ação.",
      });
    }

    const deleted = await prisma.borrow.delete({
      where: {
        id: borrowId,
      },
    });

    if (deleted) {
      return ok({
        status: OkStatus,
        response: {
          message: "O registro de empréstimo informado foi removido com sucesso.",
        },
      });
    } else {
      return failure({
        status: ErrorStatus,
        code: DatabaseFailure,
        message: "Não foi possível realizar a exclusão de um ou mais dados do banco de dados.",
      });
    }
  },

  async list(userId, page, bookId, search, borrowStatus) {
    if (!page || page == 0) page = 1;

    let whereClausule = {
      userId,
    };

    if (bookId) {
      whereClausule.bookId = parseInt(bookId, 10);
    }

    if (borrowStatus) {
      whereClausule.borrowStatus = borrowStatus;
    }

    const searchList = [
      {
        book: {
          title: {
            contains: search,
            mode: "insensitive",
          },
        },
      },
      {
        contactName: {
          contains: search,
          mode: "insensitive",
        },
      },
    ];

    if (search) {
      whereClausule.OR = searchList;
    }

    const borrows = await prisma.borrow.findMany({
      where: whereClausule,
      include: {
        book: {
          select: {
            title: true,
          },
        },
      },
      orderBy: {
        borrowDate: "desc",
      },
      skip: (page - 1) * PAGE_SIZE,
      take: page * PAGE_SIZE,
    });

    return ok({
      status: OkStatus,
      response: {
        borrows: borrows,
      },
    });
  },

  async read(userId, borrowId) {
    const borrow = await prisma.borrow.findUnique({
      where: {
        id: borrowId,
      },
      include: {
        book: {
          select: {
            title: true,
          },
        },
      },
    });

    if (!borrow) {
      return notFound({
        status: ErrorStatus,
        code: NotFound,
        message: "O empréstimo informado não foi encontrado",
      });
    }

    if (borrow.userId !== userId) {
      return forbidden({
        status: ErrorStatus,
        code: Forbidden,
        message: "O usuário informado não possui o privilégio para executar essa ação.",
      });
    }

    return ok({
      status: OkStatus,
      response: {
        borrow: {
          ...borrow,
        },
      },
    });
  },

  async update(userId, borrowId, contactName, borrowStatus) {
    const data = {};

    if (contactName !== undefined && contactName !== null) data.contactName = contactName;

    const borrow = await prisma.borrow.findUnique({
      where: {
        id: borrowId,
      },
    });

    if (!borrow) {
      return notFound({
        status: ErrorStatus,
        code: NotFound,
        message: "O empréstimo informado não foi encontrado.",
      });
    }

    if (borrow.userId !== userId) {
      return forbidden({
        status: ErrorStatus,
        code: Forbidden,
        message: "O usuário informado não possui o privilégio para executar essa ação.",
      });
    }

    if (borrowStatus !== borrow.borrowStatus) {
      if (borrowStatus !== undefined && borrowStatus !== null) data.borrowStatus = borrowStatus;

      if (borrowStatus === "PENDING") {
        console.log("Buscando por duplicata");

        const borrowedBook = await prisma.borrow.findFirst({
          where: {
            bookId: borrow.bookId,
            borrowStatus: "PENDING",
          },
        });

        console.log(borrowedBook);

        if (borrowedBook) {
          return conflict({
            status: ErrorStatus,
            code: BookAlreadyBorrowed,
            message: "O livro informado já possui um empréstimo em aberto.",
          });
        }
      }
    }

    if (borrowStatus === "RETURNED") {
      data.devolutionDate = new Date();
    }

    const updated = await prisma.borrow.update({
      where: {
        id: borrowId,
      },
      data,
    });

    if (updated) {
      return ok({
        status: OkStatus,
        response: {
          borrow: updated,
        },
      });
    } else {
      return failure({
        status: ErrorStatus,
        code: DatabaseFailure,
        message: "Não foi possível atualizar um ou mais dados do banco de dados.",
      });
    }
  },
};
