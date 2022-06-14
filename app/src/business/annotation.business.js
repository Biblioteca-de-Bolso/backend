const { OkStatus } = require("../modules/codes");
const { ok } = require("../modules/http");

module.exports = {
  async create(token, bookId, title, text, page) {
    return ok({
      status: OkStatus,
      response: {
        annotation: {
          message: "ok",
        },
      },
    });
  },
};
