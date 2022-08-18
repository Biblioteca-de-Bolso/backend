const request = require("supertest");
const app = require("../../../app");
const { IncorrectParameter, NotFound } = require("../../../src/modules/codes");
const prisma = require("../../../src/prisma");
const { assertStatus, assertCode, assertStatusCode, assertResponse } = require("../../utils");

describe("Criação de Anotações", () => {
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

  const bookId = 3;
  const unknowBook = 999;
  const title = "Título de uma anotação";
  const text = "Conteúdo de uma anotação";
  const reference = "Cap.2, Pag 3.";

  test("Não deve criar uma anotação sem informar um token", async () => {
    const response = await request(app).post("/api/annotation").send({
      bookId,
      title,
      text,
      reference,
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

  test("Não deve criar uma anotação sem fornecer um bookId", async () => {
    const response = await request(app)
      .post("/api/annotation")
      .set({ authorization: `Bearer ${accessToken}` })
      .send({
        title,
        text,
        reference,
      });

    assertStatusCode(response, 400);
    assertStatus(response, "error");
    assertCode(response, IncorrectParameter);
  });

  test("Não deve criar uma anotação sem fornecer um título", async () => {
    const response = await request(app)
      .post("/api/annotation")
      .set({ authorization: `Bearer ${accessToken}` })
      .send({
        bookId,
        text,
        reference,
      });

    assertStatusCode(response, 400);
    assertStatus(response, "error");
    assertCode(response, IncorrectParameter);
  });

  test("Não deve criar uma anotação fornecendo um título vazio", async () => {
    const response = await request(app)
      .post("/api/annotation")
      .set({ authorization: `Bearer ${accessToken}` })
      .send({
        title: "",
        bookId,
        text,
        reference,
      });

    assertStatusCode(response, 400);
    assertStatus(response, "error");
    assertCode(response, IncorrectParameter);
  });

  test("Não deve criar uma anotação sem fornecer um conteúdo", async () => {
    const response = await request(app)
      .post("/api/annotation")
      .set({ authorization: `Bearer ${accessToken}` })
      .send({
        bookId,
        title,
        reference,
      });

    assertStatusCode(response, 400);
    assertStatus(response, "error");
    assertCode(response, IncorrectParameter);
  });

  test("Não deve criar uma anotação fornecendo um conteúdo vazio", async () => {
    const response = await request(app)
      .post("/api/annotation")
      .set({ authorization: `Bearer ${accessToken}` })
      .send({
        text: "",
        bookId,
        title,
        reference,
      });

    assertStatusCode(response, 400);
    assertStatus(response, "error");
    assertCode(response, IncorrectParameter);
  });

  test("Não deve criar uma anotação em um livro não cadastrado", async () => {
    const response = await request(app)
      .post("/api/annotation")
      .set({ authorization: `Bearer ${accessToken}` })
      .send({
        bookId: unknowBook,
        title,
        text,
        reference,
      });

    assertStatusCode(response, 200);
    assertStatus(response, "error");
    assertCode(response, NotFound);
  });

  test("Deve criar uma nova anotação e retornar suas informações", async () => {
    const response = await request(app)
      .post("/api/annotation")
      .set({ authorization: `Bearer ${accessToken}` })
      .send({
        bookId,
        title,
        text,
        reference,
      });

    assertStatusCode(response, 201);
    assertStatus(response, "ok");
    assertResponse(response, "annotation");

    expect(response.body.response.annotation.title).toBe(title);
    expect(response.body.response.annotation.text).toBe(text);
    expect(response.body.response.annotation.reference).toBe(reference);
  });
});
