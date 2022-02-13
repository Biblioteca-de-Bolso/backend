const AuthBusiness = require("../business/auth.business");

const http = require("../modules/http");

module.exports = {
  async refreshToken(req, res) {
    return http.ok(res, {
      message: "ok",
    });
  },

  async createToken(req, res) {
    const response = await AuthBusiness.createToken({
      userId: "123",
      user: "rhenan",
    });

    return http.generic(res, response);
  },
};
