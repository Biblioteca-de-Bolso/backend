const request = require("supertest");
const app = require("../../app");
const { IncorrectParameter, AccountNotVerified } = require("../../src/modules/codes");
const prisma = require("../../src/prisma");
const { assertFailure, assertSuccess } = require("../utils");

describe("Realização de login", () => {
  jest.setTimeout(10000);

  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  // Von Neumann (conta inativa, deve falhar no teste de login)
  const inactiveEmail = "vonneumann@email.com";
  const inactivePassword = "vonneumann";

  // Ada Lovelace
  const userEmail = "ada@email.com";
  const userPassword = "adalovelace";

  test("Não deve realizar login sem informar um email", async () => {
    const response = await request(app).post("/api/auth/login").send({
      password: inactivePassword,
    });

    assertFailure(response, 400, IncorrectParameter);
  });

  test("Não deve realizar login sem informar uma senha", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: inactiveEmail,
    });

    assertFailure(response, 400, IncorrectParameter);
  });

  test("Não deve realizar login de uma conta que não foi confirmada", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: inactiveEmail,
      password: inactivePassword,
    });

    assertFailure(response, 200, AccountNotVerified);
  });

  test("Deve realizar login e retornar um Access Token", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: userEmail,
      password: userPassword,
    });

    assertSuccess(response, 200, ["accessToken", "refreshToken"]);
  });
});
