import { ValidationError } from './errors.helper';
import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
import { formatCurrency } from './strings.helper';

// CONFIGURE DOTENV
dotenv.config();

// SET SENDGRID API KEY
sgMail.setApiKey(String(process.env.SENDGRID_API_KEY));

/**
 * Send an email using SendGrid.
 *
 * @param {string} toEmail - Recipient's email address.
 * @param {string} fromEmail - Sender's email address.
 * @param {string} subject - Subject line of the email.
 * @param {string} htmlContent - HTML content of the email.
 * @param {string} textContent - Plain text content of the email (optional).
 */
export const sendEmail = async (
  toEmail: string,
  fromEmail: string,
  subject: string,
  htmlContent: string
) => {
  const msg = {
    to: toEmail,
    from: fromEmail,
    subject: subject,
    html: htmlContent,
  };

  try {
    await sgMail.send(msg);
    return true;
  } catch (error) {
    throw new ValidationError('Failed to send email');
  }
};

export function bookingSubmittedEmailTemplate({
  referenceId,
  name,
  totalAmountUsd,
  totalAmountRwf,
}: {
  referenceId: string;
  name: string;
  totalAmountUsd: number;
  totalAmountRwf: number;
}) {
  return `<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            color: #036124;
        }
        .email-container {
            padding: 20px;
            background-color: #f4f4f4;
        }
        .header {
            background-color: #ffffff;
            padding: 10px;
            text-align: center;
            color: white;
        }
        .content {
            background-color: white;
            padding: 20px;
            margin-top: 10px;
            border-radius: 8px;
            border: 1px solid #ddd;
        }
        .footer {
            text-align: center;
            padding: 10px;
            font-size: 12px;
        }
        .reference-id {
            font-weight: bold;
            color: #036124;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <img src="https://res.cloudinary.com/nishimweprince/image/upload/v1718954750/akagera-booking/gvcbmerwjceo9jf7z1az.png" alt="Akagera National Park Logo" style="max-width: 200px;">
        </div>
        <div class="content">
            <h1>Booking Confirmation</h1>
            <p>Dear ${name},</p>
            <p>Thank you for booking your visit to Akagera National Park. Your booking has been successfully submitted and is now being processed.</p>
            <p>Your reference ID for tracking and managing your booking is: <span class="reference-id">${referenceId}</span></p>
            <p>Your total amount due is: ${formatCurrency(
              totalAmountUsd
            )}, or an equivalent of ${formatCurrency(totalAmountRwf, 'RWF')}</p>
            <p>We look forward to welcoming you to the park and hope you enjoy your visit!</p>
            <p>Best Regards,<br>Akagera National Park Team</p>
        </div>
        <div class="footer">
            &copy; 2024 Akagera National Park. All rights reserved.
        </div>
    </div>
</body>
</html>`;
}

export function newUserCreatedEmailTemplate({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}) {
  return `<!DOCTYPE html>
  <html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        color: #036124;
      }
      .email-container {
        padding: 20px;
        background-color: #f4f4f4;
      }
      .header {
        background-color: #ffffff;
        padding: 10px;
        text-align: center;
        color: white;
      }
      .content {
        background-color: white;
        padding: 20px;
        margin-top: 10px;
        border-radius: 8px;
        border: 1px solid #ddd;
      }
      .footer {
        text-align: center;
        padding: 10px;
        font-size: 12px;
      }
      .email,
      .password {
        font-weight: bold;
        color: #036124;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="header">
        <img src="https://res.cloudinary.com/nishimweprince/image/upload/v1718954750/akagera-booking/gvcbmerwjceo9jf7z1az.png" alt="Akagera National Park Logo" style="max-width: 200px;">
      </div>
      <div class="content">
        <h1>Welcome to Akagera National Park</h1>
        <p>Dear ${name},</p>
        <p>We are excited to have you as a new user of Akagera National Park's online services.</p>
        <p>Your account has been successfully created. Here are your login details:</p>
        <p>Email: <span class="email">${email}</span></p>
        <p>Password: <span class="password">${password}</span></p>
        <p>We recommend that you change your password after your first login for security reasons.</p>
        <p>We look forward to providing you with the best service possible!</p>
        <p>Best Regards,<br>Akagera National Park Team</p>
      </div>
      <div class="footer">
        &copy; 2024 Akagera National Park. All rights reserved.
      </div>
    </div>
  </body>
  </html>`;
}

export function loginOtpEmailTemplate({
  name,
  otp,
}: {
  name: string;
  otp: string;
}) {
  return `<!DOCTYPE html>
  <html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        color: #036124;
      }
      .email-container {
        padding: 20px;
        background-color: #f4f4f4;
      }
      .header {
        background-color: #ffffff;
        padding: 10px;
        text-align: center;
        color: white;
      }
      .content {
        background-color: white;
        padding: 20px;
        margin-top: 10px;
        border-radius: 8px;
        border: 1px solid #ddd;
      }
      .footer {
        text-align: center;
        padding: 10px;
        font-size: 12px;
      }
      .otp {
        font-weight: bold;
        color: #036124;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="header">
        <img src="https://res.cloudinary.com/nishimweprince/image/upload/v1718954750/akagera-booking/gvcbmerwjceo9jf7z1az.png" alt="Akagera National Park Logo" style="max-width: 200px;">
      </div>
      <div class="content">
        <h1>Verify Authentication</h1>
        <p>Dear ${name},</p>
        <p>Your One-time password for logging in to your Akagera National Park account is: <span class="otp">${otp}</span></p>
        <p>Please enter this One-time password in the login form to access your account.</p>
        <p>This One-time password expires in 10 minutes.</p>
        <p>We look forward to providing you with the best service possible!</p>
        <p>Best Regards,<br>Akagera National Park Team</p>
      </div>
      <div class="footer">
        &copy; 2024 Akagera National Park. All rights reserved.
      </div>
    </div>
  </body>
  </html>`;
}
