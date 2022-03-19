const validator = require("validator");

module.exports = {
  validate(userId) {
    if (!userId) {
      return {
        error: "Parâmetro incorreto",
      };
    }

    if (!validator.isDecimal(userId)) {
      return {
        error: "Parâmetro incorreto",
      };
    }

    return {};
  },
};
