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
        <div style="font-family: Arial, sans-serif; background-color: #f5f7fa; padding: 20px; color: #333;">
  <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; padding: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
    
    <h2 style="color: #2c3e50; margin-top: 0;">
      ${i18next.t('email.thanks', { name: booking.name })}
    </h2>
    
    <p style="font-size: 15px; margin-bottom: 20px;">
      ${i18next.t('email.hourly_confirmed_message')}
    </p>

    <table style="width: 100%; border-collapse: collapse;">
      <tbody>
        <tr>
          <td style="padding: 8px 0;"><strong>${i18next.t('email.booking_number')}:</strong></td>
          <td style="padding: 8px 0;">${booking.bookingNumber}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0;"><strong>${i18next.t('email.name')}:</strong></td>
          <td style="padding: 8px 0;">${booking.name}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0;"><strong>${i18next.t('email.phone')}:</strong></td>
          <td style="padding: 8px 0;">${booking.phone}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0;"><strong>${i18next.t('email.email')}:</strong></td>
          <td style="padding: 8px 0;">${booking.email}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0;"><strong>${i18next.t('email.date')}:</strong></td>
          <td style="padding: 8px 0;">${parisDate}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0;"><strong>${i18next.t('email.pickup_location')}:</strong></td>
          <td style="padding: 8px 0;">${booking.pickupLocation}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0;"><strong>${i18next.t('email.duration_hours')}:</strong></td>
          <td style="padding: 8px 0;">${booking.duration} ${i18next.t('email.hours_short')}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0;"><strong>${i18next.t('email.comment')}:</strong></td>
          <td style="padding: 8px 0;">${booking.tripPurpose || i18next.t('email.not_specified')}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0;"><strong>${i18next.t('email.garant')}:</strong></td>
          <td style="padding: 8px 0;">${i18next.t('email.yes')}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0;"><strong>${i18next.t('email.price')}:</strong></td>
          <td style="padding: 8px 0;">${booking.totalPrice}€</td>
        </tr>
      </tbody>
    </table>

    <p style="margin-top: 24px; font-size: 14px; color: #555;">
      ${i18next.t('email.we_look_forward')}
    </p>
  </div>
</div>

      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending hourly booking confirmation email:', error);
    throw error; // пробрасываем ошибку дальше, если надо
  }
}

module.exports = sendHourlyBookingConfirmationEmail;
