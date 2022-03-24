module.exports = {
  development: {
    username: process.env.DB_USER_DEV,
    password: process.env.DB_PASS_DEV,
    database: process.env.DB_NAME_DEV,
    host: process.env.DB_HOST_DEV,
    dialect: "postgres",
    logging: false,
  },
  test: {
    username: "bibliotecadebolso",
    password: "123456789",
    database: "bibliotecadebolso",
    host: "database_test",
    dialect: "postgres",
    logging: false,
  },
  production: {
    dialect: "postgres",
    logging: false,
    ssl: true,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};
