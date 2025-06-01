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
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f5f7fa; padding: 20px; font-family: Arial, sans-serif; color: #333;">
  <tr>
    <td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 8px; padding: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
        <tr>
          <td style="color: #2c3e50; font-size: 24px; font-weight: bold; padding-bottom: 20px;">
            ${i18next.t('email.thanks', { name: booking.name })}
          </td>
        </tr>
        <tr>
          <td style="font-size: 15px; margin-bottom: 20px; padding-bottom: 20px;">
            ${i18next.t('email.hourly_confirmed_message')}
          </td>
        </tr>
        <tr>
          <td>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;">
              <tbody>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; vertical-align: top; max-width: 200px;">
                    ${i18next.t('email.booking_number')}:
                  </td>
                  <td style="padding: 8px 0; word-break: break-word;">
                    ${booking.bookingNumber}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">
                    ${i18next.t('email.name')}:
                  </td>
                  <td style="padding: 8px 0; word-break: break-word;">
                    ${booking.name}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">
                    ${i18next.t('email.phone')}:
                  </td>
                  <td style="padding: 8px 0; word-break: break-word;">
                    ${booking.phone}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">
                    ${i18next.t('email.email')}:
                  </td>
                  <td style="padding: 8px 0; word-break: break-word;">
                    ${booking.email}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">
                    ${i18next.t('email.date')}:
                  </td>
                  <td style="padding: 8px 0; word-break: break-word;">
                    ${parisDate}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">
                    ${i18next.t('email.pickup_location')}:
                  </td>
                  <td style="padding: 8px 0; word-break: break-word;">
                    ${booking.pickupLocation}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">
                    ${i18next.t('email.duration_hours')}:
                  </td>
                  <td style="padding: 8px 0; word-break: break-word;">
                    ${booking.duration} ${i18next.t('email.hours_short')}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">
                    ${i18next.t('email.comment')}:
                  </td>
                  <td style="padding: 8px 0; word-break: break-word;">
                    ${booking.tripPurpose || i18next.t('email.not_specified')}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">
                    ${i18next.t('email.garant')}:
                  </td>
                  <td style="padding: 8px 0;">
                    ${i18next.t('email.yes')}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">
                    ${i18next.t('email.price')}:
                  </td>
                  <td style="padding: 8px 0;">
                    ${booking.totalPrice}€
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding-top: 24px; font-size: 14px; color: #555;">
            ${i18next.t('email.we_look_forward')}
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>

      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending hourly booking confirmation email:', error);
    throw error; // пробрасываем ошибку дальше, если надо
  }
}

module.exports = sendHourlyBookingConfirmationEmail;
