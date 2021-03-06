const validator = require("validator");
const { validationError } = require("../../modules/validation");

module.exports = {
  validate(input, required) {
    if (!input && required) {
      return validationError("É necessário informar o título da anotação.");
    }

    if (input) {
      if (
        !validator.isLength(input, {
          min: 1,
          max: 128,
        })
      ) {
        return validationError("O título da anotação deve ter entre 1 e 128 caracteres.");
      }
    }

    return {};
  },
};
