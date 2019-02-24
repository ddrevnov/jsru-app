import * as nodemailer from 'nodemailer';
import * as nodemailerHtmlToText from 'nodemailer-html-to-text';
import config from '../utils/config';

const { htmlToText } = nodemailerHtmlToText;

const transport = nodemailer.createTransport({
  service: 'gmail',
  secure: false,
  port: 25,
  auth: {
    user: config.mailer.gmail.user,
    pass: config.mailer.gmail.password,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

transport.use('compile', htmlToText());

const sendMail = async (options) => {
  const sender: any = config.mailer.senders[options.from || 'default'];
  const html = `<div>
    <a href={"${options.link}"}>${options.link}</a>
  </div>`;

  const message = {
    html,
    from: {
      address: sender.fromEmail,
      name: sender.fromName,
    },
    to: options.to,
    subject: options.subject,
    headers: options.headers || {},
  };

  return await transport.sendMail(message);
};

export default sendMail;
