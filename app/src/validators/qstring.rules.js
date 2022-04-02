const { validationError } = require("../modules/validation");

module.exports = {
  validate(input, required) {
    if (!input && required) {
      return validationError("É necessário inserir um parâmetro de busca.");
    }

    return {};
  },
};
