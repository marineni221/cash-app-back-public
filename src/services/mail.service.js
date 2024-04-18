const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");
const handlebars = require("handlebars");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: process.env.MAIL_SERVICE,
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

class EmailService {
  mailOptions = {
    from: process.env.MAIL_USER,
    to: "recipient@example.com",
    subject: "Hello from Nodemailer",
    replyTo: process.env.MAIL_USER,
  };

  getHtmlToSend(filename, replacements) {
    const filePath = path.join(__dirname, "..", "..", "views", filename);
    const html = fs.readFileSync(filePath, "utf8").toString();
    const template = handlebars.compile(html);
    const htmlToSend = template(replacements);
    return htmlToSend;
  }

  sendEmail(email, subject, html) {
    this.mailOptions.to = email;
    this.mailOptions.subject = subject;
    this.mailOptions.html = html;
    transporter.sendMail(this.mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email: ", error);
      } else {
        console.log("Email sent: ", info.response);
      }
    });
  }
}

module.exports = EmailService;
