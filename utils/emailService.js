const nodemailer = require('nodemailer');
const config = require('config');
const emailConfig = config.get('emailService');

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: emailConfig.host,
  port: emailConfig.port,
  secure: emailConfig.secure,
  auth: {
    user: emailConfig.auth.user,
    pass: emailConfig.auth.pass
  }
});

/**
 * Send appointment confirmation email
 * @param {Object} appointment - Appointment object with populated client, staff and service
 * @returns {Promise} - Email sending result
 */
exports.sendAppointmentConfirmation = async (appointment) => {
  const { client, staff, service, date, time } = appointment;
  
  // Format date for email
  const appointmentDate = new Date(date);
  const formattedDate = appointmentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Email template
  const mailOptions = {
    from: `"Barbershop" <${emailConfig.auth.user}>`,
    to: client.email,
    subject: 'Your Appointment Confirmation',
    html: `
      <h2>Appointment Confirmation</h2>
      <p>Hello ${client.name},</p>
      <p>Your appointment has been confirmed:</p>
      <ul>
        <li><strong>Service:</strong> ${service.name}</li>
        <li><strong>Barber:</strong> ${staff.name}</li>
        <li><strong>Date:</strong> ${formattedDate}</li>
        <li><strong>Time:</strong> ${time}</li>
        <li><strong>Duration:</strong> ${service.duration} minutes</li>
        <li><strong>Price:</strong> $${service.price.toFixed(2)}</li>
      </ul>
      <p>If you need to cancel or reschedule, please do so at least 24 hours in advance.</p>
      <p>We look forward to seeing you!</p>
    `
  };
  
  return transporter.sendMail(mailOptions);
};

/**
 * Send appointment reminder email
 * @param {Object} appointment - Appointment object with populated client, staff and service
 * @returns {Promise} - Email sending result
 */
exports.sendAppointmentReminder = async (appointment) => {
  // Implement reminder email logic
};

/**
 * Send password reset email
 * @param {Object} user - User object
 * @param {String} resetToken - Password reset token
 * @returns {Promise} - Email sending result
 */
exports.sendPasswordReset = async (user, resetToken) => {
  // Implement password reset email logic
};