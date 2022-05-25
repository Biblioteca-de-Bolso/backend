const controller = require("../controllers/googlebooks.controller");
const { protectedRoute } = require("../middlewares/auth");

function load(routes) {
  routes.get("/googlebooks/", protectedRoute, controller.search);
}

module.exports = load;

