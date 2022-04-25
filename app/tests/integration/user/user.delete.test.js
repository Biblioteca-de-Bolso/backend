const request = require("supertest");
const app = require("../../../app");
const { IncorrectParameter, Unauthorized } = require("../../../src/modules/codes");
const prisma = require("../../../src/prisma");
const { assertStatus, assertStatusCode, assertResponse, assertCode } = require("../../utils");

describe("Remoção de Usuário", () => {
  jest.setTimeout(10000);

  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  let accessToken = "";

  // Dennis Ritchie
  const userId = 4;
  const userEmail = "dennisritchie@email.com";
  const userPassword = "dennisritchie";

  test("Deve retornar todos os dados do usuário do banco de dados", async () => {
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
    });

    const books = await prisma.book.findMany({
      where: {
        userId: userId,
      },
    });

    const annotations = await prisma.annotation.findMany({
      where: {
        userId: userId,
      },
    });

    expect(user).toHaveProperty("id");
    expect(user.id).toBe(userId);

    // No seed do banco de dados são cadastrados 2 livros para este usuário
    expect(books.length).toBe(2);

    // No seed do banco de dados são cadastradas 2 anotações para este usuário
    expect(annotations.length).toBe(0);
  });

  test("Não deve remover um usuário sem informar um token", async () => {
    const response = await request(app).delete(`/api/user`).send();

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

  test("Não deve remover um usuário sem informar um id", async () => {
    const response = await request(app)
      .delete(`/api/user`)
      .set({ authorization: `Bearer ${accessToken}` })
      .send({
        email: userEmail,
        password: userPassword,
      });

    assertStatusCode(response, 400);
    assertStatus(response, "error");
    assertCode(response, IncorrectParameter);
  });

  test("Não deve remover um usuário sem informar um email", async () => {
    const response = await request(app)
      .delete(`/api/user`)
      .set({ authorization: `Bearer ${accessToken}` })
      .send({
        id: userId,
        password: userPassword,
      });

    assertStatusCode(response, 400);
    assertStatus(response, "error");
    assertCode(response, IncorrectParameter);
  });

  test("Não deve remover um usuário sem informar uma senha", async () => {
    const response = await request(app)
      .delete(`/api/user`)
      .set({ authorization: `Bearer ${accessToken}` })
      .send({
        id: userId,
        email: userEmail,
      });

    assertStatusCode(response, 400);
    assertStatus(response, "error");
    assertCode(response, IncorrectParameter);
  });

  test("Não deve remover os dados de usuário passando uma senha incorreta", async () => {
    const response = await request(app)
      .delete(`/api/user`)
      .set({ authorization: `Bearer ${accessToken}` })
      .send({
        id: userId,
        email: userEmail,
        password: "wrongpassword",
      });

    assertStatusCode(response, 401);
    assertStatus(response, "error");
    assertCode(response, Unauthorized);
  });

  test("Não deve remover os dados de usuário passando uma senha incorreta", async () => {
    const response = await request(app)
      .delete(`/api/user`)
      .set({ authorization: `Bearer ${accessToken}` })
      .send({
        id: userId,
        email: userEmail,
        password: "wrongpassword",
      });

    assertStatusCode(response, 401);
    assertStatus(response, "error");
    assertCode(response, Unauthorized);
  });

  test("Não deve remover os dados de usuário passando um id de outro usuário", async () => {
    const response = await request(app)
      .delete(`/api/user`)
      .set({ authorization: `Bearer ${accessToken}` })
      .send({
        id: 1,
        email: userEmail,
        password: userPassword,
      });

    assertStatusCode(response, 401);
    assertStatus(response, "error");
    assertCode(response, Unauthorized);
  });
});
