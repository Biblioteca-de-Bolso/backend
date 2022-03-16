const express = require("express");
const routes = express.Router();

const UserController = require("./controllers/user.controller");
const BookController = require("./controllers/book.controller");
const AuthController = require("./controllers/auth.controller");
const PlaygroundController = require("./controllers/playground.controller");

routes.get("/play/date", PlaygroundController.date);

routes.post("/auth/login", AuthController.login);
routes.get("/auth/verify", AuthController.verifyAccount);
routes.post("/auth/refresh", AuthController.refreshToken);

routes.post("/user", UserController.create);
routes.delete("/user", UserController.delete);

routes.get("/book/list", BookController.list);

module.exports = routes;
