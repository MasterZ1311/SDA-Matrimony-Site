import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter | null = null;
  private readonly fromEmail: string;
  private readonly fromName: string;
  private readonly siteUrl: string;

  constructor(private readonly configService: ConfigService) {
    const host = this.configService.get<string>('SMTP_HOST') || process.env.SMTP_HOST;
    const port = parseInt(this.configService.get<string>('SMTP_PORT') || process.env.SMTP_PORT || '587', 10);
    const user = this.configService.get<string>('SMTP_USER') || process.env.SMTP_USER;
    const pass = this.configService.get<string>('SMTP_PASSWORD') || process.env.SMTP_PASSWORD;

    this.fromEmail =
      this.configService.get<string>('SMTP_FROM_EMAIL') ||
      process.env.SMTP_FROM_EMAIL ||
      'noreply@sdatrimony.org';
    this.fromName =
      this.configService.get<string>('SMTP_FROM_NAME') ||
      process.env.SMTP_FROM_NAME ||
      'SDA Matrimony Platform';
    this.siteUrl =
      this.configService.get<string>('NEXT_PUBLIC_SITE_URL') ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      'http://localhost:3000';

    if (host && user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: {
          user,
          pass,
        },
      });
      this.logger.log(`Mail service initialized with SMTP transport: ${host}:${port}`);
    } else {
      this.logger.warn(
        'SMTP credentials are not fully configured. Emails will be logged to the console for development testing.',
      );
    }
  }

  /**
   * Sends an email verification link and raw token to a newly registered user.
   */
  async sendVerificationEmail(to: string, token: string, firstName?: string): Promise<void> {
    const verifyUrl = `${this.siteUrl}/auth/verify-email?token=${encodeURIComponent(token)}`;
    const recipientName = firstName ? ` ${firstName}` : '';

    const subject = 'Verify your SDA Matrimony account';
    const textContent = `Dear${recipientName},\n\nWelcome to the Seventh-day Adventist Matrimony Platform. Please verify your email address by visiting the link below (valid for 1 hour):\n\n${verifyUrl}\n\nAlternatively, you can manually use this verification token: ${token}\n\nIf you did not create this account, please ignore this email.\n\nBlessings,\nSDA Matrimony Team`;

    const htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1e293b; background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h2 style="color: #1e3a8a; margin: 0 0 8px 0; font-size: 24px; font-weight: 700;">Seventh-day Adventist Matrimony</h2>
          <p style="color: #64748b; font-size: 14px; margin: 0;">Faith-Aligned Covenant Relationships</p>
        </div>
        <div style="background-color: #ffffff; padding: 32px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
          <h3 style="color: #0f172a; margin-top: 0;">Confirm Your Email Address</h3>
          <p style="font-size: 15px; line-height: 1.6;">Dear${recipientName},</p>
          <p style="font-size: 15px; line-height: 1.6;">
            Thank you for registering with the SDA Matrimony Platform. To activate your account and complete your member profile, please verify your email address.
          </p>
          <div style="text-align: center; margin: 28px 0;">
            <a href="${verifyUrl}" style="background-color: #2563eb; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 15px; display: inline-block;">
              Verify Email Address
            </a>
          </div>
          <div style="background-color: #f1f5f9; padding: 14px; border-radius: 6px; margin-top: 20px;">
            <p style="margin: 0; font-size: 12px; color: #475569;">Verification Token: <code style="font-family: monospace; font-size: 13px; color: #1e293b; word-break: break-all;">${token}</code></p>
          </div>
          <p style="font-size: 13px; color: #64748b; margin-top: 24px; line-height: 1.5;">
            This link and token are valid for <strong>1 hour</strong>. If you did not sign up for an account, no further action is required.
          </p>
        </div>
        <div style="text-align: center; margin-top: 24px; font-size: 12px; color: #94a3b8;">
          <p style="margin: 0;">&copy; ${new Date().getFullYear()} SDA Matrimony Platform. All rights reserved.</p>
        </div>
      </div>
    `;

    await this.sendMail(to, subject, textContent, htmlContent, `Email Verification -> ${verifyUrl}`);
  }

  /**
   * Sends a password reset link and raw token to a user requesting recovery.
   */
  async sendPasswordResetEmail(to: string, token: string, firstName?: string): Promise<void> {
    const resetUrl = `${this.siteUrl}/auth/reset-password?token=${encodeURIComponent(token)}`;
    const recipientName = firstName ? ` ${firstName}` : '';

    const subject = 'Reset your SDA Matrimony password';
    const textContent = `Dear${recipientName},\n\nA password reset request was made for your account on the SDA Matrimony Platform. Please reset your password by visiting the link below (valid for 30 minutes):\n\n${resetUrl}\n\nAlternatively, you can manually use this reset token: ${token}\n\nIf you did not request this, you can safely ignore this email.\n\nBlessings,\nSDA Matrimony Team`;

    const htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1e293b; background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h2 style="color: #1e3a8a; margin: 0 0 8px 0; font-size: 24px; font-weight: 700;">Seventh-day Adventist Matrimony</h2>
          <p style="color: #64748b; font-size: 14px; margin: 0;">Password Recovery Assistance</p>
        </div>
        <div style="background-color: #ffffff; padding: 32px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
          <h3 style="color: #0f172a; margin-top: 0;">Password Reset Request</h3>
          <p style="font-size: 15px; line-height: 1.6;">Dear${recipientName},</p>
          <p style="font-size: 15px; line-height: 1.6;">
            We received a request to reset your password. Click the button below to choose a new password:
          </p>
          <div style="text-align: center; margin: 28px 0;">
            <a href="${resetUrl}" style="background-color: #d97706; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 15px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <div style="background-color: #f1f5f9; padding: 14px; border-radius: 6px; margin-top: 20px;">
            <p style="margin: 0; font-size: 12px; color: #475569;">Reset Token: <code style="font-family: monospace; font-size: 13px; color: #1e293b; word-break: break-all;">${token}</code></p>
          </div>
          <p style="font-size: 13px; color: #64748b; margin-top: 24px; line-height: 1.5;">
            This password reset link is valid for <strong>30 minutes</strong>. If you did not request a password reset, please ignore this email or reach out to security support.
          </p>
        </div>
        <div style="text-align: center; margin-top: 24px; font-size: 12px; color: #94a3b8;">
          <p style="margin: 0;">&copy; ${new Date().getFullYear()} SDA Matrimony Platform. All rights reserved.</p>
        </div>
      </div>
    `;

    await this.sendMail(to, subject, textContent, htmlContent, `Password Reset -> ${resetUrl}`);
  }

  private async sendMail(
    to: string,
    subject: string,
    textContent: string,
    htmlContent: string,
    previewInfo: string,
  ): Promise<void> {
    if (!this.transporter) {
      this.logger.log(`[DEV EMAIL MOCK] To: ${to} | Subject: "${subject}" | Action Link: ${previewInfo}`);
      return;
    }

    try {
      await this.transporter.sendMail({
        from: `"${this.fromName}" <${this.fromEmail}>`,
        to,
        subject,
        text: textContent,
        html: htmlContent,
      });
      this.logger.log(`Email dispatched to ${to} with subject "${subject}"`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}: ${error?.message || error}`);
      this.logger.log(`[DEV FALLBACK] Action Link: ${previewInfo}`);
    }
  }
}
