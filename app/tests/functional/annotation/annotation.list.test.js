const request = require("supertest");
const app = require("../../../app");
const {
  IncorrectParameter,
  NotFound,
  ErrorStatus,
  OkStatus,
  Forbidden,
} = require("../../../src/modules/codes");
const prisma = require("../../../src/prisma");
const { assertStatus, assertCode, assertStatusCode, assertResponse } = require("../../utils");

describe("Listagem de Anotações", () => {
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

  // ID das anotaçãos do Charles
  const userAnnotations = [1, 2];

  test("Não deve listar as anotações sem informar um token", async () => {
    const response = await request(app).get(`/api/annotation`).send();

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

  test("Deve listar todas as anotações de um usuário", async () => {
    const response = await request(app)
      .get(`/api/annotation`)
      .set({ authorization: `Bearer ${accessToken}` })
      .send();

    assertStatusCode(response, 200);
    assertStatus(response, "ok");
    assertResponse(response, "annotations");

    expect(response.body.response.annotations.length).toBe(userAnnotations.length);

    // Extrair os Id das anotações retornadas
    const returnedIds = response.body.response.annotations.map((annotation) => annotation.id);

    // Compara os Id dos livros retornados com o esperado
    const checked = returnedIds.map((id, idx) => (id === userAnnotations[idx] ? true : false));

    // Função para verificar se todos os elementos de uma array são "true"
    const allTrue = (arr) => arr.every((v) => v === true);

    expect(allTrue(checked)).toBe(true);
  });
});
