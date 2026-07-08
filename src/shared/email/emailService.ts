import nodemailer from 'nodemailer';

import { appConfig } from '../../config/appConfig';

type SendEmailInput = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

const createTransport = () => {
  if (!appConfig.mail.enabled) {
    return null;
  }

  return nodemailer.createTransport({
    host: appConfig.mail.smtp.host,
    port: appConfig.mail.smtp.port,
    secure: appConfig.mail.smtp.secure,
    auth: {
      user: appConfig.mail.smtp.user,
      pass: appConfig.mail.smtp.password,
    },
  });
};

const transport = createTransport();

const sendEmail = async ({ to, subject, text, html }: SendEmailInput) => {
  if (!transport) {
    console.log(`Email disabled. To: ${to}. Subject: ${subject}`);
    return;
  }

  await transport.sendMail({
    from: appConfig.mail.from,
    to,
    subject,
    text,
    html,
  });
};

export { sendEmail };
