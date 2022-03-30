const PasswordValidator = require("../validators/password.validator");
const EmailValidator = require("../validators/email.validator");
const NameValidator = require("../validators/name.validator");
const UserIdValidator = require("../validators/userid.validator");

const UserBusiness = require("../business/user.business");
const AuthBusiness = require("../business/auth.business");

const http = require("../modules/http");
const { Unauthorized } = require("../modules/codes");

module.exports = {
  async create(req, res, next) {
    try {
      // Aquisição dos parâmetros
      const name = req.body["name"];
      const email = req.body["email"];
      const password = req.body["password"];

      // Validação dos parâmetros
      const validateName = NameValidator.validate(name);
      const validateEmail = EmailValidator.validate(email);
      const validatePassword = PasswordValidator.validate(password);

      if (validatePassword.status === "error") {
        return res.status(400).json(validatePassword);
      }

      if (validateEmail.status === "error") {
        return res.status(400).json(validateEmail);
      }

      if (validateName.status === "error") {
        return res.status(400).json(validateName);
      }

      // Validação dos parâmetros finalizada
      const response = await UserBusiness.create(email, name, password);

      return res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  },

  async delete(req, res, next) {
    try {
      // Aquisição do token de autenticação
      const token = req.headers["x-access-token"];

      // Validação do token informado
      const decoded = await AuthBusiness.verifyToken(token);

      if (decoded["error"]) {
        return res.status(401).json({
          status: "error",
          code: Unauthorized,
          message: decoded["error"],
        });
      }

      // Aquisição dos parâmetros
      const userId = req.body["id"];
      const email = req.body["email"];
      const password = req.body["password"];

      // Validação dos parâmetros
      const validateUserId = UserIdValidator.validate(userId);
      const validateEmail = EmailValidator.validate(email);
      const validatePassword = PasswordValidator.validate(password);

      if (validateUserId.status === "error") {
        return res.status(400).json(validateUserId);
      }

      if (validateEmail.status === "error") {
        return res.status(400).json(validateEmail);
      }

      if (validatePassword.status === "error") {
        return res.status(400).json(validatePassword);
      }

      const response = await UserBusiness.delete(decoded, userId, email, password);

      return res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  },
};
