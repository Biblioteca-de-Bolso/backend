const { OkStatus, ErrorStatus, NotFound, DatabaseFailure, Forbidden } = require("../modules/codes");
const { ok, created, failure, notFound, forbidden, badRequest } = require("../modules/http");
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

    if (!book) {
      return ok({
        status: ErrorStatus,
        code: NotFound,
        message: "Nenhum livro encontrado com o ID informado para este usuário.",
      });
    }

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
      return created({
        status: OkStatus,
        response: {
          annotation: annotation,
        },
      });
    } else {
      return failure({
        status: ErrorStatus,
        code: DatabaseFailure,
        message: "Não foi possível realizar a criação da anotação.",
      });
    }
  },

  async list(userId, page, bookId) {
    if (!page || page == 0) page = 1;

    const whereClausule = {
      userId,
    };

    if (bookId) {
      whereClausule.bookId = parseInt(bookId, 10);
    }

    const annotations = await prisma.annotation.findMany({
      where: {
        ...whereClausule,
      },
      skip: (page - 1) * PAGE_SIZE,
      take: page * PAGE_SIZE,
      include: {
        book: {
          select: {
            title: true,
          },
        },
      },
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

  async read(userId, annotationId) {
    const annotation = await prisma.annotation.findFirst({
      where: {
        id: annotationId,
      },
      include: {
        book: {
          select: {
            title: true,
          },
        },
      },
    });

    if (!annotation) {
      return notFound({
        status: ErrorStatus,
        code: NotFound,
        message: "A anotação informada não foi encontrada.",
      });
    }

    if (annotation.userId !== userId) {
      return forbidden({
        status: ErrorStatus,
        code: Forbidden,
        message: "Este usuário não tem permissão para acessar o conteúdo solicitado.",
      });
    }

    return ok({
      status: OkStatus,
      response: {
        annotation: annotation,
      },
    });
  },

  async delete(userId, annotationId) {
    const annotation = await prisma.annotation.findUnique({
      where: {
        id: annotationId,
      },
    });

    if (!annotation) {
      return notFound({
        status: ErrorStatus,
        code: NotFound,
        message: "A anotação informada não foi encontrada.",
      });
    }

    if (annotation.userId !== userId) {
      return forbidden({
        status: ErrorStatus,
        code: Forbidden,
        message: "O usuário informado não possui o privilégio para executar essa ação.",
      });
    }

    const deleted = await prisma.$transaction([
      prisma.annotation.delete({
        where: {
          id: annotationId,
        },
      }),
    ]);

    if (deleted) {
      return ok({
        status: OkStatus,
        response: {
          message: "A anotação foi removida com sucesso.",
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

  async update(userId, annotationId, title, text, reference) {
    const data = {};

    if (title !== undefined && title !== null) data.title = title;
    if (text !== undefined && title !== null) data.text = text;
    if (reference !== undefined && title !== null) data.reference = reference;

    const annotation = await prisma.annotation.findUnique({
      where: {
        id: annotationId,
      },
    });

    if (!annotation) {
      return notFound({
        status: ErrorStatus,
        code: NotFound,
        message: "A anotação informada não foi encontrada.",
      });
    }

    if (annotation.userId !== userId) {
      return forbidden({
        status: ErrorStatus,
        code: Forbidden,
        message: "O usuário informado não possui o privilégio para executar essa ação.",
      });
    }

    const updated = await prisma.annotation.update({
      where: {
        id: annotationId,
      },
      data,
    });

    if (updated) {
      return ok({
        status: OkStatus,
        response: {
          annotation: updated,
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
