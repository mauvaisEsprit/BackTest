const transporter = require("../config/transporter");
const i18next = require("../config/i18n");

async function sendReplyToClientEmail(message) {
  await i18next.changeLanguage(message.locale || "fr");

  const subject = i18next.t("email.reply_subject");
  const greeting = i18next.t("email.reply_greeting", { name: message.name });
  const body = i18next.t("email.reply_body");
  const yourMessage = i18next.t("email.your_message");
  const closing = i18next.t("email.reply_closing");

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: message.email,
    subject: subject,
    html: `
      <h2>${greeting}</h2>
      <p>${body}</p>
      <p>${yourMessage}:</p>
      <blockquote>${message.message}</blockquote>
      <p>${closing}</p>
    `,
  };

  return transporter.sendMail(mailOptions);
}

module.exports = { sendReplyToClientEmail };
