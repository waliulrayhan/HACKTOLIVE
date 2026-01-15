import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { EmailService } from '../email/email.service';
import { NewsletterStatus, CampaignStatus } from '@prisma/client';
import { SubscribeNewsletterDto, CreateCampaignDto, UpdateCampaignDto } from './dto/newsletter.dto';

@Injectable()
export class NewsletterService {
  private readonly logger = new Logger(NewsletterService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  /**
   * Subscribe to newsletter
   */
  async subscribe(data: SubscribeNewsletterDto) {
    const { email, name, source } = data;

    try {
      // Check if already subscribed
      const existing = await this.prisma.newsletter.findUnique({
        where: { email },
      });

      if (existing) {
        if (existing.status === NewsletterStatus.SUBSCRIBED) {
          throw new BadRequestException('Email is already subscribed to newsletter');
        }

        // Resubscribe
        const updated = await this.prisma.newsletter.update({
          where: { email },
          data: {
            status: NewsletterStatus.SUBSCRIBED,
            name: name || existing.name,
            source: source || existing.source,
            subscribedAt: new Date(),
            unsubscribedAt: null,
          },
        });

        // Send welcome email
        await this.sendWelcomeEmail(email, name);

        return {
          success: true,
          message: 'Successfully resubscribed to newsletter',
          data: updated,
        };
      }

      // Create new subscription
      const subscriber = await this.prisma.newsletter.create({
        data: {
          email,
          name,
          source: source || 'website',
          status: NewsletterStatus.SUBSCRIBED,
        },
      });

      // Send welcome email
      await this.sendWelcomeEmail(email, name);

      this.logger.log(`New newsletter subscription: ${email}`);

      return {
        success: true,
        message: 'Successfully subscribed to newsletter',
        data: subscriber,
      };
    } catch (error) {
      this.logger.error(`Error subscribing to newsletter: ${error.message}`);
      throw error;
    }
  }

  /**
   * Unsubscribe from newsletter
   */
  async unsubscribe(email: string) {
    try {
      const subscriber = await this.prisma.newsletter.findUnique({
        where: { email },
      });

      if (!subscriber) {
        throw new NotFoundException('Email not found in newsletter list');
      }

      if (subscriber.status === NewsletterStatus.UNSUBSCRIBED) {
        throw new BadRequestException('Email is already unsubscribed');
      }

      const updated = await this.prisma.newsletter.update({
        where: { email },
        data: {
          status: NewsletterStatus.UNSUBSCRIBED,
          unsubscribedAt: new Date(),
        },
      });

      this.logger.log(`Newsletter unsubscription: ${email}`);

      return {
        success: true,
        message: 'Successfully unsubscribed from newsletter',
        data: updated,
      };
    } catch (error) {
      this.logger.error(`Error unsubscribing from newsletter: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get all subscribers with filters
   */
  async getSubscribers(filters: {
    page?: number;
    limit?: number;
    status?: NewsletterStatus;
    search?: string;
  }) {
    const { page = 1, limit = 20, status, search } = filters;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { email: { contains: search } },
        { name: { contains: search } },
      ];
    }

    const [subscribers, total] = await Promise.all([
      this.prisma.newsletter.findMany({
        where,
        skip,
        take: limit,
        orderBy: { subscribedAt: 'desc' },
      }),
      this.prisma.newsletter.count({ where }),
    ]);

    return {
      data: subscribers,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Delete subscriber
   */
  async deleteSubscriber(id: string) {
    try {
      await this.prisma.newsletter.delete({
        where: { id },
      });

      return {
        success: true,
        message: 'Subscriber deleted successfully',
      };
    } catch (error) {
      this.logger.error(`Error deleting subscriber: ${error.message}`);
      throw new NotFoundException('Subscriber not found');
    }
  }

  /**
   * Create campaign
   */
  async createCampaign(data: CreateCampaignDto, createdBy?: string) {
    try {
      const campaign = await this.prisma.newsletterCampaign.create({
        data: {
          name: data.name,
          subject: data.subject,
          body: data.body,
          tags: data.tags ? JSON.stringify(data.tags) : null,
          scheduledAt: data.scheduledAt,
          status: data.scheduledAt ? CampaignStatus.SCHEDULED : CampaignStatus.DRAFT,
          createdBy,
        },
      });

      this.logger.log(`New campaign created: ${campaign.name}`);

      return {
        success: true,
        message: 'Campaign created successfully',
        data: campaign,
      };
    } catch (error) {
      this.logger.error(`Error creating campaign: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get all campaigns
   */
  async getCampaigns(filters: {
    page?: number;
    limit?: number;
    status?: CampaignStatus;
  }) {
    const { page = 1, limit = 20, status } = filters;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (status) {
      where.status = status;
    }

    const [campaigns, total] = await Promise.all([
      this.prisma.newsletterCampaign.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.newsletterCampaign.count({ where }),
    ]);

    return {
      data: campaigns.map(c => ({
        ...c,
        tags: c.tags ? JSON.parse(c.tags) : [],
      })),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get campaign by ID
   */
  async getCampaignById(id: string) {
    const campaign = await this.prisma.newsletterCampaign.findUnique({
      where: { id },
      include: {
        logs: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            subscriber: true,
          },
        },
      },
    });

    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    return {
      ...campaign,
      tags: campaign.tags ? JSON.parse(campaign.tags) : [],
    };
  }

  /**
   * Update campaign
   */
  async updateCampaign(id: string, data: UpdateCampaignDto) {
    try {
      const campaign = await this.prisma.newsletterCampaign.findUnique({
        where: { id },
      });

      if (!campaign) {
        throw new NotFoundException('Campaign not found');
      }

      if (campaign.status === CampaignStatus.SENT || campaign.status === CampaignStatus.SENDING) {
        throw new BadRequestException('Cannot update a sent or sending campaign');
      }

      const updated = await this.prisma.newsletterCampaign.update({
        where: { id },
        data: {
          ...data,
          tags: data.tags ? JSON.stringify(data.tags) : undefined,
          status: data.scheduledAt ? CampaignStatus.SCHEDULED : undefined,
        },
      });

      return {
        success: true,
        message: 'Campaign updated successfully',
        data: {
          ...updated,
          tags: updated.tags ? JSON.parse(updated.tags) : [],
        },
      };
    } catch (error) {
      this.logger.error(`Error updating campaign: ${error.message}`);
      throw error;
    }
  }

  /**
   * Delete campaign
   */
  async deleteCampaign(id: string) {
    try {
      const campaign = await this.prisma.newsletterCampaign.findUnique({
        where: { id },
      });

      if (!campaign) {
        throw new NotFoundException('Campaign not found');
      }

      if (campaign.status === CampaignStatus.SENDING) {
        throw new BadRequestException('Cannot delete a campaign that is currently sending');
      }

      await this.prisma.newsletterCampaign.delete({
        where: { id },
      });

      return {
        success: true,
        message: 'Campaign deleted successfully',
      };
    } catch (error) {
      this.logger.error(`Error deleting campaign: ${error.message}`);
      throw error;
    }
  }

  /**
   * Send campaign to all subscribers
   */
  async sendCampaign(id: string) {
    try {
      const campaign = await this.prisma.newsletterCampaign.findUnique({
        where: { id },
      });

      if (!campaign) {
        throw new NotFoundException('Campaign not found');
      }

      if (campaign.status === CampaignStatus.SENT || campaign.status === CampaignStatus.SENDING) {
        throw new BadRequestException('Campaign has already been sent or is sending');
      }

      // Update campaign status to sending
      await this.prisma.newsletterCampaign.update({
        where: { id },
        data: { status: CampaignStatus.SENDING },
      });

      // Get all subscribed subscribers
      const where: any = { status: NewsletterStatus.SUBSCRIBED };
      
      // Filter by tags if specified
      if (campaign.tags) {
        const tags = JSON.parse(campaign.tags);
        if (tags.length > 0) {
          where.tags = { contains: tags[0] }; // Simple tag filtering
        }
      }

      const subscribers = await this.prisma.newsletter.findMany({ where });

      this.logger.log(`Sending campaign "${campaign.name}" to ${subscribers.length} subscribers`);

      // Send emails in background
      this.sendCampaignEmails(campaign, subscribers);

      return {
        success: true,
        message: `Campaign is being sent to ${subscribers.length} subscribers`,
        data: { totalRecipients: subscribers.length },
      };
    } catch (error) {
      this.logger.error(`Error sending campaign: ${error.message}`);
      throw error;
    }
  }

  /**
   * Send campaign emails in background
   */
  private async sendCampaignEmails(campaign: any, subscribers: any[]) {
    let totalSent = 0;
    let totalFailed = 0;

    for (const subscriber of subscribers) {
      try {
        // Create log entry
        const log = await this.prisma.newsletterCampaignLog.create({
          data: {
            campaignId: campaign.id,
            subscriberId: subscriber.id,
            status: 'PENDING',
          },
        });

        // Prepare email body with unsubscribe link
        const emailBody = this.prepareEmailBody(campaign.body, subscriber.email);

        // Send email
        const sent = await this.emailService.sendEmail({
          to: subscriber.email,
          toName: subscriber.name,
          subject: campaign.subject,
          body: emailBody,
          from: 'noreply',
          metadata: {
            campaignId: campaign.id,
            subscriberId: subscriber.id,
            logId: log.id,
          },
        });

        if (sent) {
          // Update log
          await this.prisma.newsletterCampaignLog.update({
            where: { id: log.id },
            data: {
              status: 'SENT',
              sentAt: new Date(),
            },
          });
          totalSent++;
        } else {
          // Update log as failed
          await this.prisma.newsletterCampaignLog.update({
            where: { id: log.id },
            data: {
              status: 'FAILED',
              failedReason: 'Email service failed',
            },
          });
          totalFailed++;
        }

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        this.logger.error(`Error sending email to ${subscriber.email}: ${error.message}`);
        totalFailed++;
      }
    }

    // Update campaign with final stats
    await this.prisma.newsletterCampaign.update({
      where: { id: campaign.id },
      data: {
        status: CampaignStatus.SENT,
        sentAt: new Date(),
        totalSent,
        totalFailed,
      },
    });

    this.logger.log(`Campaign "${campaign.name}" completed: ${totalSent} sent, ${totalFailed} failed`);
  }

  /**
   * Prepare email body with unsubscribe link
   */
  private prepareEmailBody(body: string, email: string): string {
    const unsubscribeUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/newsletter/unsubscribe?email=${encodeURIComponent(email)}`;
    
    // Add unsubscribe link at the bottom if not already present
    if (!body.includes('unsubscribe')) {
      body += `
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; color: #718096; font-size: 12px;">
          <p>You're receiving this email because you subscribed to HackToLive newsletter.</p>
          <p><a href="${unsubscribeUrl}" style="color: #4299e1; text-decoration: underline;">Unsubscribe</a> from our mailing list.</p>
        </div>
      `;
    }

    return body;
  }

  /**
   * Send welcome email to new subscriber
   */
  private async sendWelcomeEmail(email: string, name?: string) {
    try {
      // Use email template service
      await this.emailService.sendTemplateEmail(
        'newsletter-welcome',
        email,
        {
          name: name || 'Subscriber',
          email: email,
        },
        name,
        {
          type: 'newsletter',
          action: 'welcome',
        }
      );
    } catch (error) {
      this.logger.error(`Error sending welcome email: ${error.message}`);
    }
  }

  /**
   * Get newsletter statistics
   */
  async getStats() {
    const [
      totalSubscribers,
      activeSubscribers,
      unsubscribed,
      totalCampaigns,
      sentCampaigns,
    ] = await Promise.all([
      this.prisma.newsletter.count(),
      this.prisma.newsletter.count({ where: { status: NewsletterStatus.SUBSCRIBED } }),
      this.prisma.newsletter.count({ where: { status: NewsletterStatus.UNSUBSCRIBED } }),
      this.prisma.newsletterCampaign.count(),
      this.prisma.newsletterCampaign.count({ where: { status: CampaignStatus.SENT } }),
    ]);

    // Get recent subscriptions (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentSubscriptions = await this.prisma.newsletter.count({
      where: {
        subscribedAt: { gte: thirtyDaysAgo },
        status: NewsletterStatus.SUBSCRIBED,
      },
    });

    return {
      totalSubscribers,
      activeSubscribers,
      unsubscribed,
      totalCampaigns,
      sentCampaigns,
      recentSubscriptions,
      subscriptionRate: totalSubscribers > 0 
        ? ((activeSubscribers / totalSubscribers) * 100).toFixed(2) 
        : '0',
    };
  }
}
