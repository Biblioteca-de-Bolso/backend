const {
  ok,
  created,
  failure,
  notFound,
  forbidden,
  conflict,
  badRequest,
} = require("../modules/http");
const { isbn10to13, isbn13to10 } = require("../modules/isbn");
const { uploadPicture, extractPathFromURL, deletePicure } = require("../services/firebase");
const {
  OkStatus,
  ErrorStatus,
  DatabaseFailure,
  NotFound,
  Forbidden,
  DuplicatedISBN,
  IncorrectParameter,
} = require("../modules/codes");
const { PAGE_SIZE } = require("../modules/constants");

const prisma = require("../prisma");

module.exports = {
  async create(userId, title, author, isbn, publisher, description, thumbnail, thumbnailFile) {
    let isbn10 = "";
    let isbn13 = "";

    if (isbn !== undefined && isbn !== null && isbn !== "") {
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
        NOT: [
          {
            isbn10: {
              equals: "",
            },
          },
          {
            isbn13: {
              equals: "",
            },
          },
        ],
        userId,
      },
    });

    if (book) {
      return conflict({
        status: ErrorStatus,
        code: DuplicatedISBN,
        message: "Já existe um livro cadastrado com o ISBN informado.",
      });
    }

    // Verificação de thumbnail
    let finalThumbnail = thumbnail || "";

    if (thumbnailFile) {
      finalThumbnail = await uploadPicture(thumbnailFile);
    }

    const newBook = await prisma.book.create({
      data: {
        userId,
        title,
        author: author || "",
        isbn10: isbn10 || "",
        isbn13: isbn13 || "",
        publisher: publisher || "",
        description: description || "",
        thumbnail: finalThumbnail || "",
      },
    });

    if (!newBook) {
      // Falha no registro do livro do banco de dados, remover o arquivo enviado no Firebase Storage
      const firebasePath = extractPathFromURL(finalThumbnail);

      if (firebasePath) await deletePicure(firebasePath);

      return failure({
        status: ErrorStatus,
        code: DatabaseFailure,
        message: "Não foi possível inserir o livro na base de dados, tente novamente.",
      });
    }

    return created({
      status: OkStatus,
      response: {
        book: newBook,
      },
    });
  },

  async read(token, id) {
    const userId = parseInt(token["id"], 10);

    const book = await prisma.book.findUnique({
      where: {
        id: id,
      },
    });

    if (!book) {
      return notFound({
        status: ErrorStatus,
        code: NotFound,
        message: "O livro informado não foi encontrado.",
      });
    }

    if (book.userId === userId) {
      return ok({
        status: OkStatus,
        response: {
          book: book,
        },
      });
    } else {
      return forbidden({
        status: ErrorStatus,
        code: Forbidden,
        message: "Este usuário não tem permissão para acessar o conteúdo solicitado.",
      });
    }
  },

  async list(token, page) {
    const userId = parseInt(token["id"], 10);

    if (!page || page == 0) page = 1;

    const books = await prisma.book.findMany({
      where: {
        userId: userId,
      },
      skip: (page - 1) * PAGE_SIZE,
      take: page * PAGE_SIZE,
    });

    return ok({
      status: OkStatus,
      response: {
        books: books,
      },
    });
  },

  async delete(token, bookId) {
    const userId = parseInt(token["id"], 10);

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

    // Verifica se o livro possui uma imagem hospedada no Firebase Storage
    const firebasePath = extractPathFromURL(book.thumbnail);

    if (firebasePath) {
      try {
        await deletePicure(firebasePath);
      } catch (error) {
        if (error.code === "storage/object-not-found") {
          console.log(
            "O arquivo de imagem deste livro não foi encontrado. Remover dados restantes."
          );
        }
      }
    }

    const deleted = await prisma.$transaction([
      prisma.annotation.deleteMany({
        where: {
          bookId,
        },
      }),
      prisma.book.deleteMany({
        where: {
          id: bookId,
        },
      }),
    ]);

    if (deleted) {
      return ok({
        status: OkStatus,
        response: {
          message: "O livro e os dados relacionados foram apagados com sucesso.",
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

  async update(userId, bookId, title, author, isbn, publisher, description, thumbnail, readStatus) {
    const data = {};

    if (title !== undefined && title !== null) data.title = title;
    if (author !== undefined && author !== null) data.author = author;
    if (publisher !== undefined && publisher !== null) data.publisher = publisher;
    if (description !== undefined && description !== null) data.description = description;
    if (thumbnail !== undefined && thumbnail !== null) data.thumbnail = thumbnail;
    if (readStatus !== undefined && readStatus !== null) data.readStatus = readStatus;

    if (isbn === "") data.isbn10 = "";
    if (isbn === "") data.isbn13 = "";

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

    if (isbn !== undefined && isbn !== null && isbn !== "") {
      let isbn13 = "";
      let isbn10 = "";

      isbn.length === 10 ? (isbn10 = isbn) : (isbn13 = isbn);
      isbn10 && !isbn13 ? (isbn13 = isbn10to13(isbn10)) : (isbn10 = isbn13to10(isbn13));

      data.isbn10 = isbn10;
      data.isbn13 = isbn13;

      // Verificar se o usuário está tentando inserir um ISBN que já existe em outro livro
      if (isbn10 !== book.isbn10 && isbn13 !== book.isbn13) {
        const bookWithNewIsbn = await prisma.book.findFirst({
          where: {
            OR: [
              {
                isbn10: isbn10,
              },
              {
                isbn13: isbn13,
              },
            ],
            NOT: [
              {
                isbn10: {
                  equals: "",
                },
              },
              {
                isbn13: {
                  equals: "",
                },
              },
            ],
            userId,
          },
        });

        if (bookWithNewIsbn) {
          return conflict({
            status: ErrorStatus,
            code: DuplicatedISBN,
            message: "Já existe um livro cadastrado com o ISBN informado.",
          });
        }
      }
    }

    const updated = await prisma.book.update({
      where: {
        id: bookId,
      },
      data,
    });

    if (updated) {
      return ok({
        status: OkStatus,
        response: {
          book: updated,
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

  async updateThumbnail(userId, bookId, thumbnailFile) {
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

    if (!thumbnailFile) {
      return badRequest({
        status: ErrorStatus,
        code: IncorrectParameter,
        message: "É necessário informar um arquivo válido de imagem.",
      });
    }

    let newThumbnail;
    let oldThumbnail = book.thumbnail;

    // Realizar o upload de nova imagem no Firebase
    newThumbnail = await uploadPicture(thumbnailFile);

    // Atualizar dados no banco de dados
    const updated = await prisma.book.update({
      where: {
        id: bookId,
      },
      data: {
        thumbnail: newThumbnail,
      },
    });

    if (updated) {
      // Atualização bem sucecida, prosseguir com remoção da imagem anterior
      const firebasePath = extractPathFromURL(oldThumbnail);

      if (firebasePath) {
        try {
          await deletePicure(firebasePath);
        } catch (error) {
          console.log("Não foi possível remover a imagem anterior do Firebase.");
        }
      }

      return ok({
        status: OkStatus,
        response: {
          book: updated,
        },
      });
    } else {
      // Falha durante a atualização, necessário remover a nova imagem enviada
      const firebasePath = extractPathFromURL(newThumbnail);

      try {
        await deletePicure(firebasePath);
      } catch (error) {
        console.log("Não foi possível remover a nova imagem do Firebase.");
      }

      return failure({
        status: ErrorStatus,
        code: DatabaseFailure,
        message: "Não foi possível realizar a atualização da foto de capa do livro.",
      });
    }
  },

  async removeThumbnail(userId, bookId) {
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

    const firebasePath = extractPathFromURL(book.thumbnail);

    if (firebasePath) {
      try {
        await deletePicure(firebasePath);
      } catch (error) {
        console.log("Não foi possível remover a imagem do Firebase.");
      }
    }

    const updated = await prisma.book.update({
      where: {
        id: bookId,
      },
      data: {
        thumbnail: "",
      },
    });

    if (updated) {
      return ok({
        status: OkStatus,
        response: {
          book: updated,
        },
      });
    } else {
      return failure({
        status: ErrorStatus,
        code: DatabaseFailure,
        message: "Não foi possível alterar os dados do livro no banco de dados.",
      });
    }
  },
};
