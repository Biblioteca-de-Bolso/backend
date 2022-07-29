const validator = require("validator");
const { validationError } = require("../../modules/validation");

module.exports = {
  validate(input, required) {
    if (!input && required) {
      return validationError(
        "É necessário informar uma referência de página, capítulo, localização, etc."
      );
    }

    if (input) {
      if (
        !validator.isLength(input, {
          min: 1,
          max: 128,
        })
      ) {
        return validationError("A referência informada informado não é válida.");
      }
    }

    return {};
  },
};
