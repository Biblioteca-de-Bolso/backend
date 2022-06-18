const multer = require("multer");
const booksThumbnails = multer({ dest: "uploads/books/thumbnails/" });

const controller = require("../controllers/book.controller");
const { protectedRoute } = require("../middlewares/auth");

function load(routes) {
  routes.get("/book", protectedRoute, controller.list);
  routes.get("/book/:id", protectedRoute, controller.read);
  routes.delete("/book", protectedRoute, controller.delete);
  routes.post("/book", protectedRoute, booksThumbnails.single("thumbnailFile"), controller.create);

}

module.exports = load;

