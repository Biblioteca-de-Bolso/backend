const { ok } = require("../modules/http");

module.exports = {
  async list() {
    return ok({
      message: "Ok",
    });
  },
};
