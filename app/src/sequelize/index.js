const { Sequelize } = require("sequelize");

if (process.env.NODE_ENV === "production") {
  var { dbConfig, URI } = require("./config_prod");
} else {
  var { dbConfig, URI } = require("./config_dev");
}

console.log(`Database URI: ${URI}`);

dbConfig["logging"] = false;

const sequelize = new Sequelize(URI, dbConfig);

const sequelizeSync = async () => {
  try {
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
