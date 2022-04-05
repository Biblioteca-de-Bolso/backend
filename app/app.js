const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config({ path: "../.env" });
const customErrorHandler = require("./src/middlewares/error");
const { NotFound } = require("./src/modules/codes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.static("./public"));
app.use("/api", require("./src/routes"));

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

const errorResponse = {
  status: "error",
  code: NotFound,
  message: "A rota solicitada não foi encontrada ou implementada.",
  documentation: "https://documenter.getpostman.com/view/19545370/UVkmQGwd",
};

app.get("/*", async (req, res) => {
  return res.status(404).json(errorResponse);
});

app.post("/*", async (req, res) => {
  return res.status(404).json(errorResponse);
});

app.put("/*", async (req, res) => {
  return res.status(404).json(errorResponse);
});

app.patch("/*", async (req, res) => {
  return res.status(404).json(errorResponse);
});

app.delete("/*", async (req, res) => {
  return res.status(404).json(errorResponse);
});

app.use(customErrorHandler);

module.exports = app;
