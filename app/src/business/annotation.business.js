const { ok } = require("../modules/http");

module.exports = {
  async create(token, bookId, title, text, page) {
    return ok({
      status: "ok",
      response: {
        annotation: {
          message: "ok",
        },
      },
    });
  },
};
