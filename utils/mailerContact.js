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
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border: 1px solid #ddd;">
      <h2 style="color: #333;">${greeting}</h2>

      <p style="font-size: 16px; color: #555;">${body}</p>

      <p style="font-size: 16px; color: #555; font-weight: bold; margin-top: 30px;">${yourMessage}:</p>
      <blockquote style="margin: 10px 0; padding: 10px 15px; background-color: #f7f7f7; border-left: 4px solid #2196F3; color: #333;">
        ${message.message}
      </blockquote>

      <p style="font-size: 16px; color: #555; margin-top: 30px;">${closing}</p>

      <hr style="margin: 40px 0;" />
      <p style="font-size: 12px; color: #aaa; text-align: center;">© ${new Date().getFullYear()} Blue Coast. ${i18next.t("email.rightsReserved")}</p>
    </div>
  `,
  };

  return transporter.sendMail(mailOptions);
}

module.exports = { sendReplyToClientEmail };
