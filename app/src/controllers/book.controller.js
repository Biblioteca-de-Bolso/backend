const BookBusiness = require("../business/book.business");

module.exports = {
  async create(req, res, next) {
    try {
      // Aquisição do token
      const { decoded } = req;

      // Validação dos parâmetros
      const { title, author, isbn, publisher, description, thumbnail } = req.body;

      const rules = [];
    } catch (error) {
      return next(error);
    }
  },

  async list(req, res, next) {
    try {
      // Aquisição do token
      const { decoded } = req;

      // Token validado, prosseguir com a requisição
      const response = await BookBusiness.list();

      // Retornar com resultado da operação
      return res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  },
};
