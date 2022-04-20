const request = require("supertest");
const app = require("../app");
const prisma = require("../src/prisma");

describe("Fluxo de Usuário", () => {
  jest.setTimeout(10000);

  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  // Parâmetros do fluxo
  let userId = null;
  let accessToken = null;
  let activationCode = null;
  let userEmail = "usuario@email.com";
  let userName = "Nome de Usuário";
  let userPassword = "123456789";

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

    // Adquire o ID do usuário
    if (response.body.response.user.id) userId = response.body.response.user.id.toString();
    if (response.body.response.user.activationCode)
      activationCode = response.body.response.user.activationCode;
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

  test("Não deve realizar login sem informar um email", async () => {
    const response = await request(app).post("/api/auth/login").send({
      password: userPassword,
    });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("status");
    expect(response.body.status).toBe("error");
  });

  test("Não deve realizar login sem informar uma senha", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: userEmail,
    });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("status");
    expect(response.body.status).toBe("error");
  });

  test("Deve realizar login e retornar um Access Token", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: userEmail,
      password: userPassword,
    });

    expect(response.statusCode).toBe(200);

    // De mesmo modo, assumindo o fato anterior, podemos considerar a mesma lógica
    // Caso os dados do usuário NÃO sejam retornados, ele NÃO foi inserido no banco de dados
    expect(response.body).toHaveProperty("status");
    expect(response.body.status).toBe("ok");
    expect(response.body).toHaveProperty("response");

    if (response.body.response.accessToken) accessToken = response.body.response.accessToken;
  });

  test("Não deve remover um usuário sem informar um ID", async () => {
    const response = await request(app)
      .delete("/api/user")
      .set({ authorization: `Bearer ${accessToken}` })
      .send({
        email: userEmail,
        password: userPassword,
      });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("status");
    expect(response.body.status).toBe("error");
  });

  test("Não deve remover um usuário sem informar um email", async () => {
    const response = await request(app)
      .delete("/api/user")
      .set({ authorization: `Bearer ${accessToken}` })
      .send({
        id: userId,
        password: userPassword,
      });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("status");
    expect(response.body.status).toBe("error");
  });

  test("Não deve remover um usuário sem informar uma senha", async () => {
    const response = await request(app)
      .delete("/api/user")
      .set({ authorization: `Bearer ${accessToken}` })
      .send({
        id: userId,
        email: userEmail,
      });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("status");
    expect(response.body.status).toBe("error");
  });

  test("Deve remover um usuário", async () => {
    const response = await request(app)
      .delete("/api/user")
      .set({ authorization: `Bearer ${accessToken}` })
      .send({
        id: userId,
        email: userEmail,
        password: userPassword,
      });

    expect(response.statusCode).toBe(200);
  });

  test("Não deve remover um usuário que já foi removido", async () => {
    const response = await request(app)
      .delete("/api/user")
      .set({ authorization: `Bearer ${accessToken}` })
      .send({
        id: userId,
        email: userEmail,
        password: userPassword,
      });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("status");
    expect(response.body.status).toBe("error");
  });
});
