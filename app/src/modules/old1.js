const { Sequelize } = require("sequelize");

let DB_USER, DB_PASS, DB_HOST, DB_PORT, DB_NAME, DB_SSL;

if (process.env.NODE_ENV === "production") {
  DB_SSL = true;
  DB_USER = process.env.DB_USER_PROD;
  DB_PASS = process.env.DB_PASS_PROD;
  DB_HOST = process.env.DB_HOST_PROD;
  DB_PORT = process.env.DB_PORT_PROD;
  DB_NAME = process.env.DB_NAME_PROD;
} else {
  DB_SSL = false;
  DB_USER = process.env.DB_USER;
  DB_PASS = process.env.DB_PASS;
  DB_HOST = process.env.DB_HOST;
  DB_PORT = process.env.DB_PORT;
  DB_NAME = process.env.DB_NAME;
}

const URI = `postgres://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;

console.log(`URI for database connection: ${URI}`);

const dbConfig = {
  dialect: "postgres",
  protocol: "postgres",
  logging: false,

  ssl: DB_SSL,
  dialectOptions: {
    ssl: {
      require: DB_SSL,
      rejectUnauthorized: false,
    },
  },
};

const sequelize = new Sequelize(URI, dbConfig);

module.exports = sequelize;
