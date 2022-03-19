const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config({ path: "../.env" });
const customErrorHandler = require("./src/modules/error");
const { sequelize, sequelizeSync } = require("./src/sequelize");

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

app.get("/api/connection", async (req, res) => {
  try {
    await sequelize.authenticate();
    console.log("Conexão com o banco de dados realizada com sucesso.");
    res.status(200).send({
      message: "Conexão com o banco de dados realizada com sucesso.",
    });
  } catch (error) {
    console.log(`Não foi possível realizar a conexão com o banco de dados: ${error.message}`);
    res.status(500).json({
      message: `Não foi possível realizar a conexão com o banco de dados: ${error.message}`,
    });
  }
});

app.get(["/", "/api"], async (req, res) => {
  res.status(200).send({
    message: "Biblioteca de Bolso - API",
  });
});

if (process.env.NODE_ENV !== "test") {
  (async () => {
    await sequelizeSync();
  })();
}

module.exports = app;
