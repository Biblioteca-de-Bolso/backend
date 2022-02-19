// Importação dos módulos necessários
const express = require("express");

// Objeto de roteamento
const routes = express.Router();

// Importação dos Controllers
const UserController = require("./controllers/user.controller");
const BookController = require("./controllers/book.controller");
const AuthController = require("./controllers/auth.controller");

// Rotdas de Autenticação
routes.get("/auth/login", AuthController.login);
routes.post("/auth/refresh", AuthController.refreshToken);
routes.post("/auth/create", AuthController.createToken);

// Rotas de Usuário
routes.post("/user", UserController.create);

// Rotas de Livros
routes.get("/book/list", BookController.list);

module.exports = routes;
