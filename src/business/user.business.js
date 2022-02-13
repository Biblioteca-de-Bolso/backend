const auth = require("../modules/auth");
const http = require("../modules/http");

const filename = __filename.slice(__dirname.length + 1) + " -";

module.exports = {
  async create() {},

  async login(user, password) {
    try {
      if (user === "rhenan" && password === "123") {
        // Adquirir o ID do usuário do banco de dados
        const payload = {
          userId: 123456789,
        };

        // Criar o token relacionado a esta operação de login
        const token = auth.signToken(payload);

        // Retorar o token assinado
        return http.ok(null, token);
      } else {
        console.log(filename, "Usuário ou senha incorretos");

        return http.unauthorized(null, {
          message: "Usuário ou senha incorretos",
        });
      }
    } catch (error) {
      console.log(filename, `Erro durante o login: ${error.message}`);
      return http.failure(null, {
        message: `Erro durante o login: ${error.message}`,
      });
    }
  },
};
