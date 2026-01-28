import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { PrismaService } from '../prisma.service';

export interface EmailOptions {
  to: string;
  toName?: string;
  subject: string;
  body: string;
  from?: 'noreply' | 'support';
  templateId?: string;
  metadata?: Record<string, any>;
}

export interface TemplateVariables {
  [key: string]: string | number;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  // Email account configurations from environment variables
  private readonly emailConfigs = {
    noreply: {
      email: process.env.NOREPLY_EMAIL || 'noreply@hacktolive.net',
      password: process.env.NOREPLY_PASSWORD || '',
    },
    support: {
      email: process.env.SUPPORT_EMAIL || 'support@hacktolive.net',
      password: process.env.SUPPORT_PASSWORD || '',
    },
  };

  private readonly smtpConfig = {
    host: process.env.SMTP_HOST || 'smtp.hostinger.com',
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: process.env.SMTP_SECURE === 'true' || true, // SSL
    tls: {
      rejectUnauthorized: false, // Allow self-signed certificates
      minVersion: 'TLSv1.2', // Minimum TLS version
    },
  };

  constructor(private readonly prisma: PrismaService) {
    // Initialize with default noreply account
    this.initializeTransporter('noreply');
  }

  /**
   * Initialize nodemailer transporter with specified account
   */
  private initializeTransporter(account: 'noreply' | 'support' = 'noreply') {
    const config = this.emailConfigs[account];
    
    this.transporter = nodemailer.createTransport({
      host: this.smtpConfig.host,
      port: this.smtpConfig.port,
      secure: this.smtpConfig.secure,
      auth: {
        user: config.email,
        pass: config.password,
      },
      tls: this.smtpConfig.tls,
      pool: true,
      maxConnections: 5,
      maxMessages: 100,
      rateDelta: 1000,
      rateLimit: 10,
    } as nodemailer.TransportOptions);

    this.logger.log(`Email transporter initialized with ${account} account`);
  }

  /**
   * Replace variables in template with actual values
   */
  private replaceVariables(template: string, variables: TemplateVariables): string {
    let result = template;
    
    Object.keys(variables).forEach((key) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      result = result.replace(regex, String(variables[key]));
    });

    return result;
  }

  /**
   * Send email using template slug
   */
  async sendTemplateEmail(
    templateSlug: string,
    recipientEmail: string,
    variables: TemplateVariables,
    recipientName?: string,
    metadata?: Record<string, any>,
  ): Promise<boolean> {
    try {
      this.logger.log(`Attempting to send email using template: ${templateSlug} to ${recipientEmail}`);
      
      // Fetch template from database
      const template = await this.prisma.emailTemplate.findUnique({
        where: { slug: templateSlug },
      });

      if (!template) {
        this.logger.error(`Email template not found: ${templateSlug}`);
        return false;
      }

      if (!template.isActive) {
        this.logger.warn(`Email template is inactive: ${templateSlug}`);
        return false;
      }

      this.logger.log(`Found active template: ${template.name}, preparing to send...`);

      // Replace variables in subject and body
      const subject = this.replaceVariables(template.subject, variables);
      const body = this.replaceVariables(template.body, variables);

      // Determine from email based on template settings
      const fromAccount = template.fromEmail === 'SUPPORT' ? 'support' : 'noreply';
      
      // Send email
      return await this.sendEmail({
        to: recipientEmail,
        toName: recipientName,
        subject,
        body,
        from: fromAccount,
        templateId: template.id,
        metadata,
      });
    } catch (error) {
      this.logger.error(`Error sending template email: ${error.message}`, error.stack);
      return false;
    }
  }

  /**
   * Send raw email
   */
  async sendEmail(options: EmailOptions): Promise<boolean> {
    const { to, toName, subject, body, from = 'noreply', templateId, metadata } = options;

    try {
      // Initialize transporter with correct account
      this.initializeTransporter(from);

      // Send email immediately (non-blocking)
      const sendPromise = this.transporter.sendMail({
        from: `"HackToLive" <${this.emailConfigs[from].email}>`,
        to: toName ? `"${toName}" <${to}>` : to,
        subject,
        html: body,
      });

      // Create email log and handle result in background
      this.handleEmailLog(sendPromise, to, toName, subject, body, from, templateId, metadata);

      // Return immediately for fast response
      return true;
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}: ${error.message}`, error.stack);
      return false;
    }
  }

  /**
   * Handle email logging in background (non-blocking)
   */
  private async handleEmailLog(
    sendPromise: Promise<any>,
    to: string,
    toName: string | undefined,
    subject: string,
    body: string,
    from: 'noreply' | 'support',
    templateId?: string,
    metadata?: Record<string, any>,
  ): Promise<void> {
    // Create email log entry
    const emailLog = await this.prisma.emailLog.create({
      data: {
        templateId,
        recipientEmail: to,
        recipientName: toName,
        subject,
        body,
        fromEmail: this.emailConfigs[from].email,
        status: 'PENDING',
        metadata: metadata ? JSON.stringify(metadata) : null,
      },
    });

    try {
      const info = await sendPromise;
      
      // Update log as sent
      await this.prisma.emailLog.update({
        where: { id: emailLog.id },
        data: {
          status: 'SENT',
          sentAt: new Date(),
        },
      });

      this.logger.log(`Email sent successfully to ${to}: ${info.messageId}`);
    } catch (error) {
      // Update log as failed
      await this.prisma.emailLog.update({
        where: { id: emailLog.id },
        data: {
          status: 'FAILED',
          failedAt: new Date(),
          errorMessage: error.message,
        },
      });

      this.logger.error(`Failed to send email to ${to}: ${error.message}`, error.stack);
    }
  }

  /**
   * Send career application confirmation
   */
  async sendCareerApplicationConfirmation(
    applicantEmail: string,
    applicantName: string,
    jobTitle: string,
    applicationId: string,
  ): Promise<boolean> {
    return this.sendTemplateEmail(
      'career-application-confirmation',
      applicantEmail,
      {
        name: applicantName,
        position: jobTitle,
        applicationId,
        date: new Date().toLocaleDateString(),
      },
      applicantName,
      { type: 'career_application', applicationId },
    );
  }

  /**
   * Send career application status update
   */
  async sendCareerApplicationStatusUpdate(
    applicantEmail: string,
    applicantName: string,
    jobTitle: string,
    newStatus: string,
    notes?: string,
  ): Promise<boolean> {
    return this.sendTemplateEmail(
      'career-application-status',
      applicantEmail,
      {
        name: applicantName,
        position: jobTitle,
        status: newStatus,
        message: notes || 'No additional notes',
        date: new Date().toLocaleDateString(),
      },
      applicantName,
      { type: 'career_status_update', status: newStatus },
    );
  }

  /**
   * Send contact form confirmation
   */
  async sendContactFormConfirmation(
    email: string,
    name: string,
    subject: string,
  ): Promise<boolean> {
    return this.sendTemplateEmail(
      'contact-form-confirmation',
      email,
      {
        name,
      },
      name,
      { type: 'contact_form', subject },
    );
  }

  /**
   * Send course enrollment confirmation
   */
  async sendCourseEnrollmentConfirmation(
    studentEmail: string,
    studentName: string,
    courseName: string,
    courseSlug: string,
    instructorName: string,
    isFree: boolean = false,
  ): Promise<boolean> {
    const enrollmentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    
    const courseUrl = `${process.env.FRONTEND_URL || 'https://hacktolive.io'}/student/courses/${courseSlug}`;

    return this.sendTemplateEmail(
      'course-enrollment-confirmation',
      studentEmail,
      {
        studentName,
        courseName,
        courseSlug,
        enrollmentDate,
        courseUrl,
        instructorName,
        isFree: isFree ? 'Yes' : 'No',
      },
      studentName,
      { 
        type: 'course_enrollment', 
        courseSlug,
        isFree,
      },
    );
  }

  /**
   * Verify SMTP connection
   */
  async verifyConnection(account: 'noreply' | 'support' = 'noreply'): Promise<boolean> {
    try {
      this.initializeTransporter(account);
      await this.transporter.verify();
      this.logger.log(`SMTP connection verified for ${account} account`);
      return true;
    } catch (error) {
      this.logger.error(`SMTP connection failed for ${account}: ${error.message}`);
      return false;
    }
  }
}
