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
      <table
  role="presentation"
  border="0"
  cellpadding="0"
  cellspacing="0"
  width="100%"
  style="background-color:#f4f6f8; padding: 20px; font-family: Arial, sans-serif; color: #333;"
>
  <tr>
    <td align="center">
      <table
        role="presentation"
        border="0"
        cellpadding="0"
        cellspacing="0"
        width="600"
        style="background-color:#ffffff; border-radius:8px; padding:24px; box-sizing: border-box;"
      >
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
          <td style="font-size: 14px; line-height: 1.4;">

            <p><strong>${i18next.t("email.booking_number")}:</strong> ${
      booking.bookingNumber
    }</p>
            <p><strong>${i18next.t("email.name")}:</strong> ${booking.name}</p>
            <p><strong>${i18next.t("email.phone")}:</strong> ${
      booking.phone
    }</p>
            <p><strong>${i18next.t("email.email")}:</strong> ${
      booking.email
    }</p>
            <p><strong>${i18next.t("email.date")}:</strong> ${parisDate}</p>
            ${returnDateHtml}
            <p><strong>${i18next.t("email.from")}:</strong> ${booking.from}</p>
            <p><strong>${i18next.t("email.to")}:</strong> ${booking.to}</p>
            <p><strong>${i18next.t("email.adults")}:</strong> ${
      booking.adults || 1
    }</p>
            <p><strong>${i18next.t("email.children")}:</strong> ${
      booking.children || 0
    }</p>
            <p><strong>${i18next.t("email.baggage")}:</strong> ${
      booking.baggage ? i18next.t("email.yes") : i18next.t("email.no")
    }</p>
            <p><strong>${i18next.t("email.comment")}:</strong> ${
      booking.comment || i18next.t("email.not_specified")
    }</p>
            <p><strong>${i18next.t("email.garant")}:</strong> ${i18next.t(
      "email.yes"
    )}</p>
            <p><strong>${i18next.t("email.type_of_trip")}:</strong> ${
      booking.isRoundTrip
        ? i18next.t("email.round_trip")
        : i18next.t("email.one_way_trip")
    }</p>
            <p><strong>${i18next.t("email.price")}:</strong> <strong>${
      booking.price
    }€</strong></p>

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

module.exports = { sendConfirmationMail };
