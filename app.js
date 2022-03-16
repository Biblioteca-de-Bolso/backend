const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config({ path: ".env" });
const helmet = require("helmet");
const customErrorHandler = require("./src/modules/error");
const sequelize = require("./src/modules/sequelize");

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
app.use(helmet());
app.use(express.static("./public"));
app.use("/api", require("./src/routes"));

app.get("/api/connection", async (req, res) => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error.message);
  }

  res.status(200).send({
    message: "Teste de conexão com o banco de dados realizado com sucesso",
  });
});

app.get(["/", "/api"], async (req, res) => {
  res.status(200).send({
    message: "Biblioteca de Bolso - API",
  });
});

// app.use(customErrorHandler);

app.use((err, req, res, next) => {
  const file = err.stack.split("\n")[1].split("\\").pop().replace(")", "");

  console.log(file, "-", err.name, "-", err.message);

  return res.status(500).json({
    error: err.name,
    message: err.message,
    file: file,
  });
});

module.exports = app;
