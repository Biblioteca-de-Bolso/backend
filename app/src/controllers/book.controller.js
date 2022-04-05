const BookBusiness = require("../business/book.business");

const TitleValidator = require("../validators/book/title.rules");
const AuthorValidator = require("../validators/book/author.rules");
const ISBNValidator = require("../validators/book/isbn.rules");
const PublisherValidator = require("../validators/book/publisher.rules");
const DescriptionValidator = require("../validators/book/description.rules");
const ThumbnailValidator = require("../validators/book/thumbnail.rules");
const BookIdValidator = require("../validators/book/id.rules");

const validation = require("../modules/validation");

module.exports = {
  async create(req, res, next) {
    try {
      // Aquisição do token
      const { token } = req;

      // Validação dos parâmetros
      const { title, author, isbn, publisher, description, thumbnail } = req.body;

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
        thumbnail
      );

      res.status(response.statusCode).json(response.body);
    } catch (error) {
      return next(error);
    }
  },

  async read(req, res, next) {
    // Aquisição do token
    const { token } = req;

    // Aquisição e validação dos parâmetros
    const { id } = req.params;

    const rules = [[id, BookIdValidator]];

    const validationResult = validation.run(rules);

    if (validationResult.status === "error") {
      return res.status(400).json(validationResult);
    }

    // Token validado, prosseguir com a requisição
    const response = await BookBusiness.read(token);

    // Retornar com resultado da operação
    return res.status(response.statusCode).json(response.body);
  },

  async list(req, res, next) {
    try {
      // Aquisição do token
      const { token } = req;

      // Token validado, prosseguir com a requisição
      const response = await BookBusiness.list();

      // Retornar com resultado da operação
      return res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  },
};
