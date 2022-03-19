const BookBusiness = require("../business/book.business");
const AuthBusiness = require("../business/auth.business");

const { fileName } = require("../modules/debug");
const { badRequest, unauthorized } = require("../modules/http");
const { Unauthorized } = require("../modules/codes");

module.exports = {
  async list(req, res, next) {
    try {
      // Parse de parâmetros e Token
      const token = req.headers["x-access-token"];

      if (!token) {
        console.log(fileName(), "Nenhum token de autenticação informado");

        return badRequest({
          message: "Nenhum token de autenticação informado.",
        });
      }

      // Validação do token informado
      const decoded = await AuthBusiness.verifyToken(token);

      if (decoded["error"]) {
        return unauthorized({
          code: Unauthorized,
          message: decoded["error"],
        });
      }

      // Token validado, prosseguir com a requisição
      const response = await BookBusiness.list();

      // Retornar com resultado da operação
      return ok(response.body);
    } catch (error) {
      next(error);
    }
  },
};
