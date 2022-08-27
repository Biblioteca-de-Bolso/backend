const validator = require("validator");
const { validationError } = require("../../modules/validation");

module.exports = {
  validate(input, required, allowEmpty) {
    if ((input === undefined || input === null) && required) {
      return validationError("É necessário informar um código de ativação.");
    }

    if (input === "" && !allowEmpty) {
      return validationError("É necessário informar um código de ativação.");
    }

    if (input !== undefined && input !== null) {
      if (input.length > 0) {
        if (!validator.isAlphanumeric(input)) {
          return validationError("O código de ativação informado não é válido.");
        }

        if (!validator.isLength(input, { min: 16, max: 16 })) {
          return validationError("O código de ativação informado não é válido.");
        }
      }
    }

    return {};
  },
};
