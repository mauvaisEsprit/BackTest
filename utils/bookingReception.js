const i18next = require('../config/i18n');
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
      <td style="padding: 8px 0;"><strong>${i18next.t("email.return_date")}:</strong></td>
      <td style="padding: 8px 0;">${parisReturnDate}</td>
    </tr>`
  : "";


  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: booking.email,
    subject: i18next.t("email.new_booking_subject"),
    html: `
     <div style="font-family: Arial, sans-serif; background-color: #f5f7fa; padding: 20px; color: #333;">
  <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; padding: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">

    <h2 style="color: #2c3e50; margin-top: 0;">
      ${i18next.t("email.new_booking_title")}
    </h2>

    <table style="width: 100%; border-collapse: collapse;">
      <tbody>
        <tr>
          <td style="padding: 8px 0;"><strong>${i18next.t("email.booking_number")}:</strong></td>
          <td style="padding: 8px 0;">${booking.bookingNumber}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0;"><strong>${i18next.t("email.name")}:</strong></td>
          <td style="padding: 8px 0;">${booking.name}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0;"><strong>${i18next.t("email.phone")}:</strong></td>
          <td style="padding: 8px 0;">${booking.phone}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0;"><strong>${i18next.t("email.email")}:</strong></td>
          <td style="padding: 8px 0;">${booking.email}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0;"><strong>${i18next.t("email.from")}:</strong></td>
          <td style="padding: 8px 0;">${booking.from}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0;"><strong>${i18next.t("email.to")}:</strong></td>
          <td style="padding: 8px 0;">${booking.to}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0;"><strong>${i18next.t("email.date")}:</strong></td>
          <td style="padding: 8px 0;">${parisDate}</td>
        </tr>

        ${returnDateHtml}

        <tr>
          <td style="padding: 8px 0;"><strong>${i18next.t("email.adults")}:</strong></td>
          <td style="padding: 8px 0;">${booking.adults || 0}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0;"><strong>${i18next.t("email.children")}:</strong></td>
          <td style="padding: 8px 0;">${booking.children || 0}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0;"><strong>${i18next.t("email.baggage")}:</strong></td>
          <td style="padding: 8px 0;">${booking.baggage ? i18next.t("yes") : i18next.t("no")}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0;"><strong>${i18next.t("email.comment")}:</strong></td>
          <td style="padding: 8px 0;">${booking.comment || i18next.t("email.not_specified")}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0;"><strong>${i18next.t("email.garant")}:</strong></td>
          <td style="padding: 8px 0;">${i18next.t("email.yes")}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0;"><strong>${i18next.t("email.price")}:</strong></td>
          <td style="padding: 8px 0;">${normPrice}€</td>
        </tr>
      </tbody>
    </table>

    <p style="margin-top: 24px; font-size: 14px; color: #555;">
      ${i18next.t("email.we_look_forward")}
    </p>
  </div>
</div>

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
