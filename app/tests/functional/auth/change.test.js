const request = require("supertest");
const app = require("../../../app");
const {
  IncorrectParameter,
  ErrorStatus,
  Unauthorized,
  OkStatus,
  NotFound,
  RecoverCodeRedeemed,
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
  const userEmail = "johncarmack@email.com";
  const oldPassword = "johncarmack";
  const newPassword = "newpasswordjohncarmack";

  const activeRecoverCode = "e039fdcfc58dd51d";
  const inactiveRecoverCode = "ab4736e81ad05968";

  test("Não deve alterar uma senha informando um email não cadastrado no sistema", async () => {
    const response = await request(app).post("/api/auth/change").send({
      email: "notanuser@gmail.com",
      recoverCode: activeRecoverCode,
      newPassword: newPassword,
    });

    assertStatusCode(response, 401);
    assertStatus(response, ErrorStatus);
    assertCode(response, Unauthorized);
  });

  test("Não deve alterar uma senha informando um código de recuperação não cadastrado", async () => {
    const response = await request(app).post("/api/auth/change").send({
      email: userEmail,
      recoverCode: "9999999999999999",
      newPassword: newPassword,
    });

    assertStatusCode(response, 404);
    assertStatus(response, ErrorStatus);
    assertCode(response, NotFound);
  });

  test("Não deve alterar uma senha sem informar um email", async () => {
    const response = await request(app).post("/api/auth/change").send({
      recoverCode: activeRecoverCode,
      newPassword: newPassword,
    });

    assertStatusCode(response, 400);
    assertStatus(response, ErrorStatus);
    assertCode(response, IncorrectParameter);
  });

  test("Não deve alterar uma senha informando um email inválido", async () => {
    const response = await request(app).post("/api/auth/change").send({
      email: "notanemail",
      recoverCode: activeRecoverCode,
      newPassword: newPassword,
    });

    assertStatusCode(response, 400);
    assertStatus(response, ErrorStatus);
    assertCode(response, IncorrectParameter);
  });

  test("Não deve alterar uma senha sem informar um código de recuperação", async () => {
    const response = await request(app).post("/api/auth/change").send({
      email: "notanemail",
      newPassword: newPassword,
    });

    assertStatusCode(response, 400);
    assertStatus(response, ErrorStatus);
    assertCode(response, IncorrectParameter);
  });

  test("Não deve alterar uma senha informando um código de recuperação inválido", async () => {
    const response = await request(app).post("/api/auth/change").send({
      email: "notanemail",
      recoverCode: "notvalid",
      newPassword: newPassword,
    });

    assertStatusCode(response, 400);
    assertStatus(response, ErrorStatus);
    assertCode(response, IncorrectParameter);
  });

  test("Não deve alterar uma senha sem informar uma nova senha", async () => {
    const response = await request(app).post("/api/auth/change").send({
      email: userEmail,
      recoverCode: "notvalid",
    });

    assertStatusCode(response, 400);
    assertStatus(response, ErrorStatus);
    assertCode(response, IncorrectParameter);
  });

  test("Não deve alterar uma senha informando uma senha inválida", async () => {
    const response = await request(app).post("/api/auth/change").send({
      email: userEmail,
      recoverCode: "notvalid",
      newPassword: "notvalid",
    });

    assertStatusCode(response, 400);
    assertStatus(response, ErrorStatus);
    assertCode(response, IncorrectParameter);
  });

  test("Não deve alterar uma senha com um código de recuperação inativo", async () => {
    const response = await request(app).post("/api/auth/change").send({
      email: userEmail,
      recoverCode: inactiveRecoverCode,
      newPassword: newPassword,
    });

    assertStatusCode(response, 401);
    assertStatus(response, ErrorStatus);
    assertCode(response, Unauthorized);
  });

  test("Deve alterar uma senha", async () => {
    const response = await request(app).post("/api/auth/change").send({
      email: userEmail,
      recoverCode: activeRecoverCode,
      newPassword: newPassword,
    });

    assertStatusCode(response, 200);
    assertStatus(response, OkStatus);
    assertResponse(response, "message");
  });

  test("Não deve alterar uma senha com um código de recuperação que já foi utilizado", async () => {
    const response = await request(app).post("/api/auth/change").send({
      email: userEmail,
      recoverCode: activeRecoverCode,
      newPassword: newPassword,
    });

    assertStatusCode(response, 409);
    assertStatus(response, ErrorStatus);
    assertCode(response, RecoverCodeRedeemed);
  });

  test("Deve realizar login com a nova senha", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: userEmail,
      password: newPassword,
    });

    assertStatusCode(response, 200);
    assertStatus(response, OkStatus);
    assertResponse(response, "accessToken");
  });

  test("Não deve realizar login com a senha anterior", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: userEmail,
      password: oldPassword,
    });

    assertStatusCode(response, 401);
    assertStatus(response, ErrorStatus);
    assertCode(response, Unauthorized);
  });
});
