DB_USER = process.env.DB_USER_DEV;
DB_PASS = process.env.DB_PASS_DEV;
DB_HOST = process.env.DB_HOST_DEV;
DB_PORT = process.env.DB_PORT_DEV;
DB_NAME = process.env.DB_NAME_DEV;

const dbConfig = {
  dialect: "postgres",
  protocol: "postgres",
};

const URI = `postgres://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;

module.exports = { dbConfig, URI };
