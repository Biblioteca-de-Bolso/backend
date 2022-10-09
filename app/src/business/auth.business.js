const dayjs = require("dayjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const validator = require("validator");
const { fileName } = require("../modules/debug");
const sendgrid = require("../services/sendgrid");

const prisma = require("../prisma");

const { failure, unauthorized, ok, forbidden, notFound, conflict } = require("../modules/http");
const {
  OkStatus,
  ErrorStatus,
  Unauthorized,
  AccountNotVerified,
  IncorrectParameter,
  DatabaseFailure,
  JWTFailure,
  JWTExpired,
  JWTNotBefore,
  InvalidRefreshToken,
  RefreshTokenNotBefore,
  RefreshTokenExpired,
  Forbidden,
  NotFound,
  RecoverCodeRedeemed,
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

    if (!user) {
      return unauthorized({
        status: ErrorStatus,
        code: Unauthorized,
        message: "Usuário ou senha incorretos.",
      });
    }

    // Dados de usuário encontrados, conferir o status da conta
    if (!user.active) {
      return ok({
        status: ErrorStatus,
        code: AccountNotVerified,
        message:
          "Para realizar o login, é necessário realizar a confirmação de cadastro via email.",
      });
    }

    // Construir o payload do token com os dados necessários
    const payload = {
      id: parseInt(user["id"], 10),
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
  },

  async verifyAccount(userId, email, activationCode) {
    // Buscar os dados de usuário do banco de dados
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
        email: email,
        activationCode: activationCode,
        active: false,
      },
    });

    if (!user) {
      return {
        status: ErrorStatus,
        code: IncorrectParameter,
        message: "Os dados de usuários ou de confirmação não são válidos.",
      };
    }

    // Usuario encontrado, realizar modificação de ativação
    const activeUser = await prisma.user.updateMany({
      where: {
        id: userId,
        activationCode: activationCode,
      },
      data: { active: true },
    });

    // Os objetos a seguir são objetos simples, e não objetos http
    if (activeUser) {
      return {
        status: OkStatus,
        response: {
          message: "Conta de usuário confirmada com sucesso.",
        },
      };
    } else {
      return {
        status: ErrorStatus,
        error: DatabaseFailure,
        message: "Erro durante a confirmação de conta de usário.",
      };
    }
  },

  async createToken(payload, duration = 60 * 60 * 24) {
    // Realiza assinatura do token com base no payload e no token secret da aplicação
    const accessToken = jwt.sign(payload, process.env.JWT_TOKEN_SECRET, {
      expiresIn: duration,
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
        userId: payload["id"],
        iat: iatString,
        exp: expString,
      },
    });

    if (refresh) {
      return {
        status: OkStatus,
        response: {
          accessToken: accessToken,
          refreshToken: randomToken,
        },
      };
    } else {
      return {
        status: ErrorStatus,
        code: JWTFailure,
        message: "Não foi possível realizar o registro do refresh token criado.",
      };
    }
  },

  async refreshToken(token, refreshToken) {
    const userId = parseInt(token["id"], 10);
    const userEmail = token["email"];
    const userName = token["name"];

    const refresh = await prisma.refreshToken.findUnique({
      where: {
        id: refreshToken,
      },
    });

    if (!refresh) {
      return ok({
        status: ErrorStatus,
        code: InvalidRefreshToken,
        message: "O refresh token informado não foi encontrado na base de dados de autenticação.",
      });
    }

    // Verificação de autenticidade do refresh token informado
    if (userId !== parseInt(refresh.userId, 10) || userEmail !== refresh.email) {
      return forbidden({
        status: ErrorStatus,
        code: Forbidden,
        message:
          "Os dados presentes no token não são válidos com os dados presentes no refresh token.",
      });
    }

    // Verificações de validade do refresh token informado
    const currentTime = dayjs().valueOf().toString().slice(0, 10);

    if (currentTime < parseInt(refresh["iat"], 10)) {
      return ok({
        status: ErrorStatus,
        code: RefreshTokenNotBefore,
        message:
          "O horário de criação do refresh token informado é anterior ao horário atual, ajuste o horário do seu dispositivo.",
      });
    }

    if (currentTime > parseInt(refresh["exp"], 10)) {
      return ok({
        status: ErrorStatus,
        code: RefreshTokenExpired,
        message: "O refresh token informado expirou, realize o login novamente.",
      });
    }

    // Todas as validações foram executadas, criar novo token de acesso
    const newToken = await this.createToken({
      id: userId,
      email: userEmail,
      name: userName,
    });

    if (newToken["status"] === "ok") {
      // Token criado com sucesso, aplicar Refresh Token Rotation
      await prisma.refreshToken.delete({
        where: {
          id: refreshToken,
        },
      });

      // Retornar novos tokens de acesso que foram criados
      return ok(newToken);
    } else {
      return ok({
        status: OkStatus,
        code: JWTFailure,
        message: "Erro durante a criação de novo token de acesso através do refresh token.",
      });
    }
  },

  async verifyToken(token, ignoreExpiration = false) {
    if (!token) {
      return {
        status: ErrorStatus,
        code: IncorrectParameter,
        message: "Nenhum token de autenticação informado.",
      };
    }

    try {
      // Tenta realizar validação do token informado
      const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET, { ignoreExpiration });

      // Token validado com sucesso, extrair dados de usuário
      const user = await prisma.user.findFirst({
        where: {
          id: parseInt(decoded["id"], 10),
          email: decoded["email"],
        },
      });

      if (user) {
        return decoded;
      } else {
        return {
          status: ErrorStatus,
          code: JWTFailure,
          message: "Dados de usuário presente no token não são válidos.",
        };
      }
    } catch (error) {
      // Erros: https://github.com/auth0/node-jsonwebtoken
      switch (error.name) {
        case "TokenExpiredError":
          return {
            status: ErrorStatus,
            code: JWTExpired,
            message: `Erro ao validar token JWT: ${error.message}`,
          };
        case "JsonWebTokenError":
          return {
            status: ErrorStatus,
            code: JWTFailure,
            message: `Erro ao validar token JWT: ${error.message}`,
          };
        case "NotBeforeError":
          return {
            status: ErrorStatus,
            code: JWTNotBefore,
            message: `Erro ao validar token JWT: ${error.message}`,
          };
        default:
          return {
            status: ErrorStatus,
            code: JWTFailure,
            message: `Erro ao validar token JWT: ${error.message}`,
          };
      }
    }
  },

  async recoverPassword(email) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return unauthorized({
        status: ErrorStatus,
        code: Unauthorized,
        message: "O email informado não foi encontrado na base de dados do sistema.",
      });
    }

    const activeRequest = await prisma.recover.findMany({
      where: {
        userId: user.id,
        active: true,
      },
    });

    if (activeRequest.length > 0) {
      activeRequest.forEach(async (request) => {
        await prisma.recover.update({
          where: {
            id: request.id,
          },
          data: {
            active: false,
          },
        });
      });
    }

    const recoverCode = crypto.randomBytes(8).toString("hex");

    const recover = await prisma.recover.create({
      data: {
        userId: user.id,
        code: recoverCode,
      },
    });

    if (recover) {
      // Enviar email de recuperação de senha
      if (process.env.NODE_ENV !== "test") {
        try {
          const { emailHtml, emailText } = await sendgrid.composeRecoverEmail(
            user.name,
            user.email,
            recoverCode
          );

          await sendgrid.sendEmail(
            user.email,
            emailText,
            emailHtml,
            "Alteração/Recuperação de Senha"
          );

          console.log("Email Enviado?");
        } catch (error) {
          console.log(fileName(), `Erro durante envio de email: ${error.message}`);
        }
      }

      return ok({
        status: OkStatus,
        response: {
          recover: recover,
        },
      });
    } else {
      return failure({
        status: ErrorStatus,
        code: DatabaseFailure,
        message: "Não foi possível realizar a criação de um ou mais dados do banco de dados.",
      });
    }
  },

  async changePassword(email, recoverCode, newPassword) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return unauthorized({
        status: ErrorStatus,
        code: Unauthorized,
        message: "O email informado não foi encontrado na base de dados do sistema.",
      });
    }

    const recover = await prisma.recover.findFirst({
      where: {
        code: recoverCode,
        userId: user.id,
      },
    });

    if (!recover) {
      return notFound({
        status: ErrorStatus,
        code: NotFound,
        message: "O código de recuperação informado não foi encontrado.",
      });
    }

    if (recover.redeemed) {
      return conflict({
        status: ErrorStatus,
        code: RecoverCodeRedeemed,
        message: "O código de recuperação informado já foi utilizado.",
      });
    }

    if (!recover.active) {
      return unauthorized({
        status: ErrorStatus,
        code: Unauthorized,
        message: "O código de recuperação informado expirou.",
      });
    }

    const redeemed = await prisma.recover.update({
      where: {
        id: recover.id,
      },
      data: {
        active: false,
        redeemed: true,
      },
    });

    if (redeemed) {
      const password = crypto.createHash("md5").update(newPassword).digest("hex");

      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          password: password,
        },
      });

      return ok({
        status: OkStatus,
        response: {
          message: "A senha de usuário foi alterada com sucesso.",
        },
      });
    } else {
      return failure({
        status: ErrorStatus,
        code: DatabaseFailure,
        message: "Não foi possível realizar a criação de um ou mais dados do banco de dados.",
      });
    }
  },
};
