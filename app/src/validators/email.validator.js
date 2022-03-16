const validator = require("validator");

const filename = __filename.slice(__dirname.length + 1) + " -";

module.exports = {
  validate(email) {
    if (!email) {
      return {
        error: "Parâmetro incorreto",
        message: "É necesário inserir um email válido",
      };
    }

    if (!validator.isEmail(email)) {
      return {
        error: "Parâmetro incorreto",
        message: "É necesário inserir um email válido",
      };
    }

    return {};
  },
};
