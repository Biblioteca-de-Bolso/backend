const nodemailer = require("nodemailer");
const dotenv = require("dotenv").config({ path: "../../.env" });

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

var mailOptions = {
  from: "debolsobiblioteca@gmail.com",
  to: "diasrhenan@gmail.com",
  subject: "Sending Email using Node.js",
  text: "That was easy!",
};

transporter.sendMail(mailOptions, function (error, info) {
  if (error) {
    console.log(error);
  } else {
    console.log("Email sent: " + info.response);
  }
});
