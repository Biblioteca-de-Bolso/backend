const dotenv = require("dotenv").config({ path: "../../../.env" });

const prisma = require("../../src/prisma");

console.log("Running Seeds");

const users = [
  {
    name: "Allan Turing",
    email: "allan@email.com",
    password: "allanturing",
    active: false,
    activationCode: "123456789",
    books: {
      createMany: {
        data: [
          {
            title: "Livro Legal",
            author: "Autor do Livro Legal",
            isbn10: "8550811483",
            isbn13: "9788550811482",
            publisher: "Editora do Livro Legal",
            description: "Descrição do livro legal",
          },
          {
            title: "Livro Chato",
            author: "Autor do Livro Chato",
            isbn10: "658843121X",
            isbn13: "9786588431214",
            publisher: "Editora do Livro Chato",
            description: "Descrição do livro chato",
          },
        ],
      },
    },
  },
  {
    name: "Ada Lovelace",
    email: "ada@email.com",
    password: "adalovelace",
    active: true,
    activationCode: "123456789",
    books: {
      createMany: {
        data: [
          {
            title: "Livro de Programação",
            author: "Autor do Livro de Programação",
            isbn10: "8550811483",
            isbn13: "9788550811482",
            publisher: "Editora do Livro de Programação",
            description: "Descrição do livro de Programação",
          },
          {
            title: "Livro de Banco de Dados",
            author: "Autor do Livro de Banco de Dados",
            isbn10: "658843121X",
            isbn13: "9786588431214",
            publisher: "Editora do Livro de Banco de Dados",
            description: "Descrição do livro de Banco de Dados",
          },
        ],
      },
    },
  },
  {
    name: "Von Neumann",
    email: "vonneumann@email.com",
    password: "vonneumann",
    active: true,
    activationCode: "123456789",
    books: {
      createMany: {
        data: [
          {
            title: "Livro de Microcontroladores",
            author: "Autor do Livro de Microcontroladores",
            isbn10: "8550811483",
            isbn13: "9788550811482",
            publisher: "Editora do Livro de Microcontroladores",
            description: "Descrição do livro de Microcontroladores",
          },
          {
            title: "Livro de Sistemas Digitais",
            author: "Autor do Livro de Sistemas Digitais",
            isbn10: "658843121X",
            isbn13: "9786588431214",
            publisher: "Editora do Livro de Sistemas Digitais",
            description: "Descrição do livro de Sistemas Digitais",
          },
        ],
      },
    },
  },
];

seed = async () => {
  try {
    for (const user of users) {
      await prisma.user.create({
        data: user,
      });
    }
  } catch (error) {
    console.log(`Um erro ocorreu durante a criação dos seeds: ${error.message}`);
  }
};

seed();
