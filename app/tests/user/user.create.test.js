const request = require("supertest");
const app = require("../../app");
const prisma = require("../../src/prisma");

describe("Criação de Usuário", () => {
  jest.setTimeout(10000);

  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  const userEmail = "novoemail@email.com";
  const userName = "Novo Nome de Usuário";
  const userPassword = "123456789";

  test("Não deve criar um usuário sem fornecer um email", async () => {
    const response = await request(app).post("/api/user").send({
      name: userName,
      password: userPassword,
    });

    expect(response.statusCode).toBe(400);
  });

  test("Não deve criar um usuário sem fornecer um nome", async () => {
    const response = await request(app).post("/api/user").send({
      email: userEmail,
      password: userPassword,
    });

    expect(response.statusCode).toBe(400);
  });

  test("Não deve criar um usuário sem fornecer uma senha", async () => {
    const response = await request(app).post("/api/user").send({
      email: userEmail,
      name: userName,
    });

    expect(response.statusCode).toBe(400);
  });

  test("Deve criar um novo usuário e retornar suas informações", async () => {
    const response = await request(app).post("/api/user").send({
      email: userEmail,
      name: userName,
      password: userPassword,
    });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("status");
    expect(response.body.status).toBe("ok");
    expect(response.body).toHaveProperty("response");
    expect(response.body.response).toHaveProperty("user");
  });

  test("Não deve criar um usuário com email que já está cadastrado", async () => {
    const response = await request(app).post("/api/user").send({
      email: userEmail,
      name: userName,
      password: userPassword,
    });

    expect(response.statusCode).toBe(409);
    expect(response.body).toHaveProperty("status");
    expect(response.body.status).toBe("error");
  });
});
