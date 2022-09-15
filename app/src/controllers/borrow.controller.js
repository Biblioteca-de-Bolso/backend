const BorrowBusiness = require("../business/borrow.business");

const BookIdValidator = require("../validators/book/id.rules");
const ContactNameValidator = require("../validators/borrow/contactName.rules");

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
};
