const auth = require("../modules/auth");
const http = require("../modules/http");

const filename = __filename.slice(__dirname.length + 1) + " -";

module.exports = {
  async create() {},

  async login(user, password) {
    try {
      if (user === "rhenan" && password === "123") {
        // Adquirir o ID do usuário do banco de dados
        const userId = 123456789;

        // Assinar token de acesso
        const token = auth.signToken(userId);

        // Retorar o token assinado
        return http.ok({
          auth: true,
          token: token,
        });

      } else {
        console.log(filename, "Usuário ou senha incorretos");
        
        return http.unauthorized({
          message: "Usuário ou senha incorretos",
        });
      }
    } catch (error) {
      console.log(filename, `Erro durante o login: ${error.message}`);
      return http.failure({
        message: `Erro durante o login: ${error.message}`,
      });
    }
  },


};
