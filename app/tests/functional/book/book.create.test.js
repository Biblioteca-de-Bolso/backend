const request = require("supertest");
const app = require("../../../app");
const { IncorrectParameter, DuplicatedISBN } = require("../../../src/modules/codes");
const prisma = require("../../../src/prisma");
const { assertStatus, assertCode, assertStatusCode, assertResponse } = require("../../utils");

describe("Criação de Livro", () => {
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

  const isbn13 = "9789722331005";
  const isbn10 = "9722331000";
  const title = "Livro Super Bacana";
  const author = "Author do Livro Super Bacana";
  const publisher = "Editora do Livro Super Bacana";
  const description = "O livro super bacana é sobre ...";

  test("Não deve criar um livro sem informar um token", async () => {
    const response = await request(app).post("/api/book").send({
      title,
      isbn: isbn13,
      author,
      publisher,
      description,
    });

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

  test("Não deve criar um livro sem fornecer um título", async () => {
    const response = await request(app)
      .post("/api/book")
      .set({ authorization: `Bearer ${accessToken}` })
      .send({
        isbn: isbn13,
        author,
        publisher,
        description,
      });

    assertStatusCode(response, 400);
    assertStatus(response, "error");
    assertCode(response, IncorrectParameter);
  });

  test("Deve criar um novo livro e retornar suas informações", async () => {
    const response = await request(app)
      .post("/api/book")
      .set({ authorization: `Bearer ${accessToken}` })
      .send({
        title,
        isbn: isbn13,
        author,
        publisher,
        description,
      });

    assertStatusCode(response, 201);
    assertStatus(response, "ok");
    assertResponse(response, "book");

    expect(response.body.response.book.title).toBe(title);
    expect(response.body.response.book.isbn10).toBe(isbn10);
    expect(response.body.response.book.isbn13).toBe(isbn13);
  });

  test("Não deve criar um livro com ISBN que já está cadastrado", async () => {
    const response = await request(app)
      .post("/api/book")
      .set({ authorization: `Bearer ${accessToken}` })
      .send({
        title,
        isbn: isbn13,
        author,
        publisher,
        description,
      });

    assertStatusCode(response, 409);
    assertStatus(response, "error");
    assertCode(response, DuplicatedISBN);
  });
});
