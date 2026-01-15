import { Module } from '@nestjs/common';
import { NewsletterController } from './newsletter.controller';
import { NewsletterService } from './newsletter.service';
import { PrismaService } from '../prisma.service';
import { EmailService } from '../email/email.service';

@Module({
  controllers: [NewsletterController],
  providers: [NewsletterService, PrismaService, EmailService],
  exports: [NewsletterService],
})
export class NewsletterModule {}
