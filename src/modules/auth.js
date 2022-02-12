const jwt = require("jsonwebtoken");

const filename = __filename.slice(__dirname.length + 1) + " -";

module.exports = {
  signToken(userId) {
    const token = jwt.sign(
      {
        userId,
      },
      process.env.TOKEN_SECRET,
      {
        expiresIn: 300,
      }
    );

    return token;
  },

  verifyToken(token) {
    try {
      return jwt.verify(token, process.env.TOKEN_SECRET);
    } catch (error) {
      console.log(
        filename,
        `Não foi possível validar o token informado: ${error.message}`
      );
      return false;
    }
  },
};
