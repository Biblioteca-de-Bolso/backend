const GoogleBooksBusines = require("../business/googlebooks.business");
const AuthBusiness = require("../business/auth.business");
const { IncorrectParameter, Unauthorized } = require("../modules/codes");

const QstringValidator = require("../validators/qstring.validator");

module.exports = {
  async search(req, res, next) {
    try {
      // Parse do Token
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
        res.status(401).json({
          status: "error",
          code: Unauthorized,
          message: decoded["error"],
        });
      }

      // Parse dos parâmetros
      const qstring = req.query["qstring"];
      const langRestrict = req.query["lang"];

      const validateQstring = QstringValidator.validate(qstring);

      if (validateQstring.status === "error") {
        res.status(400).json(validateQstring);
      }

      // Token validado, prosseguir com a requisição
      const response = await GoogleBooksBusines.search(qstring, langRestrict);

      // Retornar com resultado da operação
      res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  },
};
