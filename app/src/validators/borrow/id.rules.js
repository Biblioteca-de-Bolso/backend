const validator = require("validator");
const { validationError } = require("../../modules/validation");

module.exports = {
  validate(input, required, allowEmpty) {
    if (input !== undefined && input !== null) input = input.toString();

    if ((input === undefined || input === null) && required) {
      return validationError("É necessário informar o ID do empréstimo.");
    }

    if (input === "" && !allowEmpty) {
      return validationError("É necessário informar o ID do empréstimo.");
    }

    if (input !== undefined && input !== null) {
      if (
        !validator.isInt(input, {
          min: 0,
        })
      ) {
        return validationError("O ID do empréstimo informado não é válido.");
      }
    }

    return {};
  },
};
