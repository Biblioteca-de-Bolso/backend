const controller = require("../controllers/annotation.controller");
const { protectedRoute } = require("../middlewares/auth");

function load(routes) {
  routes.post("/annotation", protectedRoute, controller.create);
  routes.get("/annotation", protectedRoute, controller.list);
}

module.exports = load;

