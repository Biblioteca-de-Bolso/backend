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

      const userId = parseInt(token["id"], 10);

      const bookId = parseInt(req.body["bookId"], 10);
      const { title, text, reference } = req.body;

      const rules = [
        [bookId, BookIdValidator, { required: true, allowEmpty: false }],
        [title, TitleValidator, { required: true, allowEmpty: false }],
        [text, TextValidator, { required: true, allowEmpty: false }],
        [reference, ReferenceValidator, { required: false, allowEmpty: true }],
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

      const userId = parseInt(token["id"], 10);

      const { page, bookId } = req.query;

      const rules = [
        [page, PageValidator, { required: false, allowEmpty: false }],
        [bookId, BookIdValidator, { required: false, allowEmpty: false }],
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

      const userId = parseInt(token["id"], 10);

      const id = parseInt(req.params["id"], 10);

      const rules = [[id, AnnotationIdValidator, { required: true, allowEmpty: false }]];

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

  async delete(req, res, next) {
    try {
      const { token } = req;

      const userId = parseInt(token["id"], 10);

      const id = parseInt(req.params["id"], 10);

      const rules = [[id, AnnotationIdValidator, { required: true, allowEmpty: false }]];

      const validationResult = validation.run(rules);

      if (validationResult.status === "error") {
        return res.status(400).json(validationResult);
      }

      const response = await AnnotationBusiness.delete(userId, id);

      return res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  },

  async putUpdate(req, res, next) {
    try {
      const { token } = req;

      const userId = parseInt(token["id"], 10);

      const annotationId = parseInt(req.body["annotationId"], 10);
      const { title, text, reference } = req.body;

      const rules = [
        [annotationId, AnnotationIdValidator, { required: false, allowEmpty: false }],
        [title, TitleValidator, { required: false, allowEmpty: false }],
        [text, TextValidator, { required: false, allowEmpty: false }],
        [reference, ReferenceValidator, { required: false, allowEmpty: true }],
      ];

      const validationResult = validation.run(rules);

      if (validationResult.status === "error") {
        return res.status(400).json(validationResult);
      }

      const response = await AnnotationBusiness.update(
        userId,
        annotationId,
        title,
        text,
        reference
      );

      return res.status(response.statusCode).json(response.body);
    } catch (error) {
      return next(error);
    }
  },
};
