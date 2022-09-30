const path = require("path");

const AuthBusiness = require("../business/auth.business");

const PasswordValidator = require("../validators/user/password.rules");
const EmailValidator = require("../validators/user/email.rules");
const ActivationValidator = require("../validators/user/activation.rules");
const UserIdValidator = require("../validators/user/id.rules");
const RefreshTokenValidator = require("../validators/auth/refresh.rules");

const validation = require("../modules/validation");

module.exports = {
  async login(req, res, next) {
    try {
      // Aquisição e validação dos parâmetros
      const { email, password } = req.body;

      const rules = [
        [email, EmailValidator, { required: true, allowEmpty: false }],
        [password, PasswordValidator, { required: true, allowEmpty: false }],
      ];

      const validationResult = validation.run(rules);

      if (validationResult["status"] === "error") {
        return res.status(400).json(validationResult);
      }

      // Validação dos parâmetros finalizada, realiza procedimento de login
      const response = await AuthBusiness.login(email, password);

      // Retorna resultado da operação
      return res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  },

  async verifyAccount(req, res, next) {
    try {
      // Aquisição e validação dos parâmetros
      const userId = parseInt(req.query["id"], 10);
      const email = req.query["email"];
      const activationCode = req.query["code"];

      const rules = [
        [userId, UserIdValidator, { required: true, allowEmpty: false }],
        [email, EmailValidator, { required: true, allowEmpty: false }],
        [activationCode, ActivationValidator, { required: true, allowEmpty: false }],
      ];

      const validationResult = validation.run(rules);

      if (validationResult["status"] === "error") {
        res.status(400);
        return res.sendFile(path.resolve("./src/html/confirm_error.html"));
      }

      // Validação dos parâmetros finalizada
      const response = await AuthBusiness.verifyAccount(userId, email, activationCode);

      if (response.status === "error") {
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
      // Aquisição do token
      const { token } = req;

      // Aquisição e validação dos parâmetros
      const { refreshToken } = req.body;

      const rules = [[refreshToken, RefreshTokenValidator, { required: true, allowEmpty: false }]];

      const validationResult = validation.run(rules);

      if (validationResult["status"] === "error") {
        return res.status(400).json(validationResult);
      }

      const response = await AuthBusiness.refreshToken(token, refreshToken);

      return res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  },

  async recoverPassword(req, res, next) {
    try {
      const { email } = req.body;

      const rules = [[email, EmailValidator, { required: true, allowEmpty: false }]];

      const validationResult = validation.run(rules);

      if (validationResult["status"] === "error") {
        return res.status(400).json(validationResult);
      }

      const response = await AuthBusiness.recoverPassword(email);

      return res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  },

  async changePassword(req, res, next) {
    try {
    } catch (error) {
      next(error);
    }
  },
};
