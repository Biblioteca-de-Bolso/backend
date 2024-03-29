const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config({ path: "../.env" });
const customErrorHandler = require("./src/middlewares/error");
const { OkStatus, NotFound } = require("./src/modules/codes");
const prisma = require("./src/prisma");

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
    status: OkStatus,
    response: {
      message: "Biblioteca de Bolso - API",
      homepage: "https://github.com/Biblioteca-de-Bolso/backend",
      documentation: "https://documenter.getpostman.com/view/19545370/UVkmQGwd",
    },
  });
});

app.get("/empty", async (req, res) => {
  const empty = await prisma.empty.findMany();

  return res.status(200).json({
    status: OkStatus,
    response: {
      ...empty,
    },
  });
});

app.all("/*", async (req, res) => {
  return res.status(404).json({
    status: "error",
    code: NotFound,
    message: "A rota solicitada não foi encontrada ou implementada.",
    documentation: "https://documenter.getpostman.com/view/19545370/UVkmQGwd",
  });
});

app.use(customErrorHandler);

module.exports = app;
