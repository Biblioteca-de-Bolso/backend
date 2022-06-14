const request = require("supertest");
const app = require("../../../app");
const {
  OkStatus,
  ErrorStatus,
  IncorrectParameter,
  Forbidden,
  NotFound,
} = require("../../../src/modules/codes");
const prisma = require("../../../src/prisma");
const { assertStatus, assertStatusCode, assertResponse, assertCode } = require("../../utils");

describe("Exclusão de livros", () => {
  jest.setTimeout(10000);

  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  let accessToken = "";

  // Ada Lovelace
  const targetBookId = 4;
  const bookIdFromOtherUser = 1;
  const userEmail = "ada@email.com";
  const userPassword = "adalovelace";

  test("Não deve excluir os dados de um livro sem informar um Access Token", async () => {
    const response = await request(app).delete(`/api/book`).send();

    assertStatusCode(response, 400);
    assertStatus(response, ErrorStatus);
    assertCode(response, IncorrectParameter);
  });

  test("Deve realizar login e retornar um Access Token", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: userEmail,
      password: userPassword,
    });

    assertStatusCode(response, 200);
    assertStatus(response, OkStatus);
    assertResponse(response, ["accessToken", "refreshToken"]);

    if (response.body.response.accessToken) accessToken = response.body.response.accessToken;
  });

  test("Deve ler os dados do livro que será excluído", async () => {
    const response = await request(app)
      .get(`/api/book/${targetBookId}`)
      .set({ authorization: `Bearer ${accessToken}` })
      .send();

    assertStatusCode(response, 200);
    assertStatus(response, OkStatus);
    assertResponse(response, "book");

    expect(response.body.response.book.id).toBe(targetBookId);
  });

  test("Não deve excluir os dados de um livro sem informar o bookId", async () => {
    const response = await request(app)
      .delete(`/api/book`)
      .set({ authorization: `Bearer ${accessToken}` })
      .send({});

    assertStatusCode(response, 400);
    assertStatus(response, ErrorStatus);
    assertCode(response, IncorrectParameter);
  });

  test("Não deve excluir os dados de um livro que não foi cadastrado", async () => {
    const response = await request(app)
      .delete(`/api/book`)
      .set({ authorization: `Bearer ${accessToken}` })
      .send({
        bookId: 99,
      });

    assertStatusCode(response, 404);
    assertStatus(response, ErrorStatus);
    assertCode(response, NotFound);
  });

  test("Nao deve excluir os dados de um livro que foi cadastrado por outro usuário", async () => {
    const response = await request(app)
      .delete(`/api/book`)
      .set({ authorization: `Bearer ${accessToken}` })
      .send({
        bookId: bookIdFromOtherUser,
      });

    assertStatusCode(response, 403);
    assertStatus(response, ErrorStatus);
    assertCode(response, Forbidden);
  });

  test("Deve excluir os dados de um livro", async () => {
    const response = await request(app)
      .delete(`/api/book`)
      .set({ authorization: `Bearer ${accessToken}` })
      .send({
        bookId: targetBookId,
      });

    assertStatusCode(response, 200);
    assertStatus(response, OkStatus);
  });

  test("Não deve ler os dados do livro que foi excluído", async () => {
    const response = await request(app)
      .get(`/api/book/${targetBookId}`)
      .set({ authorization: `Bearer ${accessToken}` })
      .send();

    assertStatusCode(response, 404);
    assertStatus(response, ErrorStatus);
    assertCode(response, NotFound);
  });
});
