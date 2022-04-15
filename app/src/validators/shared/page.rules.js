const validator = require("validator");
const { validationError } = require("../../modules/validation");

module.exports = {
  validate(input, required) {
    if (!input && required) {
      return validationError("É necessário informar um número de página.");
    }

    if (input) {
      if (
        !validator.isInt(input.toString(), {
          min: 0,
        })
      ) {
        return validationError("O número de página informado não é válido.");
      }
    }

    return {};
  },
};
