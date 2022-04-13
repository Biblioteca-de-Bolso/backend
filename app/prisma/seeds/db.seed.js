const crypto = require("crypto");
const dotenv = require("dotenv").config({ path: "../../../.env" });
const prisma = require("../../src/prisma");

module.exports = async () => {
  console.log("Running Seeds.");

  const users = [
    {
      name: "Allan Turing",
      email: "allan@email.com",
      password: crypto.createHash("md5").update("allanturing").digest("hex"),
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
      password: crypto.createHash("md5").update("adalovelace").digest("hex"),
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
      password: crypto.createHash("md5").update("vonneumann").digest("hex"),
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
    {
      name: "Dennis Ritchie",
      email: "dennisritchie@email.com",
      password: crypto.createHash("md5").update("dennisritchie").digest("hex"),
      active: true,
      activationCode: "123456789",
      books: {
        createMany: {
          data: [
            {
              title: "Livro de C",
              author: "Autor do Livro de C",
              isbn10: "8550811483",
              isbn13: "9788550811482",
              publisher: "Editora do Livro de C",
              description: "Descrição do livro de C",
              // annotations: {
              //   createMany: {
              //     data: [
              //       {
              //         userId: 4,
              //         bookId: 7,
              //         title: "Anotação sobre livro de C",
              //         text: "C é muito legal",
              //       },
              //     ],
              //   },
              // },
            },
            {
              title: "Livro de Compiladores",
              author: "Autor do Livro de Compiladores",
              isbn10: "658843121X",
              isbn13: "9786588431214",
              publisher: "Editora do Livro de Compiladores",
              description: "Descrição do livro de Compiladores",
              // annotations: {
              //   createMany: {
              //     data: [
              //       {
              //         userId: 4,
              //         bookId: 8,
              //         title: "Anotação sobre livro de Compiladores",
              //         text: "Compiladores são muito legais",
              //       },
              //     ],
              //   },
              // },
            },
          ],
        },
      },
    },
  ];

  try {
    for (const user of users) {
      await prisma.user.create({
        data: user,
      });
    }
  } catch (error) {
    console.log(`Error while running seeds: ${error.message}`);
  }

  console.log("All seeds have been runned.");
};
