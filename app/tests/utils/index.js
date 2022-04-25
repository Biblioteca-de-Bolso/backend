module.exports = {
  assertFailure(response, statusCode, code) {
    expect(response).toHaveProperty("statusCode");
    expect(response.statusCode).toBe(statusCode);

    expect(response.body).toHaveProperty("status");
    expect(response.body.status).toBe("error");

    expect(response.body).toHaveProperty("code");
    expect(response.body.code).toBe(code);
  },

  assertSuccess(response, statusCode, property = null) {
    expect(response).toHaveProperty("statusCode");
    expect(response.statusCode).toBe(statusCode);

    expect(response.body).toHaveProperty("status");
    expect(response.body.status).toBe("ok");

    expect(response.body).toHaveProperty("response");

    switch (typeof property) {
      case "string":
        expect(response.body.response).toHaveProperty(property);
        break;
      case "object":
        for (const prop of property) {
          expect(response.body.response).toHaveProperty(prop);
        }
        break;
      default:
        console.log("Erro durante assert: esperado 'string'|'object', recebido:", typeof property);
        break;
    }
  },
};
