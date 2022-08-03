const request = require("supertest");
const app = require("../../../app");
const { IncorrectParameter, Forbidden, NotFound } = require("../../../src/modules/codes");
const prisma = require("../../../src/prisma");
const { assertStatus, assertStatusCode, assertResponse, assertCode } = require("../../utils");

describe("Listagem de Livros Cadastrados", () => {
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

  // Esse usuário possui seed que realiza o cadastro de 2 livros
  const userBooks = [9, 10];

  test("Não deve listar os livros sem informar um Access Token", async () => {
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

  test("Deve listar todos os livros de um usuário", async () => {
    const response = await request(app)
      .get(`/api/book`)
      .set({ authorization: `Bearer ${accessToken}` })
      .send();

    assertStatusCode(response, 200);
    assertStatus(response, "ok");
    assertResponse(response, "books");

    expect(response.body.response.books.length).toBe(userBooks.length);

    // Extrair os Id dos livros retornados
    const returnedIds = response.body.response.books.map((book) => book.id);

    // Compara os Id dos livros retornados com o esperado
    const checked = returnedIds.map((id, idx) => (id === userBooks[idx] ? true : false));

    // Função para verificar se todos os elementos de uma array são "true"
    const allTrue = (arr) => arr.every((v) => v === true);

    expect(allTrue(checked)).toBe(true);
  });
});
