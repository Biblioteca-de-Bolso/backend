const validator = require("validator");
const { IncorrectParameter } = require("../modules/codes");

module.exports = {
  validate(userId) {
    if (!userId) {
      return {
        status: "error",
        code: IncorrectParameter,
        message: "É necessário informar um ID de usuário.",
      };
    }

    if (!validator.isDecimal(userId)) {
      return {
        status: "error",
        code: IncorrectParameter,
        message: "O ID de usuário informado não é válido.",
      };
    }

    return {};
  },
};
