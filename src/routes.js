const express = require("express");
const routes = express.Router();

// Importação dos Controllers
const UserController = require("./controllers/user.controller");
const BookController = require("./controllers/book.controller");

// Rotas de Usuário
routes.get("/user/login", UserController.login);
routes.post("/auth/create", UserController.create);

// Rotas de Livros
routes.get("/book/list", BookController.list);

module.exports = routes;
