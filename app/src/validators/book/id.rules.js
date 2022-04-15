const validator = require("validator");
const { validationError } = require("../../modules/validation");

module.exports = {
  validate(input, required) {
    if (!input && required) {
      return validationError("É necessário informar o ID do livro.");
    }

    if (input) {
      if (
        !validator.isInt(input.toString(), {
          min: 0,
        })
      ) {
        return validationError("O ID do livro informado não é válido.");
      }
    }

    return {};
  },
};
