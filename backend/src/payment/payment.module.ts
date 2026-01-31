import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { SslcommerzService } from './sslcommerz.service';
import { PrismaService } from '../prisma.service';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [HttpModule, EmailModule],
  controllers: [PaymentController],
  providers: [PaymentService, SslcommerzService, PrismaService],
  exports: [PaymentService, SslcommerzService],
})
export class PaymentModule {}
