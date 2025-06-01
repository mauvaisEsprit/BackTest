const i18next = require("../config/i18n"); // импортируем
const transporter = require("../config/transporter");
const moment = require("moment-timezone");

async function sendConfirmationMail(booking) {
  await i18next.changeLanguage(booking.locale || "fr");

  const parisDate = booking.date
    ? moment(booking.date).tz("Europe/Paris").format("DD/MM/YYYY HH:mm")
    : i18next.t("email.not_specified");

  const parisReturnDate = booking.returnDate
    ? moment(booking.returnDate).tz("Europe/Paris").format("DD/MM/YYYY HH:mm")
    : i18next.t("email.not_specified");

  const returnDateHtml = booking.returnDate
    ? `<tr>
       <td style="padding: 8px 0;"><strong>${i18next.t(
         "email.return_date"
       )}:</strong></td>
       <td style="padding: 8px 0;">${parisReturnDate}</td>
     </tr>`
    : "";

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: booking.email,
    subject: i18next.t("email.confirmed_subject"),
    html: `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f6f8; padding: 20px; font-family: Arial, sans-serif; color: #333;">
  <tr>
    <td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 8px; padding: 24px; box-sizing: border-box;">
        <tr>
          <td style="color: #2c3e50; font-size: 24px; font-weight: bold; padding-bottom: 16px;">
            ${i18next.t("email.thanks", { name: booking.name })}
          </td>
        </tr>

        <tr>
          <td style="font-size: 16px; line-height: 1.5; padding-bottom: 16px;">
            ${i18next.t("email.booking_confirmed_1")}
          </td>
        </tr>

        <tr>
          <td>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size: 14px; line-height: 1.5; border-collapse: collapse;">
              <tbody>
                <tr>
                  <td style="padding: 6px 0; font-weight: bold;">${i18next.t(
                    "email.booking_number"
                  )}:</td>
                  <td style="padding: 6px 0;">${booking.bookingNumber}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-weight: bold;">${i18next.t(
                    "email.name"
                  )}:</td>
                  <td style="padding: 6px 0;">${booking.name}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-weight: bold;">${i18next.t(
                    "email.phone"
                  )}:</td>
                  <td style="padding: 6px 0;">${booking.phone}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-weight: bold;">${i18next.t(
                    "email.email"
                  )}:</td>
                  <td style="padding: 6px 0;">${booking.email}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-weight: bold;">${i18next.t(
                    "email.date"
                  )}:</td>
                  <td style="padding: 6px 0;">${parisDate}</td>
                </tr>
                ${returnDateHtml}
                <tr>
                  <td style="padding: 6px 0; font-weight: bold;">${i18next.t(
                    "email.from"
                  )}:</td>
                  <td style="padding: 6px 0;">${booking.from}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-weight: bold;">${i18next.t(
                    "email.to"
                  )}:</td>
                  <td style="padding: 6px 0;">${booking.to}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-weight: bold;">${i18next.t(
                    "email.adults"
                  )}:</td>
                  <td style="padding: 6px 0;">${booking.adults || 1}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-weight: bold;">${i18next.t(
                    "email.children"
                  )}:</td>
                  <td style="padding: 6px 0;">${booking.children || 0}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-weight: bold;">${i18next.t(
                    "email.baggage"
                  )}:</td>
                  <td style="padding: 6px 0;">${
                    booking.baggage
                      ? i18next.t("email.yes")
                      : i18next.t("email.no")
                  }</td>
                </tr>
                <tr>
  <td style="padding: 6px 0; font-weight: bold;">${i18next.t(
    "email.comment"
  )}:</td>
  <td style="padding: 6px 0; word-wrap: break-word; word-break: break-word; overflow-wrap: break-word;">
    ${booking.comment || i18next.t("email.not_specified")}
  </td>
</tr>

                <tr>
                  <td style="padding: 6px 0; font-weight: bold;">${i18next.t(
                    "email.garant"
                  )}:</td>
                  <td style="padding: 6px 0;">${i18next.t("email.yes")}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-weight: bold;">${i18next.t(
                    "email.type_of_trip"
                  )}:</td>
                  <td style="padding: 6px 0;">${
                    booking.isRoundTrip
                      ? i18next.t("email.round_trip")
                      : i18next.t("email.one_way_trip")
                  }</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-weight: bold;">${i18next.t(
                    "email.price"
                  )}:</td>
                  <td style="padding: 6px 0;"><strong>${
                    booking.price
                  }€</strong></td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>

        <tr>
          <td style="padding-top: 24px; font-size: 14px; color: #555;">
            ${i18next.t("email.we_look_forward")}
          </td>
        </tr>
       <tr>
  <td style="border-top: 1px solid #ddd; padding-top: 24px;"></td>
</tr>
<tr>
  <td style="font-size: 12px; color: #aaa; text-align: center; padding-top: 16px;">
    © ${new Date().getFullYear()} Blue Coast. ${i18next.t(
      "email.rightsReserved"
    )}
  </td>
</tr>

      </table>
    </td>
  </tr>
</table>

    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Ошибка отправки email клиенту:", error);
    return false;
  }
}

module.exports = { sendConfirmationMail };
