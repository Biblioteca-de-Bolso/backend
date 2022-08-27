const validator = require("validator");
const { validationError } = require("../../modules/validation");

module.exports = {
  validate(input, required, allowEmpty) {
    if (!input && required) {
      return validationError("É necessário inserir um parâmetro de busca.");
    }

    if (input === "" && !allowEmpty) {
      return validationError("É necessário inserir um parâmetro de busca.");
    }

    if (input !== undefined && input !== null) {
      if (input.length > 0) {
        if (
          !validator.isLength(input, {
            min: 1,
            max: 128,
          })
        ) {
          return validationError("O parâmetro de busca deve ter entre 1 e 128 caracteres.");
        }
      }
    }

    return {};
  },
};
