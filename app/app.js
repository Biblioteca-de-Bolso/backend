const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config({ path: "../.env" });
const customErrorHandler = require("./src/middlewares/error");
const { NotFound } = require("./src/modules/codes");

const app = express();

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
  return res.status(200).json({
    status: "ok",
    response: {
      message: "Biblioteca de Bolso - API",
      homepage: "https://github.com/Biblioteca-de-Bolso/backend",
      documentation: "https://documenter.getpostman.com/view/19545370/UVkmQGwd",
    },
  });
});

app.get("/*", async (req, res) => {
  return res.status(404).json({
    status: "error",
    code: NotFound,
    message:
      "A rota solicitada não foi implementada ou encontrada. Verifique a documentação para a rota desejada.",
  });
});

module.exports = app;
