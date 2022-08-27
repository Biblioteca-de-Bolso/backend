const validator = require("validator");
const { validationError } = require("../../modules/validation");

module.exports = {
  validate(input, required, allowEmpty) {
    if ((input === undefined || input === null) && required) {
      return validationError(
        "É necessário informar uma referência de página, capítulo, localização, etc."
      );
    }

    if (input === "" && !allowEmpty) {
      return validationError(
        "É necessário informar uma referência de página, capítulo, localização, etc."
      );
    }

    if (input !== undefined && input !== null) {
      if (input.length > 0) {
        if (
          !validator.isLength(input, {
            max: 128,
          })
        ) {
          return validationError("A referência informada informado não é válida.");
        }
      }
    }

    return {};
  },
};
