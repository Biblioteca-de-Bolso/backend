const validator = require("validator");
const { validationError } = require("../../modules/validation");

module.exports = {
  validate(input, required, allowEmpty) {
    if ((input === undefined || input === null) && required) {
      return validationError("É necessário informar a URL para capa do livro.");
    }

    if (input === "" && !allowEmpty) {
      return validationError("É necessário informar a URL para capa do livro.");
    }

    if (input !== undefined && input !== null) {
      if (input.length > 0) {
        if (
          !validator.isLength(input, {
            min: 1,
            max: 255,
          })
        ) {
          return validationError("A URL para capa do livro deve ter entre 1 e 255 caracteres.");
        }

        if (!validator.isURL(input)) {
          return validationError("A URL de capa do livro informada não é válida.");
        }
      }
    }

    return {};
  },
};
