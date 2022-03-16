const validator = require("validator");

const filename = __filename.slice(__dirname.length + 1) + " -";

module.exports = {
  validate(code) {
    if (!code) {
      return {
        error: "Parâmetro incorreto",
      };
    }

    if (!validator.isAlphanumeric(code)) {
      return {
        error: "Parâmetro incorreto",
      };
    }

    if (!validator.isLength(code, { min: 16, max: 16 })) {
      return {
        error: "Parâmetro incorreto",
      };
    }

    return {};
  },
};
