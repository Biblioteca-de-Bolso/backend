const BookBusiness = require("../business/book.business");

const auth = require("../modules/auth");
const http = require("../modules/http");

const filename = __filename.slice(__dirname.length + 1) + " -";

module.exports = {
  async list(req, res) {
    try {
      // Parse de parâmetros e Token
      const token = req.headers["x-access-token"];

      if (!token) {
        console.log(filename, "Nenhum token de autenticação informado");

        return http.badRequest(
          {
            message: "Nenhum token de autenticação informado",
          },
          res
        );
      }

      // Verificar validade do token informado
      const decoded = auth.verifyToken(token);

      if (decoded) {
        // Ĩnformações decodificadas
        console.log(decoded);

        // Token validado, prosseguir com a requisição
        const response = await BookBusiness.list();

        // Retornar com resultado da operação
        return http.ok(response.body, res);
      } else {
        // Não foi possível validar o token
        return http.unauthorized(
          {
            message: "É necessário estar autenticado para acessar essa informação",
          },
          res
        );
      }
    } catch (error) {
      console.log(filename, `Erro durante a listagem de livros: ${error.message}`);

      return http.failure(
        {
          message: `Erro durante a listagem de livros: ${error.message}`,
        },
        res
      );
    }
  },
};
