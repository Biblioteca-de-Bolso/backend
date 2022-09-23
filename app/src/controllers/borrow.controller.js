const BorrowBusiness = require("../business/borrow.business");

const BookIdValidator = require("../validators/book/id.rules");
const ContactNameValidator = require("../validators/borrow/contactName.rules");
const BorrowIdValidator = require("../validators/borrow/id.rules");
const PageValidator = require("../validators/shared/page.rules");

const validation = require("../modules/validation");

module.exports = {
  async create(req, res, next) {
    try {
      const { token } = req;

      const userId = parseInt(token.id, 10);

      const { bookId, contactName, borrowStatus, borrowDate, devolutionDate } = req.body;

      const rules = [
        [bookId, BookIdValidator, { required: true, allowEmpty: false }],
        [contactName, ContactNameValidator, { required: true, allowEmpty: false }],
      ];

      const validationResult = validation.run(rules);

      if (validationResult.status === "error") {
        return res.status(400).json(validationResult);
      }

      const response = await BorrowBusiness.create(userId, bookId, contactName);

      return res.status(response.statusCode).json(response.body);
    } catch (error) {
      return next(error);
    }
  },

  async delete(req, res, next) {
    try {
      const { token } = req;

      const userId = parseInt(token.id, 10);

      const borrowId = parseInt(req.body["borrowId"], 10);

      const rules = [[borrowId, BorrowIdValidator, { required: true, allowEmpty: false }]];

      const validationResult = validation.run(rules);

      if (validationResult.status === "error") {
        return res.status(400).json(validationResult);
      }

      const response = await BorrowBusiness.delete(userId, borrowId);

      return res.status(response.statusCode).json(response.body);
    } catch (error) {
      return next(error);
    }
  },

  async list(req, res, next) {
    try {
      const { token } = req;

      const userId = parseInt(token.id, 10);

      const { page, bookId } = req.query;

      const rules = [
        [page, PageValidator, { required: false, allowEmpty: false }],
        [bookId, BookIdValidator, { required: false, allowEmpty: false }],
      ];

      const validationResult = validation.run(rules);

      if (validationResult.status === "error") {
        return res.status(400).json(validationResult);
      }

      const response = await BorrowBusiness.list(userId, page, bookId);

      return res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  },
};
