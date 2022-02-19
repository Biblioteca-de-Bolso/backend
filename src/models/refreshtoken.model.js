const DataTypes = require("sequelize");
const sequelize = require("../modules/sequelize");

const RefreshToken = sequelize.define(
  "RefreshToken",
  {
    id: {
      type: DataTypes.STRING(128),
      primaryKey: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    iat: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    exp: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    schema: "bibliotecadebolso",
    tableName: "refreshtoken",
    timestamps: true,
  }
);

module.exports = RefreshToken;
