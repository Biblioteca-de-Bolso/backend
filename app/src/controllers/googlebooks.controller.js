const GoogleBooksBusines = require("../business/googlebooks.business");
const AuthBusiness = require("../business/auth.business");

const QstringValidator = require("../validators/qstring.rules");
const LangValidator = require("../validators/lang.rules");

const validation = require("../modules/validation");

module.exports = {
  async search(req, res, next) {
    try {
      // Validação do token
      const token = req.headers["x-access-token"];

      const decoded = await AuthBusiness.verifyToken(token);

      if (decoded["status"] === "error") {
        return res.status(400).json(decoded);
      }

      // Aquisição e validação dos parâmetros
      const { qstring, lang } = req.query;

      const rules = [
        [qstring, QstringValidator],
        [lang, LangValidator, { required: false }],
      ];

      const validationResult = validation.run(rules);

      if (validationResult.status === "error") {
        return res.status(400).json(validationResult);
      }

      const response = await GoogleBooksBusines.search(qstring, lang);

      return res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  },
};
