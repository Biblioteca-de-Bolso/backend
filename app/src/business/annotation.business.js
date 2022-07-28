const { OkStatus, ErrorStatus, NotFound, DatabaseFailure } = require("../modules/codes");
const { ok, failure } = require("../modules/http");
const prisma = require("../prisma");

module.exports = {
  async create(token, bookId, title, text, reference) {
    const userId = parseInt(token["id"]);

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

    return ok({
      status: OkStatus,
      response: {
        annotation: {
          message: "ok",
        },
      },
    });
  },
};
