const request = require("supertest");
const app = require("../../../app");
const { IncorrectParameter, EmailAlreadyInUse } = require("../../../src/modules/codes");
const prisma = require("../../../src/prisma");
const { assertStatus, assertCode, assertStatusCode, assertResponse } = require("../../utils");

describe("Criação de Usuário", () => {
  jest.setTimeout(10000);

  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  const userEmail = "novoemail@email.com";
  const userName = "Novo Nome de Usuário";
  const userPassword = "123456789";

  test("Não deve criar um usuário sem fornecer um email", async () => {
    const response = await request(app).post("/api/user").send({
      name: userName,
      password: userPassword,
    });

    assertStatusCode(response, 400);
    assertStatus(response, "error");
    assertCode(response, IncorrectParameter);
  });

  test("Não deve criar um usuário sem fornecer um nome", async () => {
    const response = await request(app).post("/api/user").send({
      email: userEmail,
      password: userPassword,
    });

    assertStatusCode(response, 400);
    assertStatus(response, "error");
    assertCode(response, IncorrectParameter);
  });

  test("Não deve criar um usuário sem fornecer uma senha", async () => {
    const response = await request(app).post("/api/user").send({
      email: userEmail,
      name: userName,
    });

    assertStatusCode(response, 400);
    assertStatus(response, "error");
    assertCode(response, IncorrectParameter);
  });

  test("Deve criar um novo usuário e retornar suas informações", async () => {
    const response = await request(app).post("/api/user").send({
      email: userEmail,
      name: userName,
      password: userPassword,
    });

    assertStatusCode(response, 201);
    assertStatus(response, "ok");
    assertResponse(response, "user");
  });

  test("Não deve criar um usuário com email que já está cadastrado", async () => {
    const response = await request(app).post("/api/user").send({
      email: userEmail,
      name: userName,
      password: userPassword,
    });

    assertStatusCode(response, 409);
    assertStatus(response, "error");
    assertCode(response, EmailAlreadyInUse);
  });
});
