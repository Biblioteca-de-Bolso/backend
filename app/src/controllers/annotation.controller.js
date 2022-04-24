const AnnotationBusiness = require("../business/annotation.business");

const BookIdValidator = require("../validators/book/id.rules");
const TitleValidator = require("../validators/annotation/title.rules");
const TextValidator = require("../validators/annotation/text.rules");
const PageValidator = require("../validators/shared/page.rules");

const validation = require("../modules/validation");

module.exports = {
  async create(req, res, next) {
    try {
      // Aquisição do token
      const { token } = req;

      // Validação dos parâmetros
      const bookId = parseInt(req.body["bookId"]);
      const { title, text, page } = req.body;

      const rules = [
        [bookId, BookIdValidator, { required: true }],
        [title, TitleValidator, { required: true }],
        [text, TextValidator, { required: false }],
        [page, PageValidator, { required: false }],
      ];

      const validationResult = validation.run(rules);

      if (validationResult.status === "error") {
        return res.status(400).json(validationResult);
      }

      const response = await AnnotationBusiness.create(token, bookId, title, text, page);

      return res.status(response.statusCode).json(response.body);
    } catch (error) {
      return next(error);
    }
  },
};
