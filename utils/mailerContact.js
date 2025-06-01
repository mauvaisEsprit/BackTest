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
   <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f5f7fa; padding: 20px;">
  <tr>
    <td align="center">
      <!-- Внешний контейнер -->
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border: 1px solid #ddd; font-family: Arial, sans-serif; padding: 20px;">
        <tr>
          <td style="padding: 20px 0; font-size: 24px; color: #333; font-weight: bold;">
            ${greeting}
          </td>
        </tr>
        <tr>
          <td style="font-size: 16px; color: #555; line-height: 1.5;">
            ${body}
          </td>
        </tr>
        <tr>
          <td style="padding-top: 30px; font-size: 16px; color: #555; font-weight: bold;">
            ${yourMessage}:
          </td>
        </tr>
        <tr>
          <td>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="padding: 10px 15px; background-color: #f7f7f7; border-left: 4px solid #2196F3; color: #333; font-size: 16px; line-height: 1.4;">
                  ${message.message}
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding-top: 30px; font-size: 16px; color: #555;">
            ${closing}
          </td>
        </tr>
        <tr>
          <td style="padding-top: 40px;">
            <hr style="border: 0; height: 1px; background-color: #eee;" />
          </td>
        </tr>
        <tr>
          <td style="font-size: 12px; color: #aaa; text-align: center; padding-top: 20px;">
            © ${new Date().getFullYear()} Blue Coast. ${i18next.t("email.rightsReserved")}
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>

  `,
  };

  return transporter.sendMail(mailOptions);
}

module.exports = { sendReplyToClientEmail };
