const { IncorrectParameter } = require("./codes");

function validationError(message) {
  return {
    status: "error",
    code: IncorrectParameter,
    message: message,
  };
}

function run(rules) {
  for (const [field, rule, options] of rules) {
    let required = true;
    let allowEmpty = true;

    if (options) {
      if (Object.prototype.hasOwnProperty.call(options, "required")) required = options["required"];
      if (Object.prototype.hasOwnProperty.call(options, "allowEmpty"))
        allowEmpty = options["allowEmpty"];
    }

    const result = rule.validate(field, required, allowEmpty);

    const error = result["status"] === "error";

    if (error) return result;
  }

  return {};
}

module.exports = { validationError, run };
