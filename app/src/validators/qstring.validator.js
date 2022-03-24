const { IncorrectParameter } = require("../modules/codes");

module.exports = {
  validate(qstring) {
    if (!qstring) {
      return {
        status: "error",
        code: IncorrectParameter,
        message: "É necesário inserir um parâmetro de busca.",
      };
    }
    return {};
  },
};
