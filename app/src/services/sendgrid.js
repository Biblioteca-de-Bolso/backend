const fs = require("fs").promises;
const { fileName } = require("../modules/debug");
const sendGrid = require("@sendgrid/mail");

sendGrid.setApiKey(process.env.SEND_GRID_API);

module.exports = {
  async composeEmail(userId, name, email, activationCode) {
    try {
      // Carrega arquivo base do corpo do email de convite
      let html = (await fs.readFile("src/html/invite.html")).toString();

      // Links

      let logoUrl = `${process.env.PRODUCTION_URL}/images/library_icon.png`;
      let logoGithub = `${process.env.PRODUCTION_URL}/images/github.png`;
      // let activationLink = `${process.env.PRODUCTION_URL}/api/auth/verify?id=${userId}&email=${email}&code=${activationCode}`;

      let activationLink =
        process.env.NODE_ENV === "production"
          ? `${process.env.PRODUCTION_URL}/api/auth/verify?id=${userId}&email=${email}&code=${activationCode}`
          : `http://localhost:${process.env.API_LOCAL_PORT}/api/auth/verify?id=${userId}&email=${email}&code=${activationCode}`;

      // Realiza substituições
      html = html.replace("#LOGO_URL", logoUrl);
      html = html.replace("#GITHUB_ICON", logoGithub);
      html = html.replace("#USER_EMAIL", email);
      html = html.replace("#USER_NAME", name.split(" ")[0]);
      html = html.replace("#ACTIVATION_LINK", activationLink);

      // Enviar email
      return {
        emailText: "...",
        emailHtml: html,
      };
    } catch (error) {
      console.log(fileName(), `Erro durante construção do email: ${error.message}`);
      return {
        error: `Erro durante construção do email: ${error.message}`,
      };
    }
  },

  async sendEmail(recipient, text, html) {
    return new Promise(async (resolve, reject) => {
      const msg = {
        to: recipient,
        from: "debolsobiblioteca@gmail.com",
        subject: "Bem vindo(a) à Biblioteca de Bolso!",
        text: text,
        html: html,
      };

      await sendGrid
        .send(msg)
        .then(() => {
          console.log(fileName(), "Email enviado com sucesso.");
          resolve();
        })
        .catch((error) => {
          console.log(error);
          reject();
        });
    });
  },
};
