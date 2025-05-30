const transporter = require("../config/transporter");
const i18next = require("../config/i18n"); // импортируем i18next


async function sendReplyToClientEmail(message) {
  await i18next.changeLanguage(booking.locale || "fr");
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: message.email,  // письмо идёт клиенту
    subject: "Спасибо за ваше сообщение",
    html: `
      <h2>Здравствуйте, ${message.name}!</h2>
      <p>Спасибо за ваше сообщение. Мы свяжемся с вами в ближайшее время.</p>
      <p>Ваше сообщение:</p>
      <blockquote>${message.message}</blockquote>
      <p>С уважением,<br/>Команда поддержки</p>
    `,
  };

  return transporter.sendMail(mailOptions);
}

module.exports = { sendReplyToClientEmail };