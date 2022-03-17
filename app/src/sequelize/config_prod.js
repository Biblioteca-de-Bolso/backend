DB_USER = process.env.DB_USER_PROD;
DB_PASS = process.env.DB_PASS_PROD;
DB_HOST = process.env.DB_HOST_PROD;
DB_PORT = process.env.DB_PORT_PROD;
DB_NAME = process.env.DB_NAME_PROD;

const dbConfig = {
  dialect: "postgres",
  protocol: "postgres",
  ssl: true,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
};

const URI = `postgres://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;

module.exports = { dbConfig, URI };
