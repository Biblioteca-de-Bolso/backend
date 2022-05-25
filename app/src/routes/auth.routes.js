const controller = require("../controllers/auth.controller");
const { refreshTokenRoute } = require("../middlewares/auth");

function load(routes) {
  routes.post("/auth/login", controller.login);
  routes.get("/auth/verify", controller.verifyAccount);
  routes.post("/auth/refresh", refreshTokenRoute, controller.refreshToken);
}

module.exports = load;

