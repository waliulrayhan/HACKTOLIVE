import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { EpsService } from './eps.service';
import { PrismaService } from '../prisma.service';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [HttpModule, EmailModule],
  controllers: [PaymentController],
  providers: [PaymentService, EpsService, PrismaService],
  exports: [PaymentService, EpsService],
})
export class PaymentModule {}
