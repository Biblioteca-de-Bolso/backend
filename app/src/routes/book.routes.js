const controller = require("../controllers/book.controller");
const { protectedRoute } = require("../middlewares/auth");

function load(routes) {
  routes.get("/book", protectedRoute, controller.list);
  routes.get("/book/:id", protectedRoute, controller.read);
  routes.post("/book", protectedRoute, controller.create);
}

module.exports = load;

