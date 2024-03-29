const fs = require("fs").promises;
const { fileName } = require("../modules/debug");
const sendGrid = require("@sendgrid/mail");

sendGrid.setApiKey(process.env.SEND_GRID_API);

module.exports = {
  async composeInviteEmail(userId, name, email, activationCode) {
    // Carrega arquivo base do corpo do email de convite
    let html = (await fs.readFile("src/html/invite.html")).toString();

    // Links
    let activationLink =
      process.env.NODE_ENV === "production"
        ? `${process.env.PRODUCTION_URL}/api/auth/verify?id=${userId}&email=${email}&code=${activationCode}`
        : `http://localhost:${process.env.API_LOCAL_PORT}/api/auth/verify?id=${userId}&email=${email}&code=${activationCode}`;

    // Realiza substituições
    html = html.replace("#USER_EMAIL", email);
    html = html.replace("#USER_NAME", name.split(" ")[0]);
    html = html.replace("#ACTIVATION_LINK", activationLink);

    return {
      emailText: "...",
      emailHtml: html,
    };
  },

  async composeRecoverEmail(name, email, recoverCode) {
    // Carrega arquivo base do corpo do email de convite
    let html = (await fs.readFile("src/html/recover.html")).toString();

    // Links
    const recoverLink = `https://bibliotecadebolso.com/recover?email=${email}&recoverCode=${recoverCode}`;

    // Realiza substituições
    html = html.replace("#USER_NAME", name.split(" ")[0]);
    html = html.replace("#RECOVER_LINK", recoverLink);

    return {
      emailText: "...",
      emailHtml: html,
    };
  },

  async sendEmail(recipient, text, html, subject) {
    return new Promise(async (resolve, reject) => {
      const msg = {
        to: recipient,
        from: "debolsobiblioteca@gmail.com",
        subject,
        text,
        html,
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
