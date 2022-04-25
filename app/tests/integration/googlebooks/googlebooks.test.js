const request = require("supertest");
const app = require("../../../app");
const { IncorrectParameter } = require("../../../src/modules/codes");
const prisma = require("../../../src/prisma");
const { assertStatusCode, assertStatus, assertResponse, assertCode } = require("../../utils");

describe("Busca de livros no Google Books", () => {
  jest.setTimeout(10000);

  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  let accessToken = "";

  // Ada Lovelace
  const userEmail = "ada@email.com";
  const userPassword = "adalovelace";

  test("Não deve realizar a busca de um livro sem informar um token", async () => {
    const response = await request(app).get("/api/googlebooks").send();

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

  test("Não deve realizar a busca de um livro sem informar uma strig de busca", async () => {
    const response = await request(app)
      .get("/api/googlebooks")
      .set({
        authorization: `Bearer ${accessToken}`,
      })
      .send();

    assertStatusCode(response, 400);
    assertStatus(response, "error");
    assertCode(response, IncorrectParameter);
  });

  test("Deve realizar a busca de um livro", async () => {
    const response = await request(app)
      .get("/api/googlebooks?qstring=código limpo")
      .set({
        authorization: `Bearer ${accessToken}`,
      })
      .send();

    assertStatusCode(response, 200);
    assertStatus(response, "ok");
    assertResponse(response, "books");

    expect(response.body.response.books.length).toBeGreaterThan(0);
  });
});
