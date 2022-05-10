const GoogleBooksBusines = require("../business/googlebooks.business");

const QstringValidator = require("../validators/googlebooks/qstring.rules");
const LangValidator = require("../validators/googlebooks/lang.rules");

const validation = require("../modules/validation");

module.exports = {
  async search(req, res, next) {
    try {
      // Aquisição e validação dos parâmetros
      const { qstring, lang, maturity, printType, orderBy, isbnOnly } = req.query;

      const rules = [
        [qstring, QstringValidator],
        [lang, LangValidator, { required: false }],
      ];

      const validationResult = validation.run(rules);

      if (validationResult.status === "error") {
        return res.status(400).json(validationResult);
      }

      const response = await GoogleBooksBusines.search(
        qstring,
        lang,
        maturity,
        printType,
        orderBy,
        isbnOnly
      );

      return res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  },
};
