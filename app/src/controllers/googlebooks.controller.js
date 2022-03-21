const GoogleBooksBusines = require("../business/googlebooks.business");

const QstringValidator = require("../validators/qstring.validator");

module.exports = {
  async search(req, res, next) {
    try {
      // Parse do Token
      // const token = req.headers["x-access-token"];

      // if (!token) {
      //   console.log(fileName(), "Nenhum token de autenticação informado");

      //   return badRequest({
      //     message: "Nenhum token de autenticação informado.",
      //   });
      // }

      // // Validação do token informado
      // const decoded = await AuthBusiness.verifyToken(token);

      // if (decoded["error"]) {
      //   return unauthorized({
      //     code: Unauthorized,
      //     message: decoded["error"],
      //   });
      // }

      // Parse dos parâmetros
      const qstring = req.query["qstring"];

      const validateQstring = QstringValidator.validate(qstring);

      if (validateQstring.error) {
        res.status(400).json(validateQstring);
      }

      // Token validado, prosseguir com a requisição
      const response = await GoogleBooksBusines.search(qstring);

      // Retornar com resultado da operação
      res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  },
};
