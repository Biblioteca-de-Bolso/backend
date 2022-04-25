const { IncorrectParameter } = require("../../../../src/modules/codes");
const { validate } = require("../../../../src/validators/user/activation.rules");

const { assertStatus, assertResponse } = require("../../../utils");

describe("Teste para parâmetro activationCode", () => {
  test("Deve exigir um input caso parâmetro seja required", async () => {
    const response = validate(null, true);

    expect(response).toHaveProperty("status");
    expect(response.status).toBe("error");
    expect(response).toHaveProperty("code");
    expect(response.code).toBe(IncorrectParameter);
  });
  [];

  test("Não deve exigir um input caso parâmetro não seja required", async () => {
    const response = validate(null, false);

    expect(response).not.toHaveProperty("code");
  });

  test("Não deve aceitar um input que não é alfanumérico", async () => {
    const response = validate("****************", true);

    expect(response).toHaveProperty("status");
    expect(response.status).toBe("error");
    expect(response).toHaveProperty("code");
    expect(response.code).toBe(IncorrectParameter);
  });

  test("Não deve aceitar um input menor que 16 caracteres", async () => {
    const response = validate("ABC", true);

    expect(response).toHaveProperty("status");
    expect(response.status).toBe("error");
    expect(response).toHaveProperty("code");
    expect(response.code).toBe(IncorrectParameter);
  });
});
