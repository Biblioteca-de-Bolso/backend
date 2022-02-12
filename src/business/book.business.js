const jwt = require("jsonwebtoken");
const http = require("../modules/http");

const filename = __filename.slice(__dirname.length + 1) + " -";

module.exports = {
  async list() {
    return http.ok({
      message: "ok"
    });
  },
};
