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
      <h2>${i18next.t("email.new_booking_title")}</h2>
      <p><b>${i18next.t("email.booking_number")}:</b> ${booking.bookingNumber}</p>
      <p><b>${i18next.t("email.name")}:</b> ${booking.name}</p>
      <p><b>${i18next.t("email.phone")}:</b> ${booking.phone}</p>
      <p><b>${i18next.t("email.email")}:</b> ${booking.email}</p>
      <p><b>${i18next.t("email.pickup_location")}:</b> ${booking.pickupLocation}</p>
      <p><b>${i18next.t("email.duration_hours")}:</b> ${booking.duration} ${i18next.t("email.hours_short")}</p>
      <p><b>${i18next.t("email.date")}:</b> ${parisDate}</p>
      <p><b>${i18next.t("email.comment")}:</b> ${booking.tripPurpose || i18next.t("email.not_specified")}</p>
      <p><b>${i18next.t("email.price")}:</b> ${normPrice}€</p>
      <p><b>${i18next.t("email.garant")}:</b> ${i18next.t("email.yes")}</p>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email отправлен клиенту:", info.response);
    return true;
  } catch (error) {
    console.error("Ошибка отправки email клиенту:", error);
    return false;
  }
}

module.exports = { sendHourlyBookingReceptionEmail };
