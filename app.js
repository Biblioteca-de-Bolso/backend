const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const sequelize = require("./src/modules/sequelize");

// Configuração das Variáveis de Ambiente
dotenv.config({ path: ".env" });

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

app.get("/connection", async (req, res) => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error.message);
  }

  res.status(200).send({
    message: "Biblioteca de Bolso - API",
  });
});

app.get("/", async (req, res) => {
  res.status(200).send({
    message: "Biblioteca de Bolso - API",
  });
});

app.get("/api", (req, res) => {
  res.status(200).send({
    message: "Biblioteca de Bolso - API",
  });
});

module.exports = app;