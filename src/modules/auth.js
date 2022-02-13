const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const filename = __filename.slice(__dirname.length + 1) + " -";

module.exports = {
  // Realiza assinatura de um token
  signToken(payload) {
    // Realiza assinatura do token com base no payload e no token secret da aplicação
    const accesToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
      expiresIn: 60 * 5,
    });

    // Criação de um novo refresh token
    const refreshToken = crypto.randomBytes(64).toString("hex");

    // Salvar o refrehs token no banco de dados
    
    return {
      accesToken,
      refreshToken,
    };
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
