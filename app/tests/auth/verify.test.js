const request = require("supertest");
const app = require("../../app");
const prisma = require("../../src/prisma");

describe("Verificação de conta de usuário", () => {
  jest.setTimeout(10000);

  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  // Allan Turing
  const userId = 1;
  const userEmail = "allan@email.com";
  const activationCode = "1234567812345678";

  test("Deve retornar estado da conta de usuário como inativo", async () => {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    expect(user).toHaveProperty("active");
    expect(user.active).toBe(false);
  });

  test("Não deve confirmar uma conta de usuário sem informar um ID", async () => {
    const response = await request(app).get("/api/auth/verify").query({
      email: userEmail,
      code: activationCode,
    });

    expect(response.statusCode).toBe(400);
  });

  test("Não deve confirmar uma conta de usuário sem informar um email", async () => {
    const response = await request(app).get("/api/auth/verify").query({
      id: userId,
      code: activationCode,
    });

    expect(response.statusCode).toBe(400);
  });

  test("Não deve confirmar uma conta de usuário sem informar um activation code", async () => {
    const response = await request(app).get("/api/auth/verify").query({
      id: userId,
      email: userEmail,
    });

    expect(response.statusCode).toBe(400);
  });

  test("Deve confirmar uma conta de usuário", async () => {
    const response = await request(app).get("/api/auth/verify").query({
      id: userId,
      email: userEmail,
      code: activationCode,
    });

    expect(response.statusCode).toBe(200);
  });

  test("Não deve confirmar uma conta de usuário que já foi confirmada", async () => {
    const response = await request(app).get("/api/auth/verify").query({
      id: userId,
      email: userEmail,
      code: activationCode,
    });

    expect(response.statusCode).toBe(400);
  });

  test("Deve retornar estado da conta de usuário como ativo", async () => {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    expect(user).toHaveProperty("active");
    expect(user.active).toBe(true);
  });
});
