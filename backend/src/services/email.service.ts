import { logger } from '../utils/logger';

export class EmailService {
  /**
   * Mocks sending an OTP email (prints to logs in dev, can be wired to Nodemailer/Sendgrid)
   */
  public static async sendOtp(email: string, otp: string): Promise<void> {
    logger.info(`[EMAIL MOCK] OTP [${otp}] generated for [${email}]`);
    // NodeMailer implementation placeholder
    /*
    import nodemailer from 'nodemailer';
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    });
    await transporter.sendMail({
      from: '"AdhikarAI" <noreply@adhikarai.org>',
      to: email,
      subject: 'Verification Code - AdhikarAI',
      text: `Your verification OTP is: ${otp}. It is valid for 10 minutes.`
    });
    */
  }
}
export default EmailService;
