const validator = require("validator");
const { validationError } = require("../../modules/validation");

module.exports = {
  validate(input, required, allowEmpty) {
    if ((input === undefined || input === null) && required) {
      return validationError("É necessário informar a situação de leitura do livro.");
    }

    if (input === "" && !allowEmpty) {
      return validationError("É necessário informar a situação de leitura do livro.");
    }

    if (input !== undefined && input !== null) {
      if (input.length > 0) {
        const validBorrows = ["PLANNING", "READING", "CONCLUDED", "DROPPED"];

        if (!validBorrows.includes(input)) {
          return validationError("A situação de leitura informada não é válida.");
        }
      }
    }

    return {};
  },
};
