const validator = require("validator");
const { validationError } = require("../../modules/validation");

module.exports = {
  validate(input, required) {
    if (!input && required) {
      return validationError("É necessário informar o ISBN do livro.");
    }

    if (input !== undefined && input !== null) {
      if (input.length > 0) {
        if (!validator.isISBN(input, 10) && !validator.isISBN(input, 13)) {
          return validationError("O ISBN informado deve obedecer os padrões ISBN 10 ou ISBN 13.");
        }
      }
    }

    return {};
  },
};
