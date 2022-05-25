const controller = require("../controllers/annotation.controller");
const { protectedRoute } = require("../middlewares/auth");

function load(routes) {
  routes.post("/annotation", protectedRoute, controller.create);
}

module.exports = load;

