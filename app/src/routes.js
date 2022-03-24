const express = require("express");
const routes = express.Router();

const UserController = require("./controllers/user.controller");
const BookController = require("./controllers/book.controller");
const AuthController = require("./controllers/auth.controller");
const PlaygroundController = require("./controllers/playground.controller");
const GoogleBooksController = require("./controllers/googlebooks.controller");

// Rotas de Playground
routes.get("/play/date", PlaygroundController.date);

// Rotas de Autenticação
routes.post("/auth/login", AuthController.login);
routes.get("/auth/verify", AuthController.verifyAccount);
routes.post("/auth/refresh", AuthController.refreshToken);

// Rotas de Usuário
routes.post("/user", UserController.create);
routes.delete("/user", UserController.delete);

// Rotas de Livros
routes.get("/book", BookController.list);

// Rotas do Google Books
routes.get("/googlebooks/", GoogleBooksController.search);

module.exports = routes;
