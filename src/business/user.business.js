const crypto = require("crypto");
const validator = require("validator");

const User = require("../models/user.model");

const http = require("../modules/http");
const mail = require("../modules/mail");

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

          try {
            // Enviar email de criação de cadastro
            const { emailHtml, emailText } = await mail.composeEmail(
              user["id"],
              user["name"],
              user["email"],
              user["activationCode"]
            );

            await mail.sendEmail(user["email"], emailText, emailHtml);
          } catch (error) {
            console.log(filename, `Erro durante envio de email: ${error.message}`);
          }

          // Retornar resposta
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

  async delete(decoded, userId, email, password) {
    try {
      // Aplicar hash MD5 na senha, se necessário
      if (!validator.isMD5(password)) {
        password = crypto.createHash("md5").update(password).digest("hex");
      }

      // Adquirir dados do usuário informado do banco de dados
      const user = await User.findOne({
        where: {
          id: userId,
          email: email,
          password: password,
        },
        raw: true,
      });

      if (user) {
        // Verifica veracidade dos dados, tanto do Token quanto do Body
        if (
          user["id"] == decoded["userId"] &&
          user["email"] == decoded["email"] &&
          user["password"] == password
        ) {
          // Os dados informados são os mesmo que a conta que se deseja apagar

          // Remover todos os dados de usuário (de todas as tabelas)
          const deleted = await User.destroy({
            where: {
              id: userId,
              email: email,
            },
          });

          // Verifica sucesso da exclusão
          if (deleted) {
            return http.ok(null, {
              message: "Conta de usuário removida com sucesso",
            });
          } else {
            return http.failure({
              message: "Não foi possível apagar a conta de usuário",
            });
          }
        } else {
          // Para essa situação acontecer, alguem precisaria conhecer o ID e email do usuário
          // Pouco provável, mas possível de acontecer
          return http.ok(null, {
            message: "Esse usuário não tem permissão para remover essa conta.",
          });
        }
      } else {
        return http.ok(null, {
          message: "Nenhum usuário encontrado para os dados fornecidos",
        });
      }
    } catch (error) {
      console.log(filename, `Erro durante rotina de apagar usuário: ${error.message}`);
      return http.failure(null, {
        message: `Erro durante rotina de apagar usuário: ${error.message}`,
      });
    }
  },
};
