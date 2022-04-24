const request = require("supertest");
const app = require("../../app");
const prisma = require("../../src/prisma");

describe("Realização de login", () => {
  jest.setTimeout(10000);

  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  // Von Neumann (conta inativa, deve falhar no teste de login)
  const inactiveEmail = "vonneumann@email.com";
  const inactivePassword = "vonneumann";

  // Ada Lovelace
  const userEmail = "ada@email.com";
  const userPassword = "adalovelace";

  test("Não deve realizar login sem informar um email", async () => {
    const response = await request(app).post("/api/auth/login").send({
      password: inactivePassword,
    });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("status");
    expect(response.body.status).toBe("error");
    expect(response.body).toHaveProperty("code");
    expect(response.body.code).toBe("IncorrectParameter");
  });

  test("Não deve realizar login sem informar uma senha", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: inactiveEmail,
    });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("status");
    expect(response.body.status).toBe("error");
    expect(response.body).toHaveProperty("code");
    expect(response.body.code).toBe("IncorrectParameter");
  });

  test("Não deve realizar login de uma conta que não foi confirmada", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: inactiveEmail,
      password: inactivePassword,
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("status");
    expect(response.body.status).toBe("error");
    expect(response.body).toHaveProperty("code");
    expect(response.body.code).toBe("AccountNotVerified");
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
    expect(response.body.response).toHaveProperty("refreshToken");
  });
});
