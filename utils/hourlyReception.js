const i18next = require("../config/i18n");
const transporter = require("../config/transporter");
const moment = require("moment-timezone");

async function sendHourlyBookingReceptionEmail(booking) {
  await i18next.changeLanguage(booking.locale || "fr");

  const parisDate = booking.date
    ? moment(booking.date).tz("Europe/Paris").format("DD/MM/YYYY HH:mm")
    : i18next.t("email.not_specified");

  const normPrice = booking.totalPrice || i18next.t("email.not_specified");

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: booking.email,
    subject: i18next.t("email.new_booking_subject"),
    html: `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8f9fa; padding: 20px; font-family: Arial, sans-serif; color: #333;">
  <tr>
    <td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 8px; padding: 20px; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
        <tr>
          <td style="color: #333333; font-size: 24px; font-weight: bold; border-bottom: 1px solid #e0e0e0; padding-bottom: 10px;">
            ${i18next.t("email.new_booking_title")}
          </td>
        </tr>
        <tr>
          <td style="padding-top: 20px;">
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
                    ${i18next.t("email.pickup_location")}:
                  </td>
                  <td style="padding: 8px 0; word-break: break-word;">
                    ${booking.pickupLocation}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">
                    ${i18next.t("email.duration_hours")}:
                  </td>
                  <td style="padding: 8px 0; word-break: break-word;">
                    ${booking.duration} ${i18next.t("email.hours_short")}
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
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">
                    ${i18next.t("email.comment")}:
                  </td>
                  <td style="padding: 8px 0; word-break: break-word;">
                    ${booking.tripPurpose || i18next.t("email.not_specified")}
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
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">
                    ${i18next.t("email.garant")}:
                  </td>
                  <td style="padding: 8px 0;">
                    ${i18next.t("email.yes")}
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
       <tr>
  <td style="padding-top: 24px; font-size: 14px; color: #555;">
    ${i18next.t("email.thank_you_message")}
  </td>
</tr>
<tr>
  <td style="border-top: 1px solid #ddd; padding-top: 24px;"></td>
</tr>
<tr>
  <td style="font-size: 12px; color: #aaa; text-align: center; padding-top: 16px;">
    © ${new Date().getFullYear()} Blue Coast. ${i18next.t("email.rightsReserved")}
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

module.exports = { sendHourlyBookingReceptionEmail };
