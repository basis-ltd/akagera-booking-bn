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
  htmlContent: string,
  attachments?: {
    content: string;
    filename: string;
    type?: string;
    disposition?: string;
  }[]
) => {
  const msg = {
    to: toEmail,
    from: fromEmail,
    subject: subject,
    html: htmlContent,
    attachments: attachments,
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
        color: #333333;
      }
      .email-container {
        padding: 20px;
        background-color: #f4f4f4;
      }
      .header {
        background-color: #ffffff;
        padding: 20px;
        text-align: center;
      }
      .content {
        background-color: white;
        padding: 30px;
        margin-top: 20px;
        border-radius: 8px;
        border: 1px solid #ddd;
      }
      .footer {
        text-align: center;
        padding: 20px;
        font-size: 12px;
        color: #666666;
      }
      .highlight {
        font-size: 24px;
        font-weight: bold;
        color: #036124;
        display: block;
        text-align: center;
        margin: 20px 0;
        padding: 10px;
        background-color: #e8f5e9;
        border-radius: 4px;
      }
      h1 {
        color: #036124;
      }
      .disclaimer {
        margin-top: 20px;
        padding: 10px;
        background-color: #f0f0f0;
        border-radius: 4px;
        font-size: 14px;
        color: #555555;
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
        <p>Your reference ID for tracking and managing your booking is:</p>
        <div class="highlight">${referenceId}</div>
        <p>Your total amount due is:</p>
        <div class="highlight">${formatCurrency(totalAmountUsd)}</div>
        <p>or an equivalent of</p>
        <div class="highlight">${formatCurrency(totalAmountRwf, 'RWF')}</div>
        <p>We look forward to welcoming you to the park and hope you enjoy your visit!</p>
        <p>Best Regards,<br>Akagera National Park Team</p>
        <div class="disclaimer">
          <strong>Need support?</strong> Please reach out to <a href="mailto:akagera@africanparks.org">akagera@africanparks.org</a> for any assistance or inquiries.
        </div>
      </div>
      <div class="footer">
        &copy; 2024 Akagera National Park. All rights reserved.<br>
        This email is intended for booking confirmation purposes only.
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
        color: #333333;
      }
      .email-container {
        padding: 20px;
        background-color: #f4f4f4;
      }
      .header {
        background-color: #ffffff;
        padding: 20px;
        text-align: center;
      }
      .content {
        background-color: white;
        padding: 30px;
        margin-top: 20px;
        border-radius: 8px;
        border: 1px solid #ddd;
      }
      .footer {
        text-align: center;
        padding: 20px;
        font-size: 12px;
        color: #666666;
      }
      .email {
        font-weight: bold;
        color: #036124;
      }
      .password {
        font-size: 24px;
        font-weight: bold;
        color: #036124;
        display: block;
        text-align: center;
        margin: 20px 0;
        padding: 10px;
        background-color: #e8f5e9;
        border-radius: 4px;
      }
      h1 {
        color: #036124;
      }
      .disclaimer {
        margin-top: 20px;
        padding: 10px;
        background-color: #f0f0f0;
        border-radius: 4px;
        font-size: 14px;
        color: #555555;
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
        <p>Password:</p>
        <div class="password">${password}</div>
        <p><strong>Important:</strong> We strongly recommend that you change your password after your first login for security reasons.</p>
        <p>We look forward to providing you with the best service possible!</p>
        <p>Best Regards,<br>Akagera National Park Team</p>
        <div class="disclaimer">
          <strong>Need support?</strong> Please reach out to <a href="mailto:akagera@africanparks.org">akagera@africanparks.org</a> for any assistance or inquiries.
        </div>
      </div>
      <div class="footer">
        &copy; 2024 Akagera National Park. All rights reserved.<br>
        This email is intended for account creation notification purposes only.
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
        color: #333333;
      }
      .email-container {
        padding: 20px;
        background-color: #f4f4f4;
      }
      .header {
        background-color: #ffffff;
        padding: 20px;
        text-align: center;
      }
      .content {
        background-color: white;
        padding: 30px;
        margin-top: 20px;
        border-radius: 8px;
        border: 1px solid #ddd;
      }
      .footer {
        text-align: center;
        padding: 20px;
        font-size: 12px;
        color: #666666;
      }
      .otp {
        font-size: 36px;
        font-weight: bold;
        color: #036124;
        display: block;
        text-align: center;
        margin: 20px 0;
        padding: 10px;
        background-color: #e8f5e9;
        border-radius: 4px;
      }
      h1 {
        color: #036124;
      }
      .disclaimer {
        margin-top: 20px;
        padding: 10px;
        background-color: #f0f0f0;
        border-radius: 4px;
        font-size: 14px;
        color: #555555;
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
        <p>Your One-Time Password (OTP) for logging in to your Akagera National Park account is:</p>
        <div class="otp">${otp}</div>
        <p>Please enter this OTP in the login form to access your account.</p>
        <p><strong>Important:</strong> This OTP will expire in 10 minutes.</p>
        <p>We look forward to providing you with the best service possible!</p>
        <p>Best Regards,<br>Akagera National Park Team</p>
        <div class="disclaimer">
          <strong>Need support?</strong> Please reach out to <a href="mailto:akagera@africanparks.org">akagera@africanparks.org</a> for any assistance or inquiries.
        </div>
      </div>
      <div class="footer">
        &copy; 2024 Akagera National Park. All rights reserved.<br>
        This email is intended for authentication purposes only.
      </div>
    </div>
  </body>
  </html>`;
}

export function bookingsSearchOtpEmailTemplate({
  otp,
}: {
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
        color: #333333;
      }
      .email-container {
        padding: 20px;
        background-color: #f4f4f4;
      }
      .header {
        background-color: #ffffff;
        padding: 20px;
        text-align: center;
      }
      .content {
        background-color: white;
        padding: 30px;
        margin-top: 20px;
        border-radius: 8px;
        border: 1px solid #ddd;
      }
      .footer {
        text-align: center;
        padding: 20px;
        font-size: 12px;
        color: #666666;
      }
      .otp {
        font-size: 36px;
        font-weight: bold;
        color: #036124;
        display: block;
        text-align: center;
        margin: 20px 0;
        padding: 10px;
        background-color: #e8f5e9;
        border-radius: 4px;
      }
      h1 {
        color: #036124;
      }
      .disclaimer {
        margin-top: 20px;
        padding: 10px;
        background-color: #f0f0f0;
        border-radius: 4px;
        font-size: 14px;
        color: #555555;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="header">
        <img src="https://res.cloudinary.com/nishimweprince/image/upload/v1718954750/akagera-booking/gvcbmerwjceo9jf7z1az.png" alt="Akagera National Park Logo" style="max-width: 200px;">
      </div>
      <div class="content">
        <h1>Search Bookings Authentication</h1>
        <p>Hello,</p>
        <p>To proceed with searching bookings on your Akagera National Park account, please use the following One-Time Password (OTP):</p>
        <div class="otp">${otp}</div>
        <p>Please enter this OTP in the search bookings form to access your booking information.</p>
        <p><strong>Important:</strong> This OTP will expire in 10 minutes.</p>
        <p>If you didn't request this OTP, please ignore this email or contact our support team immediately.</p>
        <p>We're excited to assist you with your booking search!</p>
        <p>Best Regards,<br>Akagera National Park Team</p>
        <div class="disclaimer">
          <strong>Need support?</strong> Please reach out to <a href="mailto:akagera@africanparks.org">akagera@africanparks.org</a> for any assistance or inquiries.
        </div>
      </div>
      <div class="footer">
        &copy; 2024 Akagera National Park. All rights reserved.<br>
        This email is intended for booking verification purposes only.
      </div>
    </div>
  </body>
  </html>`;
}
