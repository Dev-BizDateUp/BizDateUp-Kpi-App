const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail", // Gmail service
  auth: {
    user: process.env.EMAIL_USER, // Gmail address
    pass: process.env.EMAIL_PASS, // App password (not your normal Gmail password)
  },
});

async function sendWelcomeEmail(to, name) {
  const mailOptions = {
    from: `"BizDateUp KPI" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Welcome to KPI Dashboard",
    html: `<h1>Hello ${name},</h1><p>Your account has been created successfully!</p>`,
  };

  return transporter.sendMail(mailOptions);
}

module.exports = { sendWelcomeEmail };
