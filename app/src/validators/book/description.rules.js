const validator = require("validator");
const { validationError } = require("../../modules/validation");

module.exports = {
  validate(input, required) {
    if (!input && required) {
      return validationError("É necessário informar a descrição do livro.");
    }

    if (input) {
      if (
        !validator.isLength(input, {
          min: 1,
          max: 5000,
        })
      ) {
        return validationError("A descrição do livro deve ter entre 1 e 5000 caracteres.");
      }
    }

    return {};
  },
};
