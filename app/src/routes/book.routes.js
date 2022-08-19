const multer = require("multer");
const thumbnails = multer({ dest: "uploads/books/thumbnails/" });

const controller = require("../controllers/book.controller");
const { protectedRoute } = require("../middlewares/auth");

function load(routes) {
  routes.get("/book", protectedRoute, controller.list);
  routes.get("/book/:id", protectedRoute, controller.read);
  routes.delete("/book", protectedRoute, controller.delete);
  routes.post("/book", protectedRoute, thumbnails.single("thumbnailFile"), controller.create);
  routes.put("/book", protectedRoute, controller.update);
  routes.put("/book/thumbnail", protectedRoute, thumbnails.single("thumbnailFile"), controller.updateThumbnail);
  routes.delete("/book/thumbnail", protectedRoute, controller.removeThumbnail);
}

module.exports = load;

