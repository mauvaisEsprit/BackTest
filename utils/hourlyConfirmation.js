const i18next = require('../config/i18n'); // импортируем i18next
const moment = require('moment-timezone');
const transporter = require('../config/transporter'); // где ты создаешь nodemailer транспортер

async function sendHourlyBookingConfirmationEmail(booking) {
  try {
    // Устанавливаем язык
    await i18next.changeLanguage(booking.locale || 'fr');

    const parisDate = moment(booking.date).tz('Europe/Paris').format('DD/MM/YYYY HH:mm');
    

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: booking.email,
      subject: i18next.t('email.hourly_confirmed_subject'),
      html: `
        <h2>${i18next.t('email.thanks', { name: booking.name })}</h2>
        <p>${i18next.t('email.hourly_confirmed_message')}</p>
        <p><b>${i18next.t('email.booking_number')}:</b> ${booking.bookingNumber}</p>
        <p><b>${i18next.t('email.name')}:</b> ${booking.name}</p>
        <p><b>${i18next.t('email.phone')}:</b> ${booking.phone}</p>
        <p><b>${i18next.t('email.email')}:</b> ${booking.email}</p>
        <p><b>${i18next.t('email.date')}:</b> ${parisDate}</p>
        <p><b>${i18next.t('email.pickup_location')}:</b> ${booking.pickupLocation}</p>
        <p><b>${i18next.t('email.duration_hours')}:</b> ${booking.duration} ${i18next.t('email.hours_short')}</p>
        <p><b>${i18next.t('email.comment')}:</b> ${booking.tripPurpose || i18next.t('email.not_specified')}</p>
        <p><b>${i18next.t('email.garant')}:</b> ${i18next.t('email.yes')}</p>
        <p><b>${i18next.t('email.price')}:</b> ${booking.totalPrice}€</p>
        <p>${i18next.t('email.we_look_forward')}</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Confirmation email sent to client for hourly booking');
  } catch (error) {
    console.error('Error sending hourly booking confirmation email:', error);
    throw error; // пробрасываем ошибку дальше, если надо
  }
}

module.exports = sendHourlyBookingConfirmationEmail;
