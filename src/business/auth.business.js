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

  async createToken(payload) {
    try {
      // Realiza assinatura do token com base no payload e no token secret da aplicação
      const accesToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
        expiresIn: 60 * 5,
      });

      // Criação de um novo refresh token
      const randomToken = crypto.randomBytes(64).toString("hex");
      const iat = dayjs().unix();
      const exp = dayjs.unix(iat).add(10, "minutes").unix();

      // Salvar o refresh token no banco de dados
      const refresh = await RefreshToken.create({
        id: randomToken,
        email: payload["email"],
        userId: payload["userId"],
        iat,
        exp,
      });

      if (refresh) {
        return {
          accesToken: accesToken,
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
  verifyToken(token) {
    try {
      return jwt.verify(token, process.env.TOKEN_SECRET);
    } catch (error) {
      console.log(filename, `Não foi possível validar o token informado: ${error.message}`);

      return {
        error: `Não foi possível validar o token informado: ${error.message}`,
      };
    }
  },
};
