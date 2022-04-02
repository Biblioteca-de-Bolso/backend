const validator = require("validator");
const { IncorrectParameter } = require("../modules/codes");

module.exports = {
  validate(email) {
    if (!email) {
      return {
        status: "error",
        code: IncorrectParameter,
        message: "O formato do email inserido não é válido.",
      };
    }

    if (!validator.isEmail(email)) {
      return {
        status: "error",
        code: IncorrectParameter,
        message: "O formato do email inserido não é válido.",
      };
    }

    return {};
  },
};
