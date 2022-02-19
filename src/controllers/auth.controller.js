const AuthBusiness = require("../business/auth.business");

const http = require("../modules/http");

const filename = __filename.slice(__dirname.length + 1) + " -";

module.exports = {
  async login(req, res) {
    try {
      // Realiza parse dos parâmetros
      const user = req.body.user;
      const password = req.body.password;

      if (!user || !password) {
        console.log(
          filename,
          "Para realizar login, é necessário informar um usuário e uma senha"
        );

        return http.badRequest(res, {
          message: "Para realizar login, é necessário informar um usuário e uma senha",
        });
      }

      // Realiza procedimento de login
      const response = await AuthBusiness.login(user, password);

      // Retorna resultado da operação
      return http.generic(res, response);

    } catch (error) {
      return http.failure(res, {
        message: `Erro Inesperado: ${error.message}`,
      });
    }
  },

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
