const { ok, created, failure, notFound, forbidden, conflict } = require("../modules/http");
const { isbn10to13, isbn13to10 } = require("../modules/isbn");
const { DatabaseFailure, NotFound, Forbidden, DuplicatedISBN } = require("../modules/codes");
const { PAGE_SIZE } = require("../modules/constants");

const prisma = require("../prisma");

module.exports = {
  async create(token, title, author, isbn, publisher, description, thumbnail) {
    const userId = parseInt(token["id"]);

    // Executa verificação de ISBN informado
    let isbn10 = "";
    let isbn13 = "";

    if (isbn) {
      isbn.length === 10 ? (isbn10 = isbn) : (isbn13 = isbn);

      isbn10 && !isbn13 ? (isbn13 = isbn10to13(isbn10)) : (isbn10 = isbn13to10(isbn13));
    }

    const book = await prisma.book.findFirst({
      where: {
        OR: [
          {
            isbn10: isbn10,
          },
          {
            isbn13: isbn13,
          },
        ],
      },
    });

    if (book) {
      return conflict({
        status: "error",
        code: DuplicatedISBN,
        message: "Já existe um livro cadastrado com o ISBN informado.",
      });
    } else {
      const newBook = await prisma.book.create({
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

      if (newBook) {
        return created({
          status: "ok",
          response: {
            book: newBook,
          },
        });
      } else {
        return failure({
          status: "error",
          code: DatabaseFailure,
          message: "Não foi possível inserir o livro na base de dados, tente novamente.",
        });
      }
    }
  },

  async read(token, id) {
    const userId = parseInt(token["id"]);

    const book = await prisma.book.findUnique({
      where: {
        id: id,
      },
    });

    if (book) {
      const bookOwner = book["userId"];

      if (bookOwner === userId) {
        return ok({
          status: "ok",
          response: {
            book: book,
          },
        });
      } else {
        return forbidden({
          status: "error",
          code: Forbidden,
          message: "Este usuário não tem permissão para acessar o conteúdo solicitado.",
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

  async list(token, page) {
    const userId = parseInt(token["id"]);

    if (!page || page == 0) page = 1;

    const books = await prisma.book.findMany({
      where: {
        userId: userId,
      },
      skip: (page - 1) * PAGE_SIZE,
      take: page * PAGE_SIZE,
    });

    if (books) {
      return ok({
        status: "ok",
        response: {
          books: books,
        },
      });
    }
  },
};
