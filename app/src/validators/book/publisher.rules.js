const validator = require("validator");
const { validationError } = require("../../modules/validation");

module.exports = {
  validate(input, required) {
    if (!input && required) {
      return validationError("É necessário informar a editora do livro.");
    }

    if (input) {
      if (
        !validator.isLength(input, {
          min: 1,
          max: 128,
        })
      ) {
        return validationError("A editora do livro deve ter entre 1 e 128 caracteres.");
      }
    }

    return {};
  },
};
