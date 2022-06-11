const request = require("supertest");
const app = require("../../../app");
const {
  IncorrectParameter,
  UserNotFound,
  Forbidden,
  NotFound,
} = require("../../../src/modules/codes");
const prisma = require("../../../src/prisma");
const { assertStatus, assertStatusCode, assertResponse, assertCode } = require("../../utils");

describe("Leitura de Livo Cadastrado", () => {
  jest.setTimeout(10000);

  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  let accessToken = "";

  // Allan Turing
  const targetBookId = 3;
  const userEmail = "ada@email.com";
  const userPassword = "adalovelace";

  test("Não deve ler os dados de um livro sem informar um Access Token", async () => {
    const response = await request(app).get(`/api/book`).send();

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

  test("Não deve ler os dados de um livro que não foi cadastrado", async () => {
    const response = await request(app)
      .get(`/api/book/99`)
      .set({ authorization: `Bearer ${accessToken}` })
      .send();

    assertStatusCode(response, 404);
    assertStatus(response, "error");
    assertCode(response, NotFound);
  });

  test("Nao deve ler os dados de um livro que foi cadastrado por outro usuário", async () => {
    // O livro de ID 1 pertence a outro usuário
    const response = await request(app)
      .get(`/api/book/1`)
      .set({ authorization: `Bearer ${accessToken}` })
      .send();

    assertStatusCode(response, 403);
    assertStatus(response, "error");
    assertCode(response, Forbidden);
  });

  test("Deve ler os dados de um livro", async () => {
    const response = await request(app)
      .get(`/api/book/${targetBookId}`)
      .set({ authorization: `Bearer ${accessToken}` })
      .send();

    assertStatusCode(response, 200);
    assertStatus(response, "ok");
    assertResponse(response, "book");

    expect(response.body.response.book.id).toBe(targetBookId);
  });
});
