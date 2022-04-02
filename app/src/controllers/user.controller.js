const PasswordValidator = require("../validators/password.rules");
const EmailValidator = require("../validators/email.rules");
const NameValidator = require("../validators/name.rules");
const UserIdValidator = require("../validators/userid.rules");

const UserBusiness = require("../business/user.business");
const AuthBusiness = require("../business/auth.business");

const validation = require("../modules/validation");

module.exports = {
  async create(req, res, next) {
    try {
      // Aquisição dos parâmetros
      const { name, email, password } = req.body;

      // Construir regras de validação
      const rules = [
        [name, NameValidator],
        [email, EmailValidator],
        [password, PasswordValidator],
      ];

      // Validação dos parâmetros
      const validationResult = validation.run(rules);

      if (validationResult["status"] === "error") {
        return res.status(400).json(validationResult);
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
      // Validaçao do token JWT
      const token = req.headers["x-access-token"];

      const decoded = await AuthBusiness.verifyToken(token);

      if (decoded["status"] === "error") {
        return res.status(400).json(decoded);
      }

      // Aquisição e validação de parâmetros
      const userId = parseInt(req.body["id"]);
      const { email, password } = req.body;

      const rules = [
        [userId, UserIdValidator],
        [email, EmailValidator],
        [password, PasswordValidator],
      ];

      const validationResult = validation.run(rules);

      if (validationResult["status"] === "error") {
        return res.status(400).json(validationResult);
      }

      // Execução da rotina
      const response = await UserBusiness.delete(decoded, userId, email, password);

      return res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  },

  async read(req, res, next) {
    try {
      // Validaçao do token
      const token = req.headers["x-access-token"];

      const decoded = await AuthBusiness.verifyToken(token);

      if (decoded["status"] === "error") {
        return res.status(400).json(decoded);
      }

      // Aquisição e validação de parâmetros
      const userId = parseInt(req.params["id"]);

      const rules = [[userId, UserIdValidator]];

      const validationResult = validation.run(rules);

      if (validationResult["status"] === "error") {
        return res.status(400).json(validationResult);
      }

      const response = await UserBusiness.read(decoded, userId);

      return res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  },
};
