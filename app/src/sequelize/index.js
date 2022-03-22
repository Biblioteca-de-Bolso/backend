const requireDir = require("require-dir");
const { Sequelize } = require("sequelize");
const env = process.env.NODE_ENV || "development";
const config = require("./config")[env];

const sequelize =
  env === "production"
    ? new Sequelize(process.env.DATABASE_URL, config)
    : new Sequelize(config.database, config.username, config.password, config);

const sequelizeSync = async () => {
  try {
    // Inclusão dos models
    const models = requireDir("../models");

    // Sincronização do Banco de Dados
    try {
      await sequelize.createSchema("bibliotecadebolso");
    } catch (error) {
      console.log("O Schema especificado já existe neste banco de dados");
    }
    await sequelize.sync({ force: false });
    console.log("Sincronização do banco de dados realizada com sucesso");
  } catch (error) {
    console.log(`Não foi possível sincronizar o Sequelize com o banco de dados: ${error.message}`);
  }
};

module.exports = { sequelize, sequelizeSync };
