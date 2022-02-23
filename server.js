const app = require("./app");

// Iniciando Servidor
let port = process.env.PORT;

if (port == "" || port == null) {
  port = process.env.LOCAL_PORT;
}

app.listen(port);
