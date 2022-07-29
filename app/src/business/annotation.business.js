const { OkStatus, ErrorStatus, NotFound, DatabaseFailure } = require("../modules/codes");
const { ok, failure } = require("../modules/http");
const prisma = require("../prisma");
const { PAGE_SIZE } = require("../modules/constants");

module.exports = {
  async create(userId, bookId, title, text, reference) {
    const book = await prisma.book.findFirst({
      where: {
        AND: [
          {
            id: bookId,
          },
          {
            userId,
          },
        ],
      },
    });

    if (book) {
      const annotation = await prisma.annotation.create({
        data: {
          userId,
          bookId,
          title,
          text,
          reference: reference || "",
        },
      });

      if (annotation) {
        return ok({
          status: OkStatus,
          response: {
            ...annotation,
          },
        });
      } else {
        return failure({
          status: ErrorStatus,
          code: DatabaseFailure,
          message: "Não foi possível realizar a criação da anotação.",
        });
      }
    } else {
      return ok({
        status: ErrorStatus,
        code: NotFound,
        message: "Nenhum livro encontrado com o ID informado para este usuário.",
      });
    }
  },

  async list(userId, page, bookId) {
    if (!page || page == 0) page = 1;

    const whereClausule = {
      userId,
    };

    if (bookId) {
      whereClausule.bookId = parseInt(bookId);
    }

    const annotations = await prisma.annotation.findMany({
      where: {
        ...whereClausule,
      },
      skip: (page - 1) * PAGE_SIZE,
      take: page * PAGE_SIZE,
    });

    if (annotations) {
      return ok({
        status: OkStatus,
        response: {
          annotations: annotations,
        },
      });
    } else {
      return ok({
        status: ErrorStatus,
        code: NotFound,
        message: "Nenhuma anotação encontrada para os filtros especificados.",
      });
    }
  },
};
