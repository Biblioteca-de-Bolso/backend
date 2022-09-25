const controller = require("../controllers/borrow.controller");
const { protectedRoute } = require("../middlewares/auth");

function load(routes) {
  routes.post("/borrow", protectedRoute, controller.create);
  routes.delete("/borrow", protectedRoute, controller.delete);
  routes.get("/borrow", protectedRoute, controller.list);
  routes.get("/borrow/:id", protectedRoute, controller.read);
  routes.patch("/borrow", protectedRoute, controller.patchUpdate);


}

module.exports = load;



