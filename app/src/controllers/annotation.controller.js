const AnnotationBusiness = require("../business/annotation.business");

const BookIdValidator = require("../validators/book/id.rules");
const TitleValidator = require("../validators/annotation/title.rules");
const TextValidator = require("../validators/annotation/text.rules");
const ReferenceValidator = require("../validators/annotation/reference.rules");
const PageValidator = require("../validators/shared/page.rules");
const AnnotationIdValidator = require("../validators/annotation/id.rules");

const validation = require("../modules/validation");

module.exports = {
  async create(req, res, next) {
    try {
      const { token } = req;

      const userId = parseInt(token["id"]);

      const bookId = parseInt(req.body["bookId"]);
      const { title, text, reference } = req.body;

      const rules = [
        [bookId, BookIdValidator, { required: true }],
        [title, TitleValidator, { required: true }],
        [text, TextValidator, { required: true }],
        [reference, ReferenceValidator, { required: false }],
      ];

      const validationResult = validation.run(rules);

      if (validationResult.status === "error") {
        return res.status(400).json(validationResult);
      }

      const response = await AnnotationBusiness.create(userId, bookId, title, text, reference);

      return res.status(response.statusCode).json(response.body);
    } catch (error) {
      return next(error);
    }
  },

  async list(req, res, next) {
    try {
      const { token } = req;

      const userId = parseInt(token["id"]);

      const { page, bookId } = req.query;

      const rules = [
        [page, PageValidator, { required: false }],
        [bookId, BookIdValidator, { required: false }],
      ];

      const validationResult = validation.run(rules);

      if (validationResult.status === "error") {
        return res.status(400).json(validationResult);
      }

      const response = await AnnotationBusiness.list(userId, page, bookId);

      return res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  },

  async read(req, res, next) {
    try {
      const { token } = req;

      const userId = parseInt(token["id"]);

      const id = parseInt(req.params["id"]);

      const rules = [[id, AnnotationIdValidator]];

      const validationResult = validation.run(rules);

      if (validationResult.status === "error") {
        return res.status(400).json(validationResult);
      }

      // Token validado, prosseguir com a requisição
      const response = await AnnotationBusiness.read(userId, id);

      // Retornar com resultado da operação
      return res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  },
};
