const { ok } = require("../modules/http");

module.exports = {
  async list() {
    return ok({
      status: "ok",
      response: {
        message: "ok",
      },
    });
  },
};
