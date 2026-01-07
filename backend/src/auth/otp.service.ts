import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { OtpType } from '@prisma/client';
import { EmailService } from '../email/email.service';

@Injectable()
export class OtpService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  /**
   * Generate a random 6-digit OTP code
   */
  private generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Create and send OTP
   */
  async createAndSendOtp(
    userId: string,
    email: string,
    name: string,
    type: OtpType,
  ): Promise<void> {
    // Delete any existing unused OTPs for this user and type
    await this.prisma.otp.deleteMany({
      where: {
        userId,
        type,
        used: false,
      },
    });

    // Generate new OTP code
    const code = this.generateCode();

    // Set expiry time (5 minutes from now)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5);

    // Create OTP in database
    await this.prisma.otp.create({
      data: {
        userId,
        code,
        type,
        expiresAt,
      },
    });

    // Send OTP via email based on type
    let templateSlug: string;
    let subject: string;
    const variables: Record<string, string> = {
      name,
      code,
      expiryMinutes: '5',
    };

    switch (type) {
      case 'REGISTRATION':
        templateSlug = 'registration-otp';
        subject = 'Verify Your Email - HACKTOLIVE';
        break;
      case 'LOGIN':
        templateSlug = 'login-otp';
        subject = 'Your Login OTP - HACKTOLIVE';
        break;
      case 'PASSWORD_RESET':
        templateSlug = 'password-reset-otp';
        subject = 'Reset Your Password - HACKTOLIVE';
        break;
      default:
        templateSlug = 'generic-otp';
        subject = 'Your OTP Code - HACKTOLIVE';
    }

    // Try to send using template, fallback to direct email if template not found
    const templateSent = await this.emailService.sendTemplateEmail(templateSlug, email, variables);
    
    if (!templateSent) {
      // Fallback: send direct email without template
      const emailBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Hello ${name},</h2>
          <p>Your OTP code is: <strong style="font-size: 24px; color: #6366f1;">${code}</strong></p>
          <p>This code will expire in 5 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <br>
          <p>Best regards,<br>HACKTOLIVE Team</p>
        </div>
      `;

      await this.emailService.sendEmail({
        from: 'noreply',
        to: email,
        subject,
        body: emailBody,
      });
    }
  }

  /**
   * Verify OTP code
   */
  async verifyOtp(
    userId: string,
    code: string,
    type: OtpType,
  ): Promise<boolean> {
    const otp = await this.prisma.otp.findFirst({
      where: {
        userId,
        code,
        type,
        used: false,
        expiresAt: {
          gte: new Date(),
        },
      },
    });

    if (!otp) {
      return false;
    }

    // Mark OTP as used (disposable)
    await this.prisma.otp.update({
      where: { id: otp.id },
      data: { used: true },
    });

    return true;
  }

  /**
   * Verify OTP by email (for password reset when user isn't logged in)
   */
  async verifyOtpByEmail(
    email: string,
    code: string,
    type: OtpType,
  ): Promise<{ valid: boolean; userId?: string }> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { valid: false };
    }

    const isValid = await this.verifyOtp(user.id, code, type);
    return { valid: isValid, userId: user.id };
  }

  /**
   * Clean up expired OTPs (can be called periodically)
   */
  async cleanupExpiredOtps(): Promise<void> {
    await this.prisma.otp.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
  }
}
