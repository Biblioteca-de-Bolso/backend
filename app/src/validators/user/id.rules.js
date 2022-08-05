const validator = require("validator");
const { validationError } = require("../../modules/validation");

module.exports = {
  validate(input, required) {
    if (!input && required) {
      return validationError("É necessário informar o ID do usuário.");
    }

    if (input !== undefined && input !== null) {
      if (
        !validator.isInt(input.toString(), {
          min: 0,
        })
      ) {
        return validationError("O ID do usuário informado não é válido.");
      }
    }

    return {};
  },
};
