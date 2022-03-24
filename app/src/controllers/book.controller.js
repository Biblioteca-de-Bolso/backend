const BookBusiness = require("../business/book.business");
const AuthBusiness = require("../business/auth.business");

const { badRequest, unauthorized } = require("../modules/http");
const { Unauthorized, IncorrectParameter } = require("../modules/codes");

module.exports = {
  async list(req, res, next) {
    try {
      // Parse de parâmetros e Token
      const token = req.headers["x-access-token"];

      if (!token) {
        res.status(400).json({
          status: "error",
          code: IncorrectParameter,
          message: "Nenhum token de autenticação informado.",
        });
      }

      // Validação do token informado
      const decoded = await AuthBusiness.verifyToken(token);

      if (decoded["error"]) {
        res.status(400).json({
          status: "error",
          code: Unauthorized,
          message: decoded["error"],
        });
      }

      // Token validado, prosseguir com a requisição
      const response = await BookBusiness.list();

      // Retornar com resultado da operação
      res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  },
};
