import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailTemplateService } from './email-template.service';
import { EmailTemplateController } from './email-template.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [EmailTemplateController],
  providers: [EmailService, EmailTemplateService, PrismaService],
  exports: [EmailService, EmailTemplateService],
})
export class EmailModule {}
