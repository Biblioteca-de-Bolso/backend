// Módulos necessário
const dayjs = require("dayjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const validator = require("validator");

const prisma = require("../prisma");

const { failure, unauthorized, ok } = require("../modules/http");
const {
  Unauthorized,
  AccountNotVerified,
  IncorrectParameter,
  DatabaseFailure,
} = require("../modules/codes");

module.exports = {
  async login(email, password) {
    // Verifica se a senha informada está no formato de hash MD5
    if (!validator.isMD5(password)) {
      password = crypto.createHash("md5").update(password).digest("hex");
    }

    // Verificação de usuário e senha contra o banco de dados
    const user = await prisma.user.findFirst({
      where: {
        email: email,
        password: password,
      },
    });

    if (user) {
      // Dados de usuário encontrados, conferir por status da conta
      if (user["active"]) {
        // Construir o payload do token com os dados necessários
        const payload = {
          userId: parseInt(user["id"]),
          email: user["email"],
          name: user["name"],
        };

        // Criar o token relacionado a esta operação de login
        const token = await this.createToken(payload);

        if (token.status === "error") {
          return failure(token);
        } else {
          return ok(token);
        }
      } else {
        return ok({
          status: "error",
          code: AccountNotVerified,
          message:
            "Para realizar o login, é necessário realizar a confirmação de cadastro via email.",
        });
      }
    } else {
      return unauthorized({
        status: "error",
        code: Unauthorized,
        message: "Usuário ou senha incorretos.",
      });
    }
  },

  async verifyAccount(userId, email, activationCode) {
    // Buscar os dados de usuário do banco de dados
    const user = await prisma.user.findFirst({
      where: {
        id: parseInt(userId),
        email: email,
        active: false,
      },
    });

    if (user) {
      // Usuario encontrado, realizar modificação de ativação
      const activeUser = await prisma.user.update({
        where: {
          id: parseInt(userId),
        },
        data: { active: true },
      });

      // Os objetos a seguir são objetos simples, e não objetos http
      if (activeUser) {
        return {
          status: "ok",
          response: {
            message: "Conta de usuário confirmada com sucesso.",
          },
        };
      } else {
        return {
          status: "error",
          error: DatabaseFailure,
          message: "Erro durante a confirmação de conta de usário.",
        };
      }
    } else {
      return {
        status: "error",
        code: IncorrectParameter,
        message: "Os dados de usuários ou de confirmação não são válidos.",
      };
    }
  },

  async createToken(payload) {
    // Realiza assinatura do token com base no payload e no token secret da aplicação
    const accessToken = jwt.sign(payload, process.env.JWT_TOKEN_SECRET, {
      expiresIn: 60 * 60 * 24,
    });

    // Criação de um novo refresh token
    const randomToken = crypto.randomBytes(64).toString("hex");

    // Criação das datas "issued at" e "expiration" em formato unix ms
    const iat = dayjs().valueOf();
    const exp = dayjs(iat).add(7, "day").valueOf();

    // Converte o formato das datas em segundos (desconsiderar últimos três caracteres)
    const iatString = iat.toString().slice(0, 10);
    const expString = exp.toString().slice(0, 10);

    // Salvar o refresh token no banco de dados
    const refresh = await prisma.refreshToken.create({
      data: {
        id: randomToken,
        email: payload["email"],
        userId: payload["userId"],
        iat: iatString,
        exp: expString,
      },
    });

    if (refresh) {
      return {
        status: "ok",
        response: {
          accessToken: accessToken,
          refreshToken: randomToken,
        },
      };
    } else {
      return {
        status: "error",
        code: DatabaseFailure,
        message: "Não foi possível realizar o registro do refresh token criado.",
      };
    }
  },

  async verifyToken(token) {
    // Tenta realizar validação do token informado
    const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET);

    // Token validado com sucesso, extrair dados de usuário
    const user = await prisma.user.findFirst({
      where: {
        id: parseInt(decoded["userId"]),
        email: decoded["email"],
      },
    });

    if (user) {
      return decoded;
    } else {
      return {
        error: "Dados de usuário presente no token não são válidos.",
      };
    }
  },
};
