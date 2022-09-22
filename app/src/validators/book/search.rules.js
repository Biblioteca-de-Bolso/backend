const validator = require("validator");
const { validationError } = require("../../modules/validation");

module.exports = {
  validate(input, required, allowEmpty) {
    if ((input === undefined || input === null) && required) {
      return validationError("É necessário informar um conteúdo de busca.");
    }

    if (input === "" && !allowEmpty) {
      return validationError("É necessário informar um conteúdo de busca.");
    }

    if (input !== undefined && input !== null) {
      if (input.length > 0) {
        if (
          !validator.isLength(input, {
            min: 1,
            max: 32,
          })
        ) {
          return validationError("O conteúdo de busca deve ter entre 1 e 32 caracteres.");
        }
      }
    }

    return {};
  },
};
