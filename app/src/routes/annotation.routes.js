const controller = require("../controllers/annotation.controller");
const { protectedRoute } = require("../middlewares/auth");

function load(routes) {
  routes.post("/annotation", protectedRoute, controller.create);
  routes.get("/annotation", protectedRoute, controller.list);
  routes.get("/annotation/:id", protectedRoute, controller.read);
  routes.delete("/annotation/:id", protectedRoute, controller.delete);
}

module.exports = load;

