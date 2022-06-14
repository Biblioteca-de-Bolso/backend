const request = require("supertest");
const app = require("../../../app");
const { IncorrectParameter, NotFound, Forbidden } = require("../../../src/modules/codes");
const prisma = require("../../../src/prisma");
const { assertStatus, assertStatusCode, assertResponse, assertCode } = require("../../utils");

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

    assertStatusCode(response, 400);
    assertStatus(response, "error");
    assertCode(response, IncorrectParameter);
  });

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

  test("Não deve ler os dados de um usuário inexistente", async () => {
    const response = await request(app)
      .get(`/api/user/99`)
      .set({ authorization: `Bearer ${accessToken}` })
      .send();

    assertStatusCode(response, 404);
    assertStatus(response, "error");
    assertCode(response, NotFound);
  });

  test("Nao deve ler os dados de outro usuário", async () => {
    const response = await request(app)
      .get(`/api/user/1`)
      .set({ authorization: `Bearer ${accessToken}` })
      .send();

    assertStatusCode(response, 403);
    assertStatus(response, "error");
    assertCode(response, Forbidden);
  });

  test("Deve ler os dados do usuário", async () => {
    const response = await request(app)
      .get(`/api/user/${userId}`)
      .set({ authorization: `Bearer ${accessToken}` })
      .send();

    assertStatusCode(response, 200);
    assertStatus(response, "ok");
    assertResponse(response, "user");

    expect(response.body.response.user.id).toBe(userId);
  });
});
