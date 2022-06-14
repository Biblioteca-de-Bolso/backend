const controller = require("../controllers/book.controller");
const { protectedRoute } = require("../middlewares/auth");

function load(routes) {
  routes.get("/book", protectedRoute, controller.list);
  routes.get("/book/:id", protectedRoute, controller.read);
  routes.post("/book", protectedRoute, controller.create);
  routes.delete("/book", protectedRoute, controller.delete);
}

module.exports = load;

