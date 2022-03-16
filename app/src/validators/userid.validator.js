const validator = require("validator");

const filename = __filename.slice(__dirname.length + 1) + " -";

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
