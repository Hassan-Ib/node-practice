const nodemailer = require('nodemailer');

exports.mailer = async (options) => {
  // 1 - create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // 2 - define email options
  const mailOptions = {
    from: 'Hassan Ibrahim <hello@ibrahim.io>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  // 3 - actually send email
  await transporter.sendMail(mailOptions);
};
