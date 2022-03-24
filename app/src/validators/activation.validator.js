const validator = require("validator");
const { IncorrectParameter } = require("../modules/codes");

module.exports = {
  validate(code) {
    if (!code) {
      return {
        status: "error",
        code: IncorrectParameter,
        message: "É necessário informar um código de ativação.",
      };
    }

    if (!validator.isAlphanumeric(code)) {
      return {
        status: "error",
        code: IncorrectParameter,
        message: "O código de ativação informado não é válido.",
      };
    }

    if (!validator.isLength(code, { min: 16, max: 16 })) {
      return {
        status: "error",
        code: IncorrectParameter,
        message: "O código de ativação informado não é válido.",
      };
    }

    return {};
  },
};
