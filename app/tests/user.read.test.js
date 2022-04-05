const request = require("supertest");
const app = require("../app");
const prisma = require("../src/prisma");
const crypto = require("crypto");
const { createToken } = require("../src/business/auth.business");

describe("Testes para leitura de dados de um usuário", () => {
  jest.setTimeout(10000);

  let accessToken = "";

  beforeAll(async () => {
    // Usuário: Allan Turing (verificar arquivo de seed)

    const token = await createToken({
      userId: 1,
      email: "allanturing@email.com",
      password: "allanturing",
    });

    accessToken = token["response"]["accessToken"];
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test("Não deve retornar os dados de outro usuário", async () => {
    const response = await request(app).get(`/api/user/1`).set({
      "x-access-token": accessToken,
    });

    expect(response.statusCode).toBe(403);
    expect(response.body).toHaveProperty("status");
    expect(response.body.status).toBe("error");
    expect(response.body).toHaveProperty("code");
    expect(response.body).toHaveProperty("message");
  });

  test("Deve retornar os dados do usuário", async () => {
    const response = await request(app).get(`/api/user/0`).set({
      "x-access-token": accessToken,
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("status");
    expect(response.body.status).toBe("ok");
    expect(response.body).toHaveProperty("response");
  });
});
