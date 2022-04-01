module.exports = {
  // Erro interno de operação do sistema
  InternalServerError: "InternalServerError",

  // Parâmetro inexistente ou mal formatado
  IncorrectParameter: "IncorrectParameter",

  // Falha de operação no banco de dados
  DatabaseFailure: "DatabaseFailure",

  // Email já foi cadastrado por outro usuário
  EmailAlreadyInUse: "EmailAlreadyInUse",

  // Dados de usuário não foram encontrados na base de dados
  UserNotFound: "UserNotFound",

  // Usuário não está autenticado no sistema
  Unauthorized: "Unauthorized",

  // Usuário não possui permissão para realizar esta ação
  Forbidden: "Forbidden",

  // A rota solicitada não foi encontrada ou implementada
  NotFound: "NotFound",

  // É necessário realizar a confirmação da conta de usuário
  AccountNotVerified: "AccountNotVerified",

  // Falha na criação de token JWT
  JWTCreationFailure: "JWTCreationFailure",

  // Falha na verificação de token JWT
  JWTVerifyError: "JWTVerifyError",
};
