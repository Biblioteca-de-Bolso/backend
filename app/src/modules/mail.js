const nodemailer = require("nodemailer");
const fs = require("fs").promises;

const filename = __filename.slice(__dirname.length + 1) + " -";

module.exports = {
  async composeEmail(userId, name, email, activationCode) {
    try {
      // Carrega arquivo base do corpo do email de convite
      let html = (await fs.readFile("src/html/invite.html")).toString();

      // Links
      let logoUrl = `${process.env.PRODUCTION_URL}/images/library_icon.png`;
      let logoGithub = `${process.env.PRODUCTION_URL}/images/github.png`;
      let activationLink = `${process.env.PRODUCTION_URL}/api/auth/verify?id=${userId}&email=${email}&code=${activationCode}`;

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
      console.log(filename, `Erro durante construção do email: ${error.message}`);
      return {
        error: `Erro durante construção do email: ${error.message}`,
      };
    }
  },

  async sendEmail(recipient, text, html) {
    return new Promise((resolve, reject) => {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      const mailOptions = {
        from: "debolsobiblioteca@gmail.com",
        to: recipient,
        subject: "Bem vindo(a) à Biblioteca de Bolso!",
        text: text,
        html: html,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(filename, `Erro durante o envio de email: ${error.message}`);
          reject();
        } else {
          console.log(filename, `Email enviado com sucesso: ${info.response}`);
          resolve();
        }
      });
    });
  },
};
