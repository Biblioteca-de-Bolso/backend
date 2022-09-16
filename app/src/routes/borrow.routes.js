const controller = require("../controllers/borrow.controller");
const { protectedRoute } = require("../middlewares/auth");

function load(routes) {
  routes.post("/borrow", protectedRoute, controller.create);
  routes.delete("/borrow", protectedRoute, controller.delete);
  routes.get("/borrow", protectedRoute, controller.list);
}

module.exports = load;



