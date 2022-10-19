const request = require("supertest");
const app = require("../../../app");
const { IncorrectParameter, ErrorStatus, OkStatus } = require("../../../src/modules/codes");
const prisma = require("../../../src/prisma");
const { assertStatus, assertStatusCode, assertResponse, assertCode } = require("../../utils");

describe("Pesquisa de Livros Cadastrados", () => {
  jest.setTimeout(10000);

  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  let accessToken = "";

  // Charles Babbage
  const userEmail = "charlesbabbage@email.com";
  const userPassword = "charlesbabbage";

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

  test("Não deve realizar uma pesquisa por livros sem informar um texto de busca", async () => {
    const response = await request(app)
      .get(`/api/book`)
      .set({ authorization: `Bearer ${accessToken}` })
      .query({
        search: "",
      });

    assertStatusCode(response, 400);
    assertStatus(response, ErrorStatus);
    assertCode(response, IncorrectParameter);
  });

  test("Deve realizar uma busca que retorna apenas um resultado", async () => {
    const response = await request(app)
      .get(`/api/book`)
      .set({ authorization: `Bearer ${accessToken}` })
      .query({
        search: "Matemática",
      });

    assertStatusCode(response, 200);
    assertStatus(response, OkStatus);
    assertResponse(response, "books");

    expect(response.body.response.books.length).toBe(1);
  });

  test("Deve realizar uma busca que retorna dois resultados", async () => {
    const response = await request(app)
      .get(`/api/book`)
      .set({ authorization: `Bearer ${accessToken}` })
      .query({
        search: "Autor do",
      });

    assertStatusCode(response, 200);
    assertStatus(response, OkStatus);
    assertResponse(response, "books");

    expect(response.body.response.books.length).toBe(2);
  });

  test("Deve realizar uma busca que não retorna nenhum resultado", async () => {
    const response = await request(app)
      .get(`/api/book`)
      .set({ authorization: `Bearer ${accessToken}` })
      .query({
        search: "Blá Blá Blá",
      });

    assertStatusCode(response, 200);
    assertStatus(response, OkStatus);
    assertResponse(response, "books");

    expect(response.body.response.books.length).toBe(0);
  });
});
