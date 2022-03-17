const { Sequelize } = require("sequelize");

if (process.env.NODE_ENV === "production") {
  var { dbConfig, URI } = require("./config_prod");
} else {
  var { dbConfig, URI } = require("./config_dev");
}

console.log(`Database URI: ${URI}`);

dbConfig["logging"] = false;

const sequelize = new Sequelize(URI, dbConfig);

module.exports = sequelize;
