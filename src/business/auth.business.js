const dayjs = require("dayjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// Models
const RefreshToken = require("../models/refreshToken.model");

// Módulos Locais
const http = require("../modules/http");
const filename = __filename.slice(__dirname.length + 1) + " -";

module.exports = {
  async createToken(payload) {
    try {
      // A criação de um novo token segue as seguintes etapas:
      // 1 - Assinatura de um novo token
      // 2 - Criação de um refresh token

      // Realiza assinatura do token com base no payload e no token secret da aplicação
      const accesToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
        expiresIn: 60 * 5,
      });

      // Criação de um novo refresh token
      const randomToken = crypto.randomBytes(64).toString("hex");
      const iat = dayjs().unix();
      const exp = dayjs.unix(iat).add(10, "minutes").unix();

      console.log(iat, exp);

      // Salvar o refresh token no banco de dados
      await RefreshToken.create({
        id: randomToken,
        iat,
        exp,
        user: payload["user"],
        user_id: payload["userId"],
      });

      return http.ok(null, {
        accesToken: accesToken,
        refreshToken: randomToken,
      });
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
      console.log(
        filename,
        `Não foi possível validar o token informado: ${error.message}`
      );

      return {
        error: `Não foi possível validar o token informado: ${error.message}`,
      };
    }
  },
};
