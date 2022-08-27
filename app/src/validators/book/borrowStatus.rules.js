const validator = require("validator");
const { validationError } = require("../../modules/validation");

module.exports = {
  validate(input, required, allowEmpty) {
    if ((input === undefined || input === null) && required) {
      return validationError("É necessário informar a situação de empréstimo do livro.");
    }

    if (input === "" && !allowEmpty) {
      return validationError("É necessário informar o título do livro.");
    }

    if (input !== undefined && input !== null) {
      if (input.length > 0) {
        const validBorrows = ["PENDING", "RETURNED"];

        if (!validBorrows.includes(input)) {
          return validationError("A situação de empréstimo informada não é válida.");
        }
      }
    }

    return {};
  },
};
