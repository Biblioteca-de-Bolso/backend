const { IncorrectParameter } = require("../modules/codes");

module.exports = {
  validate(qstring) {
    if (!qstring) {
      return {
        code: IncorrectParameter,
        error: "Parâmetro incorreto ou mal formatado",
        message: "É necesário inserir uma parâmetro de busca",
      };
    }
    return {};
  },
};
