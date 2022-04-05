const { ok, failure, notFound, forbidden } = require("../modules/http");
const { isbn10to13, isbn13to10 } = require("../modules/isbn");
const { DatabaseFailure, NotFound, Forbidden } = require("../modules/codes");
const prisma = require("../prisma");

module.exports = {
  async create(token, title, author, isbn, publisher, description, thumbnail) {
    const userId = parseInt(token["userId"]);

    // Executa verificação de ISBN informado
    let isbn10 = "";
    let isbn13 = "";

    if (isbn) {
      isbn.length === 10 ? (isbn10 = isbn) : (isbn13 = isbn);

      isbn10 && !isbn13 ? (isbn13 = isbn10to13(isbn10)) : (isbn10 = isbn13to10(isbn13));
    }

    const book = await prisma.book.create({
      data: {
        userId,
        title,
        author: author || "",
        isbn10: isbn10 || "",
        isbn13: isbn13 || "",
        publisher: publisher || "",
        description: description || "",
        thumbnail: thumbnail || "",
      },
    });

    if (book) {
      return ok({
        status: "ok",
        response: {
          book: book,
        },
      });
    } else {
      return failure({
        status: "error",
        code: DatabaseFailure,
        message: "Não foi possível inserir o livro na base de dados, tente novamente.",
      });
    }
  },

  async read(token, id) {
    const userId = parseInt(token["userId"]);

    const book = await prisma.book.findUnique({
      where: {
        id,
      },
    });

    if (book) {
      const bookOwner = book["userId"];

      if (bookOwner !== userId) {
        return forbidden({
          status: "error",
          code: Forbidden,
          message: "Este usuário não tem permissão para acessar o conteúdos solicitado.",
        });
      } else {
        return ok({
          status: "ok",
          response: {
            book: book,
          },
        });
      }
    } else {
      return notFound({
        status: "error",
        code: NotFound,
        message: "O livro informado não foi encontrado.",
      });
    }
  },

  async list(token) {
    return ok({
      status: "ok",
      response: {
        message: "ok",
      },
    });
  },
};
