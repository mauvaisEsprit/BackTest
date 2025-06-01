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
      <div style="font-family: Arial, sans-serif; background-color: #f8f9fa; padding: 20px; color: #333;">
  <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; padding: 20px; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
    <h2 style="color: #333333; border-bottom: 1px solid #e0e0e0; padding-bottom: 10px;">
      ${i18next.t("email.new_booking_title")}
    </h2>

    <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
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
          <td style="padding: 8px 0;"><strong>${i18next.t("email.pickup_location")}:</strong></td>
          <td style="padding: 8px 0;">${booking.pickupLocation}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0;"><strong>${i18next.t("email.duration_hours")}:</strong></td>
          <td style="padding: 8px 0;">${booking.duration} ${i18next.t("email.hours_short")}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0;"><strong>${i18next.t("email.date")}:</strong></td>
          <td style="padding: 8px 0;">${parisDate}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0;"><strong>${i18next.t("email.comment")}:</strong></td>
          <td style="padding: 8px 0;">${booking.tripPurpose || i18next.t("email.not_specified")}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0;"><strong>${i18next.t("email.price")}:</strong></td>
          <td style="padding: 8px 0;">${normPrice}€</td>
        </tr>
        <tr>
          <td style="padding: 8px 0;"><strong>${i18next.t("email.garant")}:</strong></td>
          <td style="padding: 8px 0;">${i18next.t("email.yes")}</td>
        </tr>
      </tbody>
    </table>

    <p style="margin-top: 30px; font-size: 14px; color: #666;">
      ${i18next.t("email.thank_you_message") || "Thank you for your reservation. We will contact you shortly."}
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

module.exports = { sendHourlyBookingReceptionEmail };
