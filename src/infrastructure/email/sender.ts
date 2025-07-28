import nodemailer from 'nodemailer';
import config from '@config/env';

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: config.EMAIL_USER,
    pass: config.EMAIL_PASS
  }
});

export const sendEmail = async (options: {
  to: string;
  subject: string;
  html: string;
}) => {
  await transporter.sendMail({
    from: `"My App" <${config.EMAIL_USER}>`,
    ...options
  });
};