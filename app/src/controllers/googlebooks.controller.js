const GoogleBooksBusines = require("../business/googlebooks.business");
const AuthBusiness = require("../business/auth.business");
const { IncorrectParameter, Unauthorized } = require("../modules/codes");

const QstringValidator = require("../validators/qstring.validator");

module.exports = {
  async search(req, res, next) {
    try {
      // Parse de parâmetros e Token
      const token = req.headers["x-access-token"];

      // Validação do token informado
      const decoded = await AuthBusiness.verifyToken(token);

      if (decoded["status"] === "error") {
        return res.status(400).json(decoded);
      }

      // Parse dos parâmetros
      const qstring = req.query["qstring"];
      const langRestrict = req.query["lang"];

      const validateQstring = QstringValidator.validate(qstring);

      if (validateQstring.status === "error") {
        return res.status(400).json(validateQstring);
      }

      // Token validado, prosseguir com a requisição
      const response = await GoogleBooksBusines.search(qstring, langRestrict);

      // Retornar com resultado da operação
      return res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  },
};
