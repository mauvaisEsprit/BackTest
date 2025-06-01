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
       <td style="padding: 8px 0;"><strong>${i18next.t("email.return_date")}:</strong></td>
       <td style="padding: 8px 0;">${parisReturnDate}</td>
     </tr>`
   : "";

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: booking.email,
    subject: i18next.t("email.confirmed_subject"),
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px; color: #333;">
  <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; padding: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">

    <h2 style="color: #2c3e50; margin-top: 0;">
      ${i18next.t("email.thanks", { name: booking.name })}
    </h2>

    <p>${i18next.t("email.booking_confirmed_1")}</p>

    <p><b>${i18next.t("email.booking_number")}:</b> ${booking.bookingNumber}</p>
    <p><b>${i18next.t("email.name")}:</b> ${booking.name}</p>
    <p><b>${i18next.t("email.phone")}:</b> ${booking.phone}</p>
    <p><b>${i18next.t("email.email")}:</b> ${booking.email}</p>
    <p><b>${i18next.t("email.date")}:</b> ${parisDate}</p>

    ${returnDateHtml}

    <p><b>${i18next.t("email.from")}:</b> ${booking.from}</p>
    <p><b>${i18next.t("email.to")}:</b> ${booking.to}</p>
    <p><b>${i18next.t("email.adults")}:</b> ${booking.adults || 1}</p>
    <p><b>${i18next.t("email.children")}:</b> ${booking.children || 0}</p>
    <p><b>${i18next.t("email.baggage")}:</b> ${booking.baggage ? i18next.t("email.yes") : i18next.t("email.no")}</p>
    <p><b>${i18next.t("email.comment")}:</b> ${booking.comment || i18next.t("email.not_specified")}</p>
    <p><b>${i18next.t("email.garant")}:</b> ${i18next.t("email.yes")}</p>
    <p><b>${i18next.t("email.type_of_trip")}:</b> 
      ${booking.isRoundTrip ? i18next.t("email.round_trip") : i18next.t("email.one_way_trip")}
    </p>
    <p><b>${i18next.t("email.price")}:</b> <b>${booking.price}€</b></p>

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

module.exports = { sendConfirmationMail };
