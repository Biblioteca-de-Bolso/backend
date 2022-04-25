const request = require("supertest");
const app = require("../../app");
const { IncorrectParameter, UserNotFound, Forbidden } = require("../../src/modules/codes");
const prisma = require("../../src/prisma");
const { assertFailure, assertSuccess } = require("../utils");

describe("Leitura de Usuário", () => {
  jest.setTimeout(10000);

  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  let accessToken = "";

  // Ada Lovelace
  const userId = 2;
  const userEmail = "ada@email.com";
  const userPassword = "adalovelace";

  test("Não deve ler os dados de um usuário sem informar um token", async () => {
    const response = await request(app).get(`/api/user/${userId}`).send();

    assertFailure(response, 400, IncorrectParameter);
  });

  test("Deve realizar login e retornar um Access Token", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: userEmail,
      password: userPassword,
    });

    assertSuccess(response, 200, ["accessToken", "refreshToken"]);

    if (response.body.response.accessToken) accessToken = response.body.response.accessToken;
  });

  test("Não deve ler os dados de um usuário inexistente", async () => {
    const response = await request(app)
      .get(`/api/user/99`)
      .set({ authorization: `Bearer ${accessToken}` })
      .send();

    assertFailure(response, 404, UserNotFound);
  });

  test("Nao deve ler os dados de outro usuário", async () => {
    const response = await request(app)
      .get(`/api/user/1`)
      .set({ authorization: `Bearer ${accessToken}` })
      .send();

    assertFailure(response, 403, Forbidden);
  });

  test("Deve ler os dados do usuário", async () => {
    const response = await request(app)
      .get(`/api/user/${userId}`)
      .set({ authorization: `Bearer ${accessToken}` })
      .send();

    assertSuccess(response, 200, "user");

    expect(response.body.response.user.id).toBe(userId);
  });
});
