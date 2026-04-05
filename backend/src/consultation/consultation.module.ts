import { Module } from '@nestjs/common';
import { ConsultationService } from './consultation.service';
import { ConsultationController } from './consultation.controller';
import { PrismaService } from '../prisma.service';
import { EmailService } from '../email/email.service';

@Module({
  controllers: [ConsultationController],
  providers: [ConsultationService, PrismaService, EmailService],
  exports: [ConsultationService],
})
export class ConsultationModule {}
