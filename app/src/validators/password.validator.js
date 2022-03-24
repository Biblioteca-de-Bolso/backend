const validator = require("validator");
const { IncorrectParameter } = require("../modules/codes");

module.exports = {
  validate(password) {
    if (!password) {
      return {
        status: "error",
        code: IncorrectParameter,
        message: "É necesário inserir uma senha válida.",
      };
    }

    if (!validator.isLength(password, { min: 8, max: 32 })) {
      return {
        status: "error",
        code: IncorrectParameter,
        message: "A senha precisa ter entre 8 e 32 caracteres.",
      };
    }

    if (validator.contains(password, " ")) {
      return {
        status: "error",
        code: IncorrectParameter,
        message: "A senha informada não deve possuir espaços.",
      };
    }

    if (
      !validator.isAlphanumeric(password, "pt-BR", {
        ignore: "~`!@#$%^&*()_-+={[}]|:;\"'<,>.?/",
      })
    ) {
      return {
        status: "error",
        code: IncorrectParameter,
        message: `Apenas os seguintes caracteres especiais são permitidos: ~\`!@#$%^&*()_-+={[}]|:;\"'<,>.?/`,
      };
    }
    return {};
  },
};
