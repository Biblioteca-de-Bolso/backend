const validator = require("validator");
const { validationError } = require("../../modules/validation");

module.exports = {
  validate(input, required, allowEmpty) {
    if (!input && required) {
      return validationError("É necessário inserir o nome de um contato.");
    }

    if (input === "" && !allowEmpty) {
      return validationError("É necessário inserir o nome de um contato.");
    }

    if (input !== undefined && input !== null) {
      if (input.length > 0) {
        if (
          !validator.isLength(input, {
            min: 1,
            max: 64,
          })
        ) {
          return validationError("O nome de contato deve ter entre 1 e 64 caracteres.");
        }
      }
    }

    return {};
  },
};
