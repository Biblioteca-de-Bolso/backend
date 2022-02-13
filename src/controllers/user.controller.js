const UserBusiness = require("../business/user.business");
const http = require("../modules/http");

const filename = __filename.slice(__dirname.length + 1) + " -";

module.exports = {
  async create(req, res) {},

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
      const response = await UserBusiness.login(user, password);

      // Retorna resultado da operação
      return http.ok(res, response.body);
    } catch (error) {
      console.log(filename, `Erro durante o login: ${error.message}`);

      return http.failure(res, {
        message: `Erro durante o login: ${error.message}`,
      });
    }
  },
};
