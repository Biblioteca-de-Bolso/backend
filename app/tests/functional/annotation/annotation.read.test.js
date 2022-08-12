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

describe("Leitura de Anotações", () => {
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

  // ID da anotação do Charles
  const annotationId = 1;

  // ID da anotação da Ada Lovelace
  const forbiddenAnnotationId = 2;

  test("Não deve ler uma anotação sem informar um token", async () => {
    const response = await request(app).get(`/api/annotation/${annotationId}`).send();

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

  test("Não deve ler uma anotação com ID inexistente", async () => {
    const response = await request(app)
      .get("/api/annotation/9999")
      .set({ authorization: `Bearer ${accessToken}` })
      .send();

    assertStatusCode(response, 404);
    assertStatus(response, ErrorStatus);
    assertCode(response, NotFound);
  });

  test("Não deve ler uma anotação que pertence a outro usuário", async () => {
    const response = await request(app)
      .get(`/api/annotation/${forbiddenAnnotationId}`)
      .set({ authorization: `Bearer ${accessToken}` })
      .send();

    assertStatusCode(response, 403);
    assertStatus(response, ErrorStatus);
    assertCode(response, Forbidden);
  });

  test("Deve ler uma anotação e retornar suas informações", async () => {
    const response = await request(app)
      .get(`/api/annotation/${annotationId}`)
      .set({ authorization: `Bearer ${accessToken}` })
      .send();

    assertStatusCode(response, 200);
    assertStatus(response, OkStatus);
    assertResponse(response, "annotation");
  });
});
