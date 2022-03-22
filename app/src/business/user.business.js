const crypto = require("crypto");
const validator = require("validator");

const User = require("../models/user.model");

const { conflict, created, failure, ok, forbidden } = require("../modules/http");
const {
  EmailAlreadyInUse,
  DatabaseFailure,
  UserNotFound,
  Forbidden,
  Success,
} = require("../modules/codes");

const mail = require("../modules/mail");
const { fileName } = require("../modules/debug");

module.exports = {
  async create(email, name, password) {
    const user = await User.findOne({
      where: {
        email: email,
      },
      raw: true,
    });

    if (user) {
      return conflict({
        code: EmailAlreadyInUse,
        message: "Este endereço de email já foi cadastrado por outro usuário.",
      });
    } else {
      password = crypto.createHash("md5").update(password).digest("hex");

      const activationCode = crypto.randomBytes(8).toString("hex");

      const user = await User.create({
        email,
        name,
        password,
        activationCode,
      });

      if (user) {
        try {
          const { emailHtml, emailText } = await mail.composeEmail(
            user["id"],
            user["name"],
            user["email"],
            user["activationCode"]
          );

          await mail.sendEmail(user["email"], emailText, emailHtml);
        } catch (error) {
          console.log(fileName(), `Erro durante envio de email: ${error.message}`);
        }

        return created({
          code: Success,
          response: {
            user: user,
          },
        });
      } else {
        return failure({
          code: DatabaseFailure,
          message: "Não foi possível inserir o novo usuário no banco de dados.",
        });
      }
    }
  },

  async delete(decoded, userId, email, password) {
    // Aplicar hash MD5 na senha, se necessário
    if (!validator.isMD5(password)) {
      password = crypto.createHash("md5").update(password).digest("hex");
    }

    // Adquirir dados do usuário informado
    const user = await User.findOne({
      where: {
        id: userId,
        email: email,
        password: password,
      },
      raw: true,
    });

    if (user) {
      // Verifica veracidade dos dados
      if (
        user["id"] == decoded["userId"] &&
        user["email"] == decoded["email"] &&
        user["password"] == password
      ) {
        // Remover todos os dados de usuário (de todas as tabelas)
        const deleted = await User.destroy({
          where: {
            id: userId,
            email: email,
          },
        });

        // Verifica sucesso da exclusão
        if (deleted) {
          return ok({
            code: Success,
            message: "Conta e dados de usuário removidos com sucesso.",
          });
        } else {
          return failure({
            code: DatabaseFailure,
            message: "Não foi possível realizar a exclusão de um ou mais dados do banco de dados.",
          });
        }
      } else {
        return forbidden({
          code: Forbidden,
          message: "O usuário informado não possui permissão para completar esta ação.",
        });
      }
    } else {
      return ok({
        code: UserNotFound,
        message: "O usuário informado não foi encontrado na base de dados.",
      });
    }
  },
};
