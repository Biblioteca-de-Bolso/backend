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
    iat: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    exp: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    user_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    schema: "bibliotecadebolso",
    tableName: "refresh_token",
    timestamps: false,
  }
);

module.exports = RefreshToken;
