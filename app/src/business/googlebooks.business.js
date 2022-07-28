const { ok, failure } = require("../modules/http");
const { googleBooksAPI } = require("../services/googlebooks");
const { OkStatus, ErrorStatus, InternalServerError } = require("../modules/codes");

module.exports = {
  async search(qstring, lang, maturity, printType, orderBy, isbnOnly = "true") {
    let books = [];

    isbnOnly = isbnOnly === "true" ? true : false;

    await googleBooksAPI
      .get("/volumes", {
        params: {
          key: process.env.GOOGLE_BOOKS_API,
          q: qstring,
          langRestrict: lang || "pt",
          maxAllowedMaturityRating: maturity || "not-mature",
          printType: printType || "books",
          orderBy: orderBy || "relevance",
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
          if (Object.prototype.hasOwnProperty.call(book.volumeInfo, "industryIdentifiers")) {
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

          if (Object.prototype.hasOwnProperty.call(book.volumeInfo, "imageLinks")) {
            thumbnail = book.volumeInfo["imageLinks"]["thumbnail"].replace("http://", "https://");
          }

          // Extração dos autores
          let author = "";

          if (Object.prototype.hasOwnProperty.call(book.volumeInfo, "authors")) {
            for (const bookAuthor of book.volumeInfo["authors"]) {
              author += author.length === 0 ? bookAuthor : ", " + bookAuthor;
            }
          }

          const bookObject = {
            ISBN_10: identifiers["ISBN_10"],
            ISBN_13: identifiers["ISBN_13"],
            title: book.volumeInfo["title"] || "",
            subtitle: book.volumeInfo["subtitle"] || "",
            author: author || "",
            publisher: book.volumeInfo["publisher"] || "",
            description: book.volumeInfo["description"] || "",
            thumbnail: thumbnail || "",
          };

          if (isbnOnly) {
            if (identifiers["ISBN_10"] || identifiers["ISBN_13"]) {
              books.push(bookObject);
            }
          } else {
            books.push(bookObject);
          }
        }
      })
      .catch((error) => {
        return failure({
          status: ErrorStatus,
          code: InternalServerError,
          message: error.message,
        });
      });

    return ok({
      status: OkStatus,
      response: {
        books: books,
      },
    });
  },
};
