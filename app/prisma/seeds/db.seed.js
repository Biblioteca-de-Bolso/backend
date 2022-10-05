const crypto = require("crypto");
const dotenv = require("dotenv").config({ path: "../../../.env" });
const prisma = require("../../src/prisma");

module.exports = async () => {
  console.log("Running seeds.");

  const users = [
    // User ID: 1
    // A conta do Allan Turing é utilizada para o teste de ativação de conta de usuário
    // Livros desse usuário: 1 e 2
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
    // User ID: 2
    // A conta da Ada é utilizada para o teste de leitura de usuário e de login
    // Livros desse usuário: 3 e 4
    {
      name: "Ada Lovelace",
      email: "ada@email.com",
      password: crypto.createHash("md5").update("adalovelace").digest("hex"),
      active: true,
      activationCode: "1234567812345678",
      // O livro de ID 3 (primeiro livro da Ada) é utilizado para o teste de criar anotação
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
    // User ID: 3
    // A conta do Von Neumann deve permencer inativa para falhar no teste de login
    // Livros desse usuário: 5 e 6
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
    // User ID: 4
    // A conta do Dennis é utilizada para o teste de remoção de usuário
    // Livros desse usuário: 7 e 8
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
    // User ID: 5
    // A conta do Charles Babbage é utilizada nos testes de listagem de livros
    // Livros desse usuário: 9 e 10
    {
      name: "Charles Babbage",
      email: "charlesbabbage@email.com",
      password: crypto.createHash("md5").update("charlesbabbage").digest("hex"),
      active: true,
      activationCode: "1234567812345678",
      books: {
        createMany: {
          data: [
            {
              title: "Matemática Discreta",
              author: "Autor do Matemática Discreta",
              isbn10: "8550811483",
              isbn13: "9788550811482",
              publisher: "Editora do Matemática Discreta",
              description: "Descrição do Matemática Discreta",
            },
            {
              title: "Máquinas Digitais",
              author: "Autor do Máquinas Digitais",
              isbn10: "658843121X",
              isbn13: "9786588431214",
              publisher: "Editora do Máquinas Digitais",
              description: "Descrição do Matemática Discreta",
            },
          ],
        },
      },
    },
    // User ID: 6
    // A conta do Andrew Tenenbaum será utilizada para testes de recuperação de senha
    // Utilizado nos testes de solicitação de código de recuperação
    {
      name: "Andrew Tenenbaum",
      email: "andrewtenenbaum@email.com",
      password: crypto.createHash("md5").update("andrewtenenbaum").digest("hex"),
      active: true,
      activationCode: "1234567812345678",
    },
    // User ID: 7
    // A conta do Johh Carmack será utilizada para testes de recuperação de senha
    // Utilizado nos testes de alteração de senha de usuário
    {
      name: "John Carmack",
      email: "johncarmack@email.com",
      password: crypto.createHash("md5").update("johncarmack").digest("hex"),
      active: true,
      activationCode: "1234567812345678",
      recovers: {
        createMany: {
          data: [
            // Recover Code ID: 1
            // Não foi ativado, pode ser utilizado
            {
              code: "e039fdcfc58dd51d",
              active: true,
            },
            // Recover Code ID: 2
            // Código expirado, está inativo, não pode ser utilizado
            {
              code: "ab4736e81ad05968",
              active: false,
            },
          ],
        },
      },
    },
  ];

  const annotations = [
    // Anotação de ID 1, do Charles Babbage no livro 9
    {
      userId: 5,
      bookId: 9,
      title: "Anotação sobre Matemática discreta",
      text: "A matemática discreta é muito legal",
      reference: "Cap 2, Pag 6",
    },
    // Anotação de ID 2, do Charles Babbage no livro 10
    {
      userId: 5,
      bookId: 10,
      title: "Anotação sobre Máquinas Digitais",
      text: "Máquinas Digitais são melhores que analógicas?",
      reference: "Cap VI",
    },
    // Anotação de ID 3, da Ada Lovelace no livro 3
    {
      userId: 2,
      bookId: 3,
      title: "Anotação sobre livro de programação",
      text: "Programação é muito legal, pois eu que criei",
      reference: "Página 287",
    },
  ];

  try {
    for (const user of users) {
      await prisma.user.create({
        data: user,
      });
    }

    for (const annotation of annotations) {
      await prisma.annotation.create({
        data: annotation,
      });
    }
  } catch (error) {
    console.log(`Error while running seeds: ${error.message}`);
  }

  console.log("All seeds have been runned.");
};
