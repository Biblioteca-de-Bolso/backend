const validator = require("validator");
const { IncorrectParameter } = require("../modules/codes");

module.exports = {
  validate(email) {
    if (!email) {
      return {
        status: "error",
        code: IncorrectParameter,
        message: "É necesário inserir um email válido.",
      };
    }

    if (!validator.isEmail(email)) {
      return {
        status: "error",
        code: IncorrectParameter,
        message: "É necesário inserir um email válido.",
      };
    }

    return {};
  },
};
