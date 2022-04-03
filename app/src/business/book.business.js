const { ok } = require("../modules/http");
const prisma = require("../prisma");
const validator = require("validator");
const { convert } = require("../modules/isbn");

module.exports = {
  async create(decoded, author, isbn, publisher, description, thumbnail) {
    const userId = decoded["userId"];

    // Executa verificação de ISBN informado
    let isbn_10 = "";
    let isbn_13 = "";

    if (validator.isISBN(isbn, 10)) isbn_10 = isbn;
    else if (validator.isISBN(isbn, 13)) isbn_13 = isbn;

    if (isbn_10 && !isbn_13) isbn_13 = convert(isbn_10);
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
