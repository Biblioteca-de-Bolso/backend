const DataTypes = require("sequelize");
const { sequelize } = require("../sequelize");

const Book = sequelize.define(
  "Book",
  {
    bookId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING(128),
      allowNull: true,
    },
    isbn_10: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    isbn_13: {
      type: DataTypes.STRING(13),
      allowNull: true,
    },
    publisher: {
      type: DataTypes.STRING(128),
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    thumbnail: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    readStatus: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    borrowStatus: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    schema: "bibliotecadebolso",
    tableName: "book",
    timestamps: true,
  }
);

module.exports = Book;
