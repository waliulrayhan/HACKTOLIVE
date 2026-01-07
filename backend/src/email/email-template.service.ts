import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { EmailService } from './email.service';
import {
  CreateEmailTemplateDto,
  UpdateEmailTemplateDto,
  FilterEmailTemplateDto,
} from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class EmailTemplateService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  async create(createEmailTemplateDto: CreateEmailTemplateDto) {
    return this.prisma.emailTemplate.create({
      data: {
        ...createEmailTemplateDto,
        variables: JSON.stringify(createEmailTemplateDto.variables),
      },
    });
  }

  async findAll(filterDto: FilterEmailTemplateDto) {
    const { search, type, isActive } = filterDto;

    const where: Prisma.EmailTemplateWhereInput = {
      ...(search && {
        OR: [
          { name: { contains: search } },
          { slug: { contains: search } },
          { description: { contains: search } },
        ],
      }),
      ...(type && { type }),
      ...(isActive !== undefined && { isActive }),
    };

    const templates = await this.prisma.emailTemplate.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            logs: true,
          },
        },
      },
    });

    return templates.map((template) => ({
      ...template,
      variables: JSON.parse(template.variables),
    }));
  }

  async findOne(id: string) {
    const template = await this.prisma.emailTemplate.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            logs: true,
          },
        },
      },
    });

    if (!template) {
      throw new NotFoundException(`Email template with ID ${id} not found`);
    }

    return {
      ...template,
      variables: JSON.parse(template.variables),
    };
  }

  async update(id: string, updateEmailTemplateDto: UpdateEmailTemplateDto) {
    try {
      const updateData: any = { ...updateEmailTemplateDto };
      
      if (updateEmailTemplateDto.variables) {
        updateData.variables = JSON.stringify(updateEmailTemplateDto.variables);
      }

      const template = await this.prisma.emailTemplate.update({
        where: { id },
        data: updateData,
      });

      return {
        ...template,
        variables: JSON.parse(template.variables),
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Email template with ID ${id} not found`);
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.emailTemplate.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Email template with ID ${id} not found`);
      }
      throw error;
    }
  }

  async getStats() {
    const [
      totalTemplates,
      activeTemplates,
      totalEmailsSent,
      failedEmails,
      recentEmailsSent,
    ] = await Promise.all([
      this.prisma.emailTemplate.count(),
      this.prisma.emailTemplate.count({ where: { isActive: true } }),
      this.prisma.emailLog.count({ where: { status: 'SENT' } }),
      this.prisma.emailLog.count({ where: { status: 'FAILED' } }),
      this.prisma.emailLog.count({
        where: {
          status: 'SENT',
          sentAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
          },
        },
      }),
    ]);

    return {
      totalTemplates,
      activeTemplates,
      totalEmailsSent,
      failedEmails,
      recentEmailsSent,
      successRate:
        totalEmailsSent + failedEmails > 0
          ? ((totalEmailsSent / (totalEmailsSent + failedEmails)) * 100).toFixed(2)
          : 0,
    };
  }

  async getEmailLogs(page: number = 1, limit: number = 50, status?: string) {
    const skip = (page - 1) * limit;

    const where: Prisma.EmailLogWhereInput = {
      ...(status && { status: status as any }),
    };

    const [logs, total] = await Promise.all([
      this.prisma.emailLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          template: {
            select: {
              name: true,
              slug: true,
            },
          },
        },
      }),
      this.prisma.emailLog.count({ where }),
    ]);

    return {
      data: logs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async sendTestEmail(templateId: string, recipientEmail: string) {
    const template = await this.findOne(templateId);

    // Parse variables and create sample data
    const variables = JSON.parse(template.variables);
    const sampleVariables: Record<string, string> = {};
    
    variables.forEach((varName: string) => {
      sampleVariables[varName] = `[Sample ${varName}]`;
    });

    // Send test email
    const sent = await this.emailService.sendTemplateEmail(
      template.slug,
      recipientEmail,
      sampleVariables,
      'Test Recipient',
      { test: true },
    );

    return {
      success: sent,
      message: sent ? 'Test email sent successfully' : 'Failed to send test email',
    };
  }
}
