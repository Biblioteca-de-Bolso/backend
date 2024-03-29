const validator = require("validator");
const { validationError } = require("../../modules/validation");

module.exports = {
  validate(input, required, allowEmpty) {
    if ((input === undefined || input === null) && required) {
      return validationError("É necessário informar um nome de usuário.");
    }

    if (input === "" && !allowEmpty) {
      return validationError("É necessário informar um nome de usuário.");
    }

    if (input !== undefined && input !== null) {
      if (input.length > 0) {
        if (
          !validator.isAlphanumeric(input, "pt-BR", {
            ignore: "' ",
          })
        ) {
          return validationError("O nome de usuário não deve possuir caracteres especiais.");
        }

        if (
          !validator.isLength(input, {
            min: 3,
            max: 64,
          })
        ) {
          return validationError("O nome de usuário deve ter entre 3 e 64 caracteres.");
        }
      }
    }

    return {};
  },
};
