const request = require("supertest");
const app = require("../../../app");
const { IncorrectParameter, AccountNotVerified } = require("../../../src/modules/codes");
const prisma = require("../../../src/prisma");
const { assertStatus, assertCode, assertStatusCode, assertResponse } = require("../../utils");

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

    assertStatusCode(response, 400);
    assertStatus(response, "error");
    assertCode(response, IncorrectParameter);
  });

  test("Não deve realizar login sem informar uma senha", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: inactiveEmail,
    });

    assertStatusCode(response, 400);
    assertStatus(response, "error");
    assertCode(response, IncorrectParameter);
  });

  test("Não deve realizar login de uma conta que não foi confirmada", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: inactiveEmail,
      password: inactivePassword,
    });

    assertStatusCode(response, 200);
    assertStatus(response, "error");
    assertCode(response, AccountNotVerified);
  });

  test("Deve realizar login e retornar um Access Token", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: userEmail,
      password: userPassword,
    });

    assertStatusCode(response, 200);
    assertStatus(response, "ok");
    assertResponse(response, ["accessToken", "refreshToken"]);
  });
});
