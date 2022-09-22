const BookBusiness = require("../business/book.business");

const TitleValidator = require("../validators/book/title.rules");
const AuthorValidator = require("../validators/book/author.rules");
const ISBNValidator = require("../validators/book/isbn.rules");
const PublisherValidator = require("../validators/book/publisher.rules");
const DescriptionValidator = require("../validators/book/description.rules");
const ThumbnailValidator = require("../validators/book/thumbnail.rules");
const BookIdValidator = require("../validators/book/id.rules");
const PageValidator = require("../validators/shared/page.rules");
const ReadStatusValidator = require("../validators/book/readStatus.rules");
const SearchValidator = require("../validators/book/search.rules");

const validation = require("../modules/validation");

module.exports = {
  async create(req, res, next) {
    try {
      // Aquisição do token
      const { token } = req;

      const userId = parseInt(token.id, 10);

      // Validação dos parâmetros
      const { title, author, isbn, publisher, description, thumbnail } = req.body;

      // Extração da foto de upload
      const thumbnailFile = req.file;

      const rules = [
        [title, TitleValidator, { required: true, allowEmpty: false }],
        [author, AuthorValidator, { required: false, allowEmpty: true }],
        [isbn, ISBNValidator, { required: false, allowEmpty: true }],
        [publisher, PublisherValidator, { required: false, allowEmpty: true }],
        [description, DescriptionValidator, { required: false, allowEmpty: true }],
        [thumbnail, ThumbnailValidator, { required: false, allowEmpty: true }],
      ];

      const validationResult = validation.run(rules);

      if (validationResult.status === "error") {
        return res.status(400).json(validationResult);
      }

      const response = await BookBusiness.create(
        userId,
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
    const id = parseInt(req.params["id"], 10);

    const rules = [[id, BookIdValidator, { required: true, allowEmpty: false }]];

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
      const { token } = req;

      const userId = parseInt(token.id, 10);

      // Aquisição e validação dos parâmetros
      const { page, readStatus, search } = req.query;

      const rules = [
        [page, PageValidator, { required: false, allowEmpty: false }],
        [readStatus, ReadStatusValidator, { required: false, allowEmpty: false }],
        [search, SearchValidator, { required: false, allowEmpty: false }],
      ];

      const validationResult = validation.run(rules);

      if (validationResult.status === "error") {
        return res.status(400).json(validationResult);
      }

      // Token validado, prosseguir com a requisição
      const response = await BookBusiness.list(userId, page, readStatus, search);

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
      const bookId = parseInt(req.body["bookId"], 10);

      const rules = [[bookId, BookIdValidator, { required: true, allowEmpty: false }]];

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

  async putUpdate(req, res, next) {
    try {
      // Aquisição do token
      const { token } = req;

      // Aquisição do ID do usuário
      const userId = parseInt(token["id"], 10);

      // Validação dos parâmetros
      const { bookId, title, author, isbn, publisher, description, thumbnail, readStatus } =
        req.body;

      const rules = [
        [bookId, BookIdValidator, { required: true, allowEmpty: false }],
        [title, TitleValidator, { required: true, allowEmpty: false }],
        [author, AuthorValidator, { required: true, allowEmpty: true }],
        [isbn, ISBNValidator, { required: true, allowEmpty: true }],
        [publisher, PublisherValidator, { required: true, allowEmpty: true }],
        [description, DescriptionValidator, { required: true, allowEmpty: true }],
        [thumbnail, ThumbnailValidator, { required: true, allowEmpty: true }],
        [readStatus, ReadStatusValidator, { required: true, allowEmpty: false }],
      ];

      const validationResult = validation.run(rules);

      if (validationResult.status === "error") {
        return res.status(400).json(validationResult);
      }

      const response = await BookBusiness.update(
        userId,
        parseInt(bookId),
        title,
        author,
        isbn,
        publisher,
        description,
        thumbnail,
        readStatus
      );

      return res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  },

  async patchUpdate(req, res, next) {
    try {
      const { token } = req;

      const userId = parseInt(token["id"], 10);

      const { bookId, title, author, isbn, publisher, description, thumbnail, readStatus } =
        req.body;

      const rules = [
        [bookId, BookIdValidator, { required: false, allowEmpty: false }],
        [title, TitleValidator, { required: false, allowEmpty: false }],
        [author, AuthorValidator, { required: false, allowEmpty: true }],
        [isbn, ISBNValidator, { required: false, allowEmpty: true }],
        [publisher, PublisherValidator, { required: false, allowEmpty: true }],
        [description, DescriptionValidator, { required: false, allowEmpty: true }],
        [thumbnail, ThumbnailValidator, { required: false, allowEmpty: true }],
        [readStatus, ReadStatusValidator, { required: false, allowEmpty: false }],
      ];

      const validationResult = validation.run(rules);

      if (validationResult.status === "error") {
        return res.status(400).json(validationResult);
      }

      const response = await BookBusiness.update(
        userId,
        parseInt(bookId),
        title,
        author,
        isbn,
        publisher,
        description,
        thumbnail,
        readStatus
      );

      return res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  },

  async updateThumbnail(req, res, next) {
    try {
      const { token } = req;

      const userId = parseInt(token["id"], 10);

      let bookId = "";

      if (req.body.bookId) {
        bookId = parseInt(req.body.bookId.replace(/\D/g, ""), 10);
      }

      const thumbnailFile = req.file;

      const rules = [[bookId, BookIdValidator, { required: true, allowEmpty: false }]];

      const validationResult = validation.run(rules);

      if (validationResult.status === "error") {
        return res.status(400).json(validationResult);
      }

      const response = await BookBusiness.updateThumbnail(userId, bookId, thumbnailFile);

      return res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  },

  async removeThumbnail(req, res, next) {
    try {
      const { token } = req;

      const userId = parseInt(token["id"], 10);

      let bookId = "";

      if (req.body.bookId) {
        bookId = parseInt(req.body.bookId.replace(/\D/g, ""), 10);
      }

      const rules = [[bookId, BookIdValidator, { required: true, allowEmpty: false }]];

      const validationResult = validation.run(rules);

      if (validationResult.status === "error") {
        return res.status(400).json(validationResult);
      }

      const response = await BookBusiness.removeThumbnail(userId, bookId);

      return res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  },
};
