const express = require("express");
const routes = express.Router();

const UserController = require("./controllers/user.controller");
const BookController = require("./controllers/book.controller");
const AuthController = require("./controllers/auth.controller");
const PlaygroundController = require("./controllers/playground.controller");
const GoogleBooksController = require("./controllers/googlebooks.controller");
const AnnotationController = require("./controllers/annotation.controller");

const { protectedRoute, refreshTokenRoute } = require("./middlewares/auth");

// Rotas de Playground
routes.get("/play/date", PlaygroundController.date);

// Rotas de Autenticação
routes.post("/auth/login", AuthController.login);
routes.get("/auth/verify", AuthController.verifyAccount);
routes.post("/auth/refresh", refreshTokenRoute, AuthController.refreshToken);

// Rotas de Usuário
routes.post("/user", UserController.create);
routes.delete("/user", protectedRoute, UserController.delete);
routes.get("/user/:id", protectedRoute, UserController.read);

// Rotas de Livros
routes.get("/book", protectedRoute, BookController.list);
routes.get("/book/:id", protectedRoute, BookController.read);
routes.post("/book", protectedRoute, BookController.create);

// Rotas de Anotações
routes.post("/annotation", protectedRoute, AnnotationController.create);

// Rotas do Google Books
routes.get("/googlebooks/", protectedRoute, GoogleBooksController.search);

module.exports = routes;
