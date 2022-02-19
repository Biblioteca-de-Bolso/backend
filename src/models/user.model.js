const DataTypes = require("sequelize");
const sequelize = require("../modules/sequelize");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(32),
      allowNull: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    activationCode: {
      type: DataTypes.STRING(16),
      allowNull: true,
    },
  },
  {
    schema: "bibliotecadebolso",
    tableName: "usuario",
    timestamps: true,
  }
);

module.exports = User;
