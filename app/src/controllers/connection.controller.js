const sequelize = require("../sequelize");

module.exports = {
  async connection() {
    try {
      await sequelize.authenticate();
      console.log("Connection has been established successfully.");
    } catch (error) {
      console.error("Unable to connect to the database:", error.message);
    }

    res.status(200).send({
      message: "Teste de conexão com o banco de dados realizado com sucesso",
    });
  },
};
