const validator = require("validator");
const { validationError } = require("../../modules/validation");

module.exports = {
  validate(input, required, allowEmpty) {
    if ((input === undefined || input === null) && required) {
      return validationError("É necessário informar o título do livro.");
    }

    if (input === "" && !allowEmpty) {
      return validationError("É necessário informar o título do livro.");
    }

    if (input !== undefined && input !== null) {
      if (input.length > 0) {
        if (
          !validator.isLength(input, {
            min: 1,
            max: 128,
          })
        ) {
          return validationError("O título do livro deve ter entre 1 e 128 caracteres.");
        }
      }
    }

    return {};
  },
};
