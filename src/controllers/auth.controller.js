var path = require("path");

const AuthBusiness = require("../business/auth.business");

const PasswordValidator = require("../validators/password.validator");
const EmailValidator = require("../validators/email.validator");
const ActivationValidator = require("../validators/activation.validator");
const UserIdValidator = require("../validators/userid.validator");

const http = require("../modules/http");

module.exports = {
  async login(req, res, next) {
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
      next(error);
    }
  },

  async verifyAccount(req, res, next) {
    try {
      const userId = req.query["id"];
      const email = req.query["email"];
      const activationCode = req.query["code"];

      // Validação dos parâmetros
      const validateId = UserIdValidator.validate(userId);
      const validateEmail = EmailValidator.validate(email);
      const validateActivation = ActivationValidator.validate(activationCode);

      if (validateId.error || validateEmail.error || validateActivation.error) {
        res.status(400);
        return res.sendFile(path.resolve("./src/html/confirm_error.html"));
      }

      const response = await AuthBusiness.verifyAccount(userId, email, activationCode);

      if (response.error) {
        res.status(400);
        return res.sendFile(path.resolve("./src/html/confirm_error.html"));
      } else {
        res.status(200);
        return res.sendFile(path.resolve("./src/html/confirm_success.html"));
      }
    } catch (error) {
      next(error);
    }
  },

  async refreshToken(req, res, next) {
    try {
      return http.ok(res, {
        message: "ok",
      });
    } catch (error) {
      next(error);
    }
  },
};
