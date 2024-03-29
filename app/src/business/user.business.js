const crypto = require("crypto");
const validator = require("validator");

const prisma = require("../prisma");
const sendgrid = require("../services/sendgrid");
const { fileName } = require("../modules/debug");

const {
  conflict,
  created,
  failure,
  ok,
  forbidden,
  notFound,
  unauthorized,
} = require("../modules/http");
const {
  OkStatus,
  ErrorStatus,
  EmailAlreadyInUse,
  DatabaseFailure,
  NotFound,
  Forbidden,
  Unauthorized,
} = require("../modules/codes");

module.exports = {
  async create(email, name, password) {
    const existentUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (existentUser) {
      return conflict({
        status: ErrorStatus,
        code: EmailAlreadyInUse,
        message: "Este endereço de email já foi cadastrado por outro usuário.",
      });
    }

    password = crypto.createHash("md5").update(password).digest("hex");

    const activationCode = crypto.randomBytes(8).toString("hex");

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password,
        activationCode,
      },
    });

    if (!user) {
      return failure({
        status: ErrorStatus,
        code: DatabaseFailure,
        message: "Não foi possível inserir o novo usuário no banco de dados.",
      });
    }

    // Não enviar email de cadastro em ambiente de teste
    const sendEmailLocally = false;

    if (process.env.NODE_ENV === "production" || sendEmailLocally) {
      try {
        const { emailHtml, emailText } = await sendgrid.composeInviteEmail(
          user.id,
          user.name,
          user.email,
          user.activationCode
        );

        await sendgrid.sendEmail(
          user.email,
          emailText,
          emailHtml,
          "Bem vindo(a) à Biblioteca de Bolso!"
        );
      } catch (error) {
        console.log(fileName(), `Erro durante envio de email: ${error.message}`);
      }
    } else {
      if (process.env.NODE_ENV !== "test") {
        console.log(
          fileName(),
          "Criação de usuário em ambiente de testes/desenvolvimento, pulando etapa de envio de email."
        );
      }
    }

    return created({
      status: OkStatus,
      response: {
        user: user,
      },
    });
  },

  async delete(token, userId, email, password) {
    userId = parseInt(userId, 10);

    // Aplicar hash MD5 na senha, se necessário
    if (!validator.isMD5(password)) {
      password = crypto.createHash("md5").update(password).digest("hex");
    }

    // Adquirir dados do usuário informado
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
        email: email,
        password: password,
      },
    });

    if (!user) {
      return unauthorized({
        status: ErrorStatus,
        code: Unauthorized,
        message: "Não foi possível completar a solicitação, verifique os parâmetros informados.",
      });
    }

    // Verifica veracidade dos dados
    if (user.id !== token.id && user.email !== token.email && user.password !== password) {
      return forbidden({
        status: ErrorStatus,
        code: Forbidden,
        message: "O usuário informado não possui permissão para completar esta ação.",
      });
    }

    // Remover todos os dados de usuário (de todas as tabelas)
    const deleted = await prisma.$transaction([
      prisma.annotation.deleteMany({
        where: {
          userId,
        },
      }),
      prisma.borrow.deleteMany({
        where: {
          userId,
        },
      }),
      prisma.book.deleteMany({
        where: {
          userId,
        },
      }),
      prisma.refreshToken.deleteMany({
        where: {
          userId,
        },
      }),
      prisma.recover.deleteMany({
        where: {
          userId,
        },
      }),
      prisma.user.delete({
        where: {
          id: userId,
        },
      }),
    ]);

    // Verifica sucesso da exclusão
    if (deleted) {
      return ok({
        status: OkStatus,
        response: {
          message: "Conta e dados de usuário removidos com sucesso.",
        },
      });
    } else {
      return failure({
        status: ErrorStatus,
        code: DatabaseFailure,
        message: "Não foi possível realizar a exclusão de um ou mais dados do banco de dados.",
      });
    }
  },

  async read(token, userId) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return notFound({
        status: ErrorStatus,
        code: NotFound,
        message: "O usuário informado não foi encontrado.",
      });
    }

    // Remover o campo de senha do retorno
    delete user["password"];

    // Verificar permissão de acesso aos dados desse usuário
    if (user["id"] == token["id"] && user["email"] === token["email"]) {
      return ok({
        status: OkStatus,
        response: {
          user: user,
        },
      });
    } else {
      return forbidden({
        status: ErrorStatus,
        code: Forbidden,
        message: "Este usuário não possui permissão para acessar a informação solicitada.",
      });
    }
  },
};
