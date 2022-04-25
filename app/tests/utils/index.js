module.exports = {
  assertStatusCode(response, statusCode) {
    expect(response).toHaveProperty("statusCode");
    expect(response.statusCode).toBe(statusCode);
  },

  assertStatus(response, status) {
    expect(response.body).toHaveProperty("status");
    expect(response.body.status).toBe(status);
  },

  assertCode(response, code) {
    expect(response.body).toHaveProperty("code");
    expect(response.body.code).toBe(code);
  },

  assertResponse(response, property) {
    expect(response.body).toHaveProperty("response");

    if (typeof property === "string") {
      expect(response.body.response).toHaveProperty(property);
    } else {
      for (const prop of property) {
        expect(response.body.response).toHaveProperty(prop);
      }
    }
  },
};
