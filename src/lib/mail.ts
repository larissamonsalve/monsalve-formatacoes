import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: Number(process.env.SMTP_PORT) || 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendOTPEmail(to: string, otp: string) {
  const mailOptions = {
    from: '"Monsalve Formatações" <no-reply@monsalve.com>',
    to,
    subject: 'O seu código de verificação',
    html: `
      <div style="font-family: sans-serif; text-align: center; padding: 20px;">
        <h2>Validação de E-mail</h2>
        <p>Use o código abaixo para confirmar a sua conta. Ele expira em 10 minutos.</p>
        <h1 style="color: #5B3196; letter-spacing: 5px;">${otp}</h1>
        <p>Se não solicitou este código, ignore este e-mail.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}