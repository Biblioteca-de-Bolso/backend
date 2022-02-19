const BookBusiness = require("../business/book.business");
const AuthBusiness = require("../business/auth.business");

const http = require("../modules/http");

const filename = __filename.slice(__dirname.length + 1) + " -";

module.exports = {
  async list(req, res) {
    try {
      // Parse de parâmetros e Token
      const token = req.headers["x-access-token"];

      if (!token) {
        console.log(filename, "Nenhum token de autenticação informado");

        return http.badRequest(res, {
          message: "Nenhum token de autenticação informado",
        });
      }

      // Validação do token informado
      const decoded = AuthBusiness.verifyToken(token);

      if (decoded["error"]) {
        // Não foi possível validar o token
        return http.unauthorized(res, {
          message: decoded["error"],
        });
      }

      // Token validado, prosseguir com a requisição
      const response = await BookBusiness.list();

      // Retornar com resultado da operação
      return http.ok(res, response.body);
    } catch (error) {
      console.log(filename, `Erro durante a listagem de livros: ${error.message}`);

      return http.failure(res, {
        message: `Erro durante a listagem de livros: ${error.message}`,
      });
    }
  },
};
