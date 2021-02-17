const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.MAILER_SMTP_OUTGOING_SERVER,
    port: 587,
    auth: {
      user: process.env.MAILER_USERNAME, 
      pass: process.env.MAILER_PASSWORD, 
    },
    tls: {
        rejectUnauthorized: false
    }
});

module.exports = {
    transporter,
};
