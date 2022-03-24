const validator = require("validator");
const { IncorrectParameter } = require("../modules/codes");

module.exports = {
  validate(name) {
    if (!name) {
      return {
        status: "error",
        code: IncorrectParameter,
        message: "É necesário inserir um nome válido.",
      };
    }

    if (
      !validator.isAlphanumeric(name, "pt-BR", {
        ignore: "' ",
      })
    ) {
      return {
        status: "error",
        code: IncorrectParameter,
        message: "O nome informado não deve possuir caracteres especiais.",
      };
    }

    if (
      !validator.isLength(name, {
        min: 3,
        max: 64,
      })
    ) {
      return {
        status: "error",
        error: IncorrectParameter,
        message: "O nome informado precisa ter entre 3 e 64 caracteres.",
      };
    }

    return {};
  },
};
