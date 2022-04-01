const BookBusiness = require("../business/book.business");
const AuthBusiness = require("../business/auth.business");

const { Unauthorized, IncorrectParameter } = require("../modules/codes");

module.exports = {
  async create(req, res, next) {
    try {
      // Parse de parâmetros e Token
      const token = req.headers["x-access-token"];

      // Validação do token informado
      const decoded = await AuthBusiness.verifyToken(token);

      if (decoded["status"] === "error") {
        return res.status(400).json(decoded);
      }

      // Extração dos parâmetros
    } catch (error) {
      return next(error);
    }
  },

  async list(req, res, next) {
    try {
      // Parse de parâmetros e Token
      const token = req.headers["x-access-token"];

      // Validação do token informado
      const decoded = await AuthBusiness.verifyToken(token);

      if (decoded["status"] === "error") {
        return res.status(400).json(decoded);
      }

      // Token validado, prosseguir com a requisição
      const response = await BookBusiness.list();

      // Retornar com resultado da operação
      return res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  },
};
