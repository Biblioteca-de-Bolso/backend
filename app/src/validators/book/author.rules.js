const validator = require("validator");
const { validationError } = require("../../modules/validation");

module.exports = {
  validate(input, required) {
    if (!input && required) {
      return validationError("É necessário informar o(s) autor(es) do livro.");
    }

    if (input !== undefined && input !== null) {
      if (input.length > 0) {
        if (
          !validator.isLength(input, {
            min: 1,
            max: 128,
          })
        ) {
          return validationError("O(s) autor(es) do livro devem ter entre 1 e 128 caracteres.");
        }
      }
    }

    return {};
  },
};
