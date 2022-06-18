const BookBusiness = require("../business/book.business");

const TitleValidator = require("../validators/book/title.rules");
const AuthorValidator = require("../validators/book/author.rules");
const ISBNValidator = require("../validators/book/isbn.rules");
const PublisherValidator = require("../validators/book/publisher.rules");
const DescriptionValidator = require("../validators/book/description.rules");
const ThumbnailValidator = require("../validators/book/thumbnail.rules");
const BookIdValidator = require("../validators/book/id.rules");
const PageValidator = require("../validators/shared/page.rules");

const validation = require("../modules/validation");

module.exports = {
  async create(req, res, next) {
    try {
      // Aquisição do token
      const { token } = req;

      // Validação dos parâmetros
      const { title, author, isbn, publisher, description, thumbnail } = req.body;

      // Extração da foto de upload
      const thumbnailFile = req.file;

      const rules = [
        [title, TitleValidator, { required: true }],
        [author, AuthorValidator, { required: false }],
        [isbn, ISBNValidator, { required: false }],
        [publisher, PublisherValidator, { required: false }],
        [description, DescriptionValidator, { required: false }],
        [thumbnail, ThumbnailValidator, { required: false }],
      ];

      const validationResult = validation.run(rules);

      if (validationResult.status === "error") {
        return res.status(400).json(validationResult);
      }

      const response = await BookBusiness.create(
        token,
        title,
        author,
        isbn,
        publisher,
        description,
        thumbnail,
        thumbnailFile
      );

      return res.status(response.statusCode).json(response.body);
    } catch (error) {
      return next(error);
    }
  },

  async read(req, res, next) {
    // Aquisição do token
    const { token } = req;

    // Aquisição e validação dos parâmetros
    const id = parseInt(req.params["id"]);

    const rules = [[id, BookIdValidator]];

    const validationResult = validation.run(rules);

    if (validationResult.status === "error") {
      return res.status(400).json(validationResult);
    }

    // Token validado, prosseguir com a requisição
    const response = await BookBusiness.read(token, id);

    // Retornar com resultado da operação
    return res.status(response.statusCode).json(response.body);
  },

  async list(req, res, next) {
    try {
      // Aquisição do token
      const { token } = req;

      // Aquisição e validação dos parâmetros
      const page = req.query["page"];

      const rules = [[page, PageValidator, { required: false }]];

      const validationResult = validation.run(rules);

      if (validationResult.status === "error") {
        return res.status(400).json(validationResult);
      }

      // Token validado, prosseguir com a requisição
      const response = await BookBusiness.list(token, page);

      // Retornar com resultado da operação
      return res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  },

  async delete(req, res, next) {
    try {
      // Aquisição do token
      const { token } = req;

      // Aquisição e validação dos parâmetros
      const bookId = parseInt(req.body["bookId"]);

      const rules = [[bookId, BookIdValidator]];

      const validationResult = validation.run(rules);

      if (validationResult.status === "error") {
        return res.status(400).json(validationResult);
      }

      // Token validado, prosseguir com a requisição
      const response = await BookBusiness.delete(token, bookId);

      // Retornar com resultado da operação
      return res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  },
};
