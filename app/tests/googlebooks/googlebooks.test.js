const request = require("supertest");
const app = require("../../app");
const prisma = require("../../src/prisma");

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

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("status");
    expect(response.body.status).toBe("error");
    expect(response.body.code).toBe("IncorrectParameter");
  });

  test("Deve realizar login e retornar um Access Token", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: userEmail,
      password: userPassword,
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("status");
    expect(response.body.status).toBe("ok");
    expect(response.body).toHaveProperty("response");
    expect(response.body.response).toHaveProperty("accessToken");

    if (response.body.response.accessToken) accessToken = response.body.response.accessToken;
  });

  test("Não deve realizar a busca de um livro sem informar uma strig de busca", async () => {
    const response = await request(app)
      .get("/api/googlebooks")
      .set({
        authorization: `Bearer ${accessToken}`,
      })
      .send();

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("status");
    expect(response.body.status).toBe("error");
    expect(response.body.code).toBe("IncorrectParameter");
  });

  test("Deve realizar a busca de um livro", async () => {
    const response = await request(app)
      .get("/api/googlebooks?qstring=código limpo")
      .set({
        authorization: `Bearer ${accessToken}`,
      })
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("status");
    expect(response.body.status).toBe("ok");
    expect(response.body).toHaveProperty("response");
    expect(response.body.response).toHaveProperty("books");
    expect(response.body.response.books.length).toBeGreaterThan(0);
  });
});
