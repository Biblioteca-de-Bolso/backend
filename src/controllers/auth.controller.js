const AuthBusiness = require("../business/auth.business");

const PasswordValidator = require("../validators/password.validator");
const EmailValidator = require("../validators/email.validator");

const http = require("../modules/http");

const filename = __filename.slice(__dirname.length + 1) + " -";

module.exports = {
  async login(req, res) {
    try {
      // Aquisição dos parâmetros
      const email = req.body["email"];
      const password = req.body["password"];

      // Validação dos parâmetros
      const validateEmail = EmailValidator.validate(email);
      const validatePassword = PasswordValidator.validate(password);

      if (validatePassword.error) {
        return http.badRequest(res, validatePassword);
      }

      if (validateEmail.error) {
        return http.badRequest(res, validateEmail);
      }

      // Validação dos parâmetros finalizada, realiza procedimento de login
      const response = await AuthBusiness.login(email, password);

      // Retorna resultado da operação
      return http.generic(res, response);
      
    } catch (error) {
      return http.failure(res, {
        message: `Erro Inesperado: ${error.message}`,
      });
    }
  },

  async refreshToken(req, res) {
    return http.ok(res, {
      message: "ok",
    });
  },

  async createToken(req, res) {
    const response = await AuthBusiness.createToken({
      userId: "123",
      user: "rhenan",
    });

    return http.generic(res, response);
  },
};
