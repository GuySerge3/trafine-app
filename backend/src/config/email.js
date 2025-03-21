const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text
    });
    console.log(`✅ Email envoyé à ${to}`);
  } catch (error) {
    console.error(`❌ Erreur d'envoi d'email à ${to} :`, error.message);
  }
};

module.exports = sendEmail;
