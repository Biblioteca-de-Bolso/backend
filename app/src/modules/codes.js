module.exports = {
  // Código padrão para respostas bem sucedidas
  OkStatus: "ok",

  // Código padrão para respostas com algum tipo de falha
  ErrorStatus: "error",

  // Erro interno de operação do sistema
  InternalServerError: "InternalServerError",

  // Parâmetro inexistente ou mal formatado
  IncorrectParameter: "IncorrectParameter",

  // Falha de operação no banco de dados
  DatabaseFailure: "DatabaseFailure",

  // Email já foi cadastrado por outro usuário
  EmailAlreadyInUse: "EmailAlreadyInUse",

  // Usuário não está autenticado no sistema
  Unauthorized: "Unauthorized",

  // Usuário não possui permissão para realizar esta ação
  Forbidden: "Forbidden",

  // O recurso solicitado não foi encontrado
  NotFound: "NotFound",

  // É necessário realizar a confirmação da conta de usuário
  AccountNotVerified: "AccountNotVerified",

  // Falhas com a manipulação e criação de token JWT
  JWTFailure: "JWTFailure",

  // Token JWT com tempo de duração expirado
  JWTExpired: "JWTExpired",

  // Horário atual de verificação do token é menor que o de expiração
  JWTNotBefore: "JWTNotBefore",

  // O Refresh Token informado não foi localizado
  InvalidRefreshToken: "InvalidRefreshToken",

  // O Refresh Token informado expirou, é necessário realizar o login novamente
  RefreshTokenExpired: "RefreshTokenExpired",

  // O horário de verificação é anterior ao horário de "issued" do refresh token
  RefreshTokenNotBefore: "RefreshTokenNotBefore",

  // A página solicitada não retornou nenhum resultado
  Empty: "Empty",

  // Um livro com esse ISBN já foi cadastrado
  DuplicatedISBN: "DuplicatedISBN",

  // Um livro com o ID informado já está emprestado
  BookAlreadyBorrowed: "BookAlreadyBorrowed",
};
