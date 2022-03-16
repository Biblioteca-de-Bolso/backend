// Módulos necessário
const dayjs = require("dayjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const validator = require("validator");

// Models
const RefreshToken = require("../models/refreshtoken.model");
const User = require("../models/user.model");

// Módulos Locais
const http = require("../modules/http");
const { decode } = require("punycode");

const filename = __filename.slice(__dirname.length + 1) + " -";

module.exports = {
  async login(email, password) {
    try {
      // Verifica se a senha informada está no formato de hash MD5
      if (!validator.isMD5(password)) {
        password = crypto.createHash("md5").update(password).digest("hex");
      }

      // Verificação de usuário e senha contra o banco de dados
      const user = await User.findOne({
        where: {
          email: email,
          password: password,
        },
        raw: true,
      });

      if (user) {
        // Dados de usuário encontrados, conferir por status da conta
        if (user["active"]) {
          // Usuário ativo, prosseguir com o login

          // Construir o payload do token com os dados necessários
          const payload = {
            userId: user["id"],
            email: user["email"],
            name: user["name"],
          };

          // Criar o token relacionado a esta operação de login
          const token = await this.createToken(payload);

          if (token.error) {
            return http.failure(null, {
              message: "Não foi possível concluir a criação de web token durante a autenticação",
            });
          } else {
            // Retorar o token assinado
            return http.ok(null, token);
          }
        } else {
          return http.ok(null, {
            message:
              "Para realizar o login, é necessário realizar a confirmação de conta via email",
          });
        }
      } else {
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

  async verifyAccount(userId, email, activationCode) {
    try {
      // Buscar os dados de usuário do banco de dados
      const user = await User.findOne({
        where: {
          id: userId,
          email: email,
          active: false,
        },
        raw: true,
      });

      if (user) {
        // Usuario encontrado, realizar modificação de ativação
        const activeUser = await User.update(
          { active: true },
          {
            where: {
              id: userId,
              email: email,
              activationCode: activationCode,
            },
          }
        );

        // TODO:
        // Nesta etapa, estamos retornando objetos http
        // Vamos considerar um objeto "ok", para sucesso na ativação
        // E considerar objetos "failure" para falha na ativação
        // Porém, semanticamente, uma falha na ativação por motivos de dados incorretos também é "ok"
        // Failures devem ser utilizadas para falhas no sistema
        // Implementar um sistema de retorno de objeto de "success" e "error", e não objetos http

        // Os objetos a seguir são objetos simples, e não objetos http
        if (activeUser) {
          return {
            message: "Conta de usuário confirmada com sucesso",
          };
        } else {
          return {
            error: "Falha na ativação de conta de usuário",
            message: "Erro durante a confirmação de conta de usário",
          };
        }
      } else {
        return {
          error: "Falha na ativação de conta de usuário",
          message: "Os dados de usuários ou de confirmação não são válidos",
        };
      }
    } catch (error) {
      console.log(filename, `Erro durante a confirmação de conta de usuário: ${error.message}`);

      return {
        error: "Falha na ativação",
        message: `Erro durante a confirmação de conta de usuário: ${error.message}`,
      };
    }
  },

  async createToken(payload) {
    try {
      // Realiza assinatura do token com base no payload e no token secret da aplicação
      const accessToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
        expiresIn: 60 * 60 * 24,
      });

      // Criação de um novo refresh token
      const randomToken = crypto.randomBytes(64).toString("hex");

      // Criação das datas "issued at" e "expiration" em formato unix ms
      const iat = dayjs().valueOf();
      const exp = dayjs(iat).add(7, "day").valueOf();

      // Converte o formato das datas em segundos (desconsiderar últimos três caracteres)
      const iatString = iat.toString().slice(0, 10);
      const expString = exp.toString().slice(0, 10);

      // Salvar o refresh token no banco de dados
      const refresh = await RefreshToken.create({
        id: randomToken,
        email: payload["email"],
        userId: payload["userId"],
        iat: iatString,
        exp: expString,
      });

      if (refresh) {
        return {
          accessToken: accessToken,
          refreshToken: randomToken,
        };
      } else {
        return {
          error: "Falha na criação de web token",
          message: "Não foi possível concluir a criação de web token durante a autenticação",
        };
      }
    } catch (error) {
      console.log(
        filename,
        `Erro durante o procedimento de criação de web token: ${error.message}`
      );
      return http.failure(null, {
        message: `Erro durante o procedimento de criação de web token: ${error.message}`,
      });
    }
  },

  // Verifica validade de um token
  async verifyToken(token) {
    try {
      // Decodificar o token informado
      const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

      // O token não expirou e foi decodificado com sucesso, verificar a existência da conta
      const user = await User.findOne({
        where: {
          id: decoded["userId"],
          email: decoded["email"],
        },
        raw: true,
      });

      if (user) {
        // Usuário encontrado, dados são válidos
        return decoded;
      } else {
        // O token foi validado com sucesso, mas não foi encontrado nenhum usuário na base dados
        return {
          error: "Dados de usuário presente no token não são válidos",
        };
      }
    } catch (error) {
      console.log(filename, `Não foi possível validar o token informado: ${error.message}`);

      return {
        error: `Não foi possível validar o token informado: ${error.message}`,
      };
    }
  },
};
