const validator = require("validator");
const { validationError } = require("../../modules/validation");

module.exports = {
  validate(input, required, allowEmpty) {
    if ((input === undefined || input === null) && required) {
      return validationError("É necessário informar o conteúdo da anotação.");
    }

    if (input === "" && !allowEmpty) {
      return validationError("É necessário informar o conteúdo da anotação.");
    }

    if (input !== undefined && input !== null) {
      if (input.length > 0) {
        if (
          !validator.isLength(input, {
            min: 1,
            max: 5000,
          })
        ) {
          return validationError("O conteúdo da anotação deve ter entre 1 e 5000 caracteres.");
        }
      }
    }

    return {};
  },
};
