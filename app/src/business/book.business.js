const { ok, failure } = require("../modules/http");
const { isbn10to13, isbn13to10 } = require("../modules/isbn");
const { DatabaseFailure } = require("../modules/codes");
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

  async list() {
    return ok({
      status: "ok",
      response: {
        message: "ok",
      },
    });
  },
};
