const PasswordValidator = require("../validators/user/password.rules");
const EmailValidator = require("../validators/user/email.rules");
const NameValidator = require("../validators/user/name.rules");
const UserIdValidator = require("../validators/user/id.rules");

const UserBusiness = require("../business/user.business");

const validation = require("../modules/validation");

module.exports = {
  async create(req, res, next) {
    try {
      // Aquisição dos parâmetros
      const { name, email, password } = req.body;

      // Construir regras de validação
      const rules = [
        [name, NameValidator, { required: true, allowEmpty: false }],
        [email, EmailValidator, { required: true, allowEmpty: false }],
        [password, PasswordValidator, { required: true, allowEmpty: false }],
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
      // Aquisição do token
      const { token } = req;

      // Aquisição e validação de parâmetros
      const userId = parseInt(req.body["id"], 10);
      const { email, password } = req.body;

      const rules = [
        [userId, UserIdValidator, { required: true, allowEmpty: false }],
        [email, EmailValidator, { required: true, allowEmpty: false }],
        [password, PasswordValidator, { required: true, allowEmpty: false }],
      ];

      const validationResult = validation.run(rules);

      if (validationResult["status"] === "error") {
        return res.status(400).json(validationResult);
      }

      // Execução da rotina
      const response = await UserBusiness.delete(token, userId, email, password);

      return res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  },

  async read(req, res, next) {
    try {
      // Aquisição do token
      const { token } = req;

      // Aquisição e validação de parâmetros
      const userId = parseInt(req.params["id"], 10);

      const rules = [[userId, UserIdValidator, { required: true, allowEmpty: false }]];

      const validationResult = validation.run(rules);

      if (validationResult["status"] === "error") {
        return res.status(400).json(validationResult);
      }

      const response = await UserBusiness.read(token, userId);

      return res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  },
};
