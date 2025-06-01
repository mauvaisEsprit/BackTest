const i18next = require("../config/i18n");
const transporter = require("../config/transporter");
const moment = require("moment-timezone");

async function sendBookingReceivedEmail(booking) {
  await i18next.changeLanguage(booking.locale || "fr");

  const parisDate = booking.date
    ? moment(booking.date).tz("Europe/Paris").format("DD/MM/YYYY HH:mm")
    : i18next.t("email.not_specified");

  const parisReturnDate = booking.returnDate
    ? moment(booking.returnDate).tz("Europe/Paris").format("DD/MM/YYYY HH:mm")
    : i18next.t("email.not_specified");

  const normPrice =
    typeof booking.price === "number"
      ? booking.price.toFixed(2)
      : i18next.t("email.not_specified");

  const typeOfTrip = booking.isRoundTrip
    ? i18next.t("email.round_trip")
    : i18next.t("email.one_way_trip");

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
    subject: i18next.t("email.new_booking_subject"),
    html: `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f5f7fa; padding: 20px; font-family: Arial, sans-serif; color: #333;">
  <tr>
    <td align="center">
      <!-- Внешний контейнер с max-width -->
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 8px; padding: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
        <tr>
          <td style="color: #2c3e50; font-size: 24px; font-weight: bold; padding-bottom: 20px;">
            ${i18next.t("email.new_booking_title")}
          </td>
        </tr>
        <tr>
          <td>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;">
              <tbody>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; vertical-align: top; max-width: 200px;">
                    ${i18next.t("email.booking_number")}:
                  </td>
                  <td style="padding: 8px 0; word-break: break-word;">
                    ${booking.bookingNumber}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">
                    ${i18next.t("email.name")}:
                  </td>
                  <td style="padding: 8px 0; word-break: break-word;">
                    ${booking.name}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">
                    ${i18next.t("email.phone")}:
                  </td>
                  <td style="padding: 8px 0; word-break: break-word;">
                    ${booking.phone}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">
                    ${i18next.t("email.email")}:
                  </td>
                  <td style="padding: 8px 0; word-break: break-word;">
                    ${booking.email}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">
                    ${i18next.t("email.from")}:
                  </td>
                  <td style="padding: 8px 0; word-break: break-word;">
                    ${booking.from}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">
                    ${i18next.t("email.to")}:
                  </td>
                  <td style="padding: 8px 0; word-break: break-word;">
                    ${booking.to}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">
                    ${i18next.t("email.date")}:
                  </td>
                  <td style="padding: 8px 0; word-break: break-word;">
                    ${parisDate}
                  </td>
                </tr>

                ${returnDateHtml}

                <tr>
                  <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">
                    ${i18next.t("email.adults")}:
                  </td>
                  <td style="padding: 8px 0; word-break: break-word;">
                    ${booking.adults || 0}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">
                    ${i18next.t("email.children")}:
                  </td>
                  <td style="padding: 8px 0; word-break: break-word;">
                    ${booking.children || 0}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">
                    ${i18next.t("email.baggage")}:
                  </td>
                  <td style="padding: 8px 0; word-break: break-word;">
                    ${booking.baggage ? i18next.t("yes") : i18next.t("no")}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">
                    ${i18next.t("email.comment")}:
                  </td>
                  <td style="padding: 8px 0; word-break: break-word;">
                    ${booking.comment || i18next.t("email.not_specified")}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">
                    ${i18next.t("email.garant")}:
                  </td>
                  <td style="padding: 8px 0;">
                    ${i18next.t("email.yes")}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">
                    ${i18next.t("email.price")}:
                  </td>
                  <td style="padding: 8px 0;">
                    ${normPrice}€
                  </td>
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

module.exports = { sendBookingReceivedEmail };
