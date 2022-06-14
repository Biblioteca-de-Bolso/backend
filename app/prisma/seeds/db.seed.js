const crypto = require("crypto");
const dotenv = require("dotenv").config({ path: "../../../.env" });
const prisma = require("../../src/prisma");

module.exports = async () => {
  console.log("Running seeds.");

  const users = [
    // A conta do Allan Turing é utilizada para o teste de ativação de conta de usuário
    {
      name: "Allan Turing",
      email: "allan@email.com",
      password: crypto.createHash("md5").update("allanturing").digest("hex"),
      active: false,
      activationCode: "1234567812345678",
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
    // A conta da Ada é utilizada para o teste de leitura de usuário e de login
    {
      name: "Ada Lovelace",
      email: "ada@email.com",
      password: crypto.createHash("md5").update("adalovelace").digest("hex"),
      active: true,
      activationCode: "1234567812345678",
      // O livro de ID 4 (segundo livro da Ada) é utilizado para o teste de exclusão
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
    // A conta do Von Neumann deve permencer inativa para falhar no teste de login
    {
      name: "Von Neumann",
      email: "vonneumann@email.com",
      password: crypto.createHash("md5").update("vonneumann").digest("hex"),
      active: false,
      activationCode: "1234567812345678",
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
    // A conta do Dennis é utilizada para o teste de remoção de usuário
    {
      name: "Dennis Ritchie",
      email: "dennisritchie@email.com",
      password: crypto.createHash("md5").update("dennisritchie").digest("hex"),
      active: true,
      activationCode: "1234567812345678",
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
            },
            {
              title: "Livro de Compiladores",
              author: "Autor do Livro de Compiladores",
              isbn10: "658843121X",
              isbn13: "9786588431214",
              publisher: "Editora do Livro de Compiladores",
              description: "Descrição do livro de Compiladores",
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
