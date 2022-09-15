const controller = require("../controllers/borrow.controller");
const { protectedRoute } = require("../middlewares/auth");

function load(routes) {
  routes.post("/borrow", protectedRoute, controller.create);
}

module.exports = load;



