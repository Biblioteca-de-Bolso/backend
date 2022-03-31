const request = require("supertest");
const app = require("../app");
const prisma = require("../src/prisma");
const crypto = require("crypto");
const { createToken } = require("../src/business/auth.business");

describe("Testes para leitura de dados de um usuário", () => {
  jest.setTimeout(10000);

  let accessToken = "";
  let user = {};

  beforeAll(async () => {
    await prisma.$connect();

    // Criar um usuário fictício
    const hash = crypto.randomBytes(16).toString("hex");

    user = {
      name: hash,
      email: hash + "@email.com",
      password: hash,
      active: true,
    };

    // Inserir usuário fictício no banco de dados
    const created = await prisma.user.create({
      data: {
        ...user,
      },
    });

    // Adquire o ID do usuário criado
    user["id"] = created["id"];

    // Criar token de autenticação para este usuário
    const token = await createToken({
      userId: user["id"],
      email: user["email"],
      password: user["password"],
    });

    // Extrai o access token do token criado
    accessToken = token["response"]["accessToken"];
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test.skip("Deve retornar os dados do usuário", async () => {
    const response = await request(app).get(`/user/${user["id"]}`).set({
      "x-access-token": accessToken,
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("status");
    expect(response.body.status).toBe("ok");
  });
});
