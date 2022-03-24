const { Success } = require("../modules/codes");
const { ok } = require("../modules/http");
const { googleBooksAPI } = require("../modules/googlebooks");

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
          // Identificação dos ISBN 10 e 13
          let ibsn_10 = "";
          let isbn_13 = "";

          for (const isbn of book.volumeInfo["industryIdentifiers"]) {
            if (isbn["identifier"].length == 10) ibsn_10 = isbn["identifier"];
            else if (isbn["identifier"].length == 13) isbn_13 = isbn["identifier"];
          }

          // Identificação da capa do livro
          let thumbnail = "";

          if (book.volumeInfo.hasOwnProperty("imageLinks")) {
            thumbnail = book.volumeInfo["imageLinks"]["thumbnail"];
          }

          books.push({
            ibsn_10: ibsn_10,
            isbn_13: isbn_13,
            title: book.volumeInfo["title"],
            author: book.volumeInfo["authors"][0],
            publisher: book.volumeInfo["publisher"],
            publishedDate: book.volumeInfo["publishedDate"],
            description: book.volumeInfo["description"],
            thumbnail: thumbnail,
          });
        }
      })
      .catch((error) => {
        console.log("Erro:", error.name, error.message);
      });

    return ok({
      code: "ok",
      response: {
        books: books,
      },
    });
  },
};
