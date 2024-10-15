import nodemailer from 'nodemailer';

const transport = nodemailer.createTransport({
  host: 'sandbox.smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: 'c9a253e4c53034',
    pass: 'c9ad3b06bd7d68'
  }
});

export default transport;