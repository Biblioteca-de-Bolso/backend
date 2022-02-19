const crypto = require("crypto");

const User = require("../models/user.model");

const http = require("../modules/http");

const filename = __filename.slice(__dirname.length + 1) + " -";

module.exports = {
  async create(email, name, password) {
    try {
      // Verificação de duplicidade
      const user = await User.findOne({
        where: {
          email: email,
        },
        raw: true,
      });

      if (user) {
        // Email já existe na base de dados
        return http.ok(null, {
          message: "Este endereço de email já foi cadastrado por outro usuário",
        });
      } else {
        // Email não existe na base de dados, podemos cadastrar este usuário

        // Aplicar hash MD5 na senha
        password = crypto.createHash("md5").update(password).digest("hex");

        // Criar um código de ativação para este usuário
        const activationCode = crypto.randomBytes(8).toString("hex");

        // Registra o usuário na base de dados
        const user = await User.create({
          email,
          name,
          password,
          activationCode,
        });

        if (user) {
          // Usuário registrado com sucesso

          // TODO: enviar email de validação

          return http.created(null, {
            message: "O usuário foi registrado com sucesso",
          });
        } else {
          // Falha na criação de novo usário
          return http.failure(null, {
            message: "Falha durante a criação do usuário",
          });
        }
      }
    } catch (error) {
      console.log(filename, `Erro durante a criação de novo usuário: ${error.message}`);
      return http.failure(null, {
        message: `Erro durante a criação de novo usuário: ${error.message}`,
      });
    }
  },
};
