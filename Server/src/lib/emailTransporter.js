const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
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

var options = (email, locals, subject, source) => {
    return {
        from: `"MiTRACE" <${process.env.MAILER_USERNAME}>`,
        to: email,
        subject: subject,
        html: source(locals) // Process template with locals - {passwordResetAddress}
      };
};

module.exports = {
    transporter,
    options,
};