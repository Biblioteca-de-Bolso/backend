const request = require("supertest");
const app = require("../app");

describe("Fluxo de Usuário", () => {
  jest.setTimeout(10000);

  let userId = null;
  let accessToken = null;
  let activationCode = null;
  let userEmail = "usuario@email.com";
  let userName = "Nome de Usuário";
  let userPassword = "123456789";

  test("Deve criar um novo usuário e retornar suas informações", async () => {
    const response = await request(app).post("/api/user").send({
      email: userEmail,
      name: userName,
      password: userPassword,
    });

    expect(response.statusCode).toBe(201);

    // A função de criação de usuário no Business da aplicação retorna os dados do usuário
    // Esses dados são retornados APENAS se a entidade for inserida no banco de dados
    // Portanto, recebendo os dados do cliente, podemos assumir que a inserção foi bem sucedida
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("activationCode");

    // Adquire o ID do usuário
    if (response.body.id) userId = response.body.id;
    if (response.body.activationCode) activationCode = response.body.activationCode;
  });

  test("Não deve ser possível criar um usuário com email que já está cadastrado", async () => {
    const response = await request(app).post("/api/user").send({
      email: userEmail,
      name: userName,
      password: userPassword,
    });

    expect(response.statusCode).toBe(200);

    // De mesmo modo, assumindo o fato anterior, podemos considerar a mesma lógica
    // Caso os dados do usuário NÃO sejam retornados, ele NÃO foi inserido no banco de dados
    expect(response.body).not.toHaveProperty("id");
  });

  test("Deve ser capaz de confirmar uma conta de usuário", async () => {
    const response = await request(app).get("/api/auth/verify").query({
      id: userId,
      email: userEmail,
      code: activationCode,
    });

    expect(response.statusCode).toBe(200);
  });

  test("Deve realizar login e retornar um Access Token", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: userEmail,
      password: userPassword,
    });

    expect(response.statusCode).toBe(200);

    // De mesmo modo, assumindo o fato anterior, podemos considerar a mesma lógica
    // Caso os dados do usuário NÃO sejam retornados, ele NÃO foi inserido no banco de dados
    expect(response.body).toHaveProperty("accessToken");

    if (response.body.accessToken) accessToken = response.body.accessToken;
  });

  // test("Deve ser possível remover um usuário", async () => {
  //   const response = await request(app).delete("/api/user").send({
  //     id: userId,
  //     email: userEmail,
  //     password: userPassword,
  //   });

  //   expect(response.statusCode).toBe(200);

  //   // De mesmo modo, assumindo o fato anterior, podemos considerar a mesma lógica
  //   // Caso os dados do usuário NÃO sejam retornados, ele NÃO foi inserido no banco de dados
  //   expect(response.body).not.toHaveProperty("id");
  // });
});
