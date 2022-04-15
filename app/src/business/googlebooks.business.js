const { ok, failure } = require("../modules/http");
const { fileName } = require("../modules/debug");
const { googleBooksAPI } = require("../services/googlebooks");
const { InternalServerError } = require("../modules/codes");

module.exports = {
  async search(qstring, lang) {
    let books = [];

    await googleBooksAPI
      .get("/volumes", {
        params: {
          key: process.env.GOOGLE_BOOKS_API,
          q: qstring,
          langRestrict: lang || "pt",
        },
      })
      .then((response) => {
        const results = response.data.items;

        for (const book of results) {
          // Possíveis identificadores de indústria
          let identifiers = {
            ISBN_10: "",
            ISBN_13: "",
            ISSN: "",
            OTHER: "",
          };

          // Extração dos identificadores de Indústria
          if (book.volumeInfo.hasOwnProperty("industryIdentifiers")) {
            if (book.volumeInfo["industryIdentifiers"].length > 1) {
              // Possui múltiplos identificadores de indústria
              for (const identifier of book.volumeInfo["industryIdentifiers"]) {
                let type = identifier["type"];
                let value = identifier["identifier"];

                identifiers[type] = value;
              }
            } else {
              // Possui apenas um identificador de indústria
              let type = book.volumeInfo["industryIdentifiers"]["type"];
              let value = book.volumeInfo["industryIdentifiers"]["identifier"];

              identifiers[type] = value;
            }
          }

          // Extração da capa do livro
          let thumbnail = "";

          if (book.volumeInfo.hasOwnProperty("imageLinks")) {
            thumbnail = book.volumeInfo["imageLinks"]["thumbnail"];
          }

          // Extração dos autores
          let author = "";

          if (book.volumeInfo.hasOwnProperty("authors")) {
            for (const bookAuthor of book.volumeInfo["authors"]) {
              author += author.length === 0 ? bookAuthor : ", " + bookAuthor;
            }
          }

          books.push({
            ISBN_10: identifiers["ISBN_10"],
            ISBN_13: identifiers["ISBN_13"],
            title: book.volumeInfo["title"] || "",
            subtite: book.volumeInfo["subtitle"] || "",
            author: author || "",
            publisher: book.volumeInfo["publisher"] || "",
            description: book.volumeInfo["description"] || "",
            thumbnail: thumbnail || "",
          });
        }
      })
      .catch((error) => {
        return failure({
          status: "error",
          code: InternalServerError,
          message: error.message,
        });
      });

    return ok({
      status: "ok",
      response: {
        books: books,
      },
    });
  },
};
