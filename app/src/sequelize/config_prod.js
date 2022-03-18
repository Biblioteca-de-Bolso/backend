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

// A variável de ambiente DATABASE_URL é provisionada pelo Heroku
const URI = process.env.DATABASE_URL;

module.exports = { dbConfig, URI };
