const validator = require("validator");
const { validationError } = require("../../modules/validation");

module.exports = {
  validate(input, required) {
    if (!input && required) {
      return validationError("É necessário informar um endereço de email.");
    }

    if (input !== undefined && input !== null) {
      if (input.length > 0) {
        if (!validator.isEmail(input)) {
          return validationError("O formato de email inserido não é válido.");
        }
      }
    }

    return {};
  },
};
