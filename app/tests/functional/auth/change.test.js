const request = require("supertest");
const app = require("../../../app");
const {
  IncorrectParameter,
  ErrorStatus,
  Unauthorized,
  OkStatus,
} = require("../../../src/modules/codes");
const prisma = require("../../../src/prisma");
const { assertStatus, assertCode, assertStatusCode, assertResponse } = require("../../utils");

describe("Alteração de Senha de Usuário", () => {
  jest.setTimeout(10000);

  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  // Andrew Tenenbaum
  const userEmail = "andrewtenenbaum@email.com";
  const userPassword = "andrewtenenbaum";

  test("Deve realizar login e retornar um Access Token", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: userEmail,
      password: userPassword,
    });

    assertStatusCode(response, 200);
    assertStatus(response, "ok");
    assertResponse(response, ["accessToken", "refreshToken"]);

    if (response.body.response.accessToken) accessToken = response.body.response.accessToken;
  });

  test("Não deve solicitar alteração de senha sem informar um email", async () => {
    const response = await request(app).post("/api/auth/recover").send({});

    assertStatusCode(response, 400);
    assertStatus(response, ErrorStatus);
    assertCode(response, IncorrectParameter);
  });

  test("Não deve solicitar alteração de senha informando um email inválido", async () => {
    const response = await request(app).post("/api/auth/recover").send({
      email: "notaemail",
    });

    assertStatusCode(response, 400);
    assertStatus(response, ErrorStatus);
    assertCode(response, IncorrectParameter);
  });

  test("Não deve solicitar alteração de senha informando um email não cadastrado", async () => {
    const response = await request(app).post("/api/auth/recover").send({
      email: "notauser@gmail.com",
    });

    assertStatusCode(response, 401);
    assertStatus(response, ErrorStatus);
    assertCode(response, Unauthorized);
  });

  test("Deve solicitar uma alteração de senha e retornar um código de recuperação", async () => {
    const response = await request(app).post("/api/auth/recover").send({
      email: userEmail,
    });

    assertStatusCode(response, 200);
    assertStatus(response, OkStatus);
    assertResponse(response, "recover");

    if (response.body.response.recover) firstRecoverCode = response.body.response.recover.code;
  });
});
