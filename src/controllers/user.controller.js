const validator = require("validator");

const PasswordValidator = require("../validators/password.validator");
const EmailValidator = require("../validators/email.validator");
const NameValidator = require("../validators/name.validator");
const userBusiness = require("../business/user.business");

const UserBusiness = require("../business/user.business");

const http = require("../modules/http");
const filename = __filename.slice(__dirname.length + 1) + " -";

module.exports = {
  async create(req, res) {
    try {
      // Aquisição dos parâmetros
      const name = req.body["name"];
      const email = req.body["email"];
      const password = req.body["password"];

      // Validação dos parâmetros
      const validateEmail = EmailValidator.validate(email);
      const validatePassword = PasswordValidator.validate(password);
      const validateName = NameValidator.validate(name);

      if (validatePassword.error) {
        return http.badRequest(res, validatePassword);
      }

      if (validateEmail.error) {
        return http.badRequest(res, validateEmail);
      }

      if (validateName.error) {
        return http.badRequest(res, validateName);
      }

      // Validação dos parâmetros finalizada
      const response = await UserBusiness.create(email, name, password);

      // Retorna o resultado da operação
      return http.generic(res, response);
    } catch (error) {
      return http.failure(res, {
        message: `Erro inesperado: ${error.message}`,
      });
    }
  },
};
