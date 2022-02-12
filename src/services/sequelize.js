const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");

dotenv.config({ path: ".env" });

// Configurações para a conexão do Sequelize ao Banco de Dados
const dbConfig = {
  dialect: "postgres",
  protocol: "postgres",
  logging: false,
  ssl: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
};

// Cria Instância de Conexão com o Banco de Dados
const sequelize = new Sequelize(process.env.DATABASE_URL, dbConfig);

// Exporta uma instância do sequelize que servirá de interface para as conexões
module.exports = sequelize;
