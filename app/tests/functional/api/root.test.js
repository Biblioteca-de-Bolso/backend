const request = require("supertest");
const app = require("../../../app");

const { assertStatusCode, assertStatus } = require("../../utils");

describe("Testes da estrutura de resposta da API", () => {
  test("A raiz da API deve retornar um OK 200", async () => {
    const response = await request(app).get("/api");

    assertStatusCode(response, 200);
    assertStatus(response, "ok");
  });

  test("A raiz da URL deve retornar um OK 200", async () => {
    const response = await request(app).get("/");

    assertStatusCode(response, 200);
    assertStatus(response, "ok");
  });

  test("Uma rota inexistente deve retornar error 404 Not Found", async () => {
    const response = await request(app).get("/inexistente");

    assertStatusCode(response, 404);
    assertStatus(response, "error");
  });
});
