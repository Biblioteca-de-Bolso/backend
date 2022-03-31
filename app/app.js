const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config({ path: "../.env" });
const customErrorHandler = require("./src/modules/error");

// Configuração do Express
const app = express();

// Middlewares e configurações
app.use(cors());
app.use(express.json({ limit: "1gb" }));
app.use(
  express.urlencoded({
    extended: true,
    limit: "1gb",
  })
);
app.use(express.static("./public"));
app.use("/api", require("./src/routes"));
app.use(customErrorHandler);

app.get(["/", "/api"], async (req, res) => {
  res.status(200).send({
    status: "ok",
    response: {
      message: "Biblioteca de Bolso - API",
      homepage: "https://github.com/Biblioteca-de-Bolso/backend",
      documentation: "https://documenter.getpostman.com/view/19545370/UVkmQGwd",
    },
  });
});

module.exports = app;
