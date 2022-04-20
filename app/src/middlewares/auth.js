// Middleware para verificação de token de autenticação em rotas privadas

const AuthBusiness = require("../business/auth.business");

module.exports = async function (req, res, next) {
  const header = req.headers["authorization"];

  const token = header ? header.split(" ")[1] : "";

  const decoded = await AuthBusiness.verifyToken(token);

  if (decoded["status"] === "error") {
    return res.status(400).json(decoded);
  }

  req.token = decoded;

  next();
};
