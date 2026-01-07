import { Module } from '@nestjs/common';
import { CareerService } from './career.service';
import { CareerController } from './career.controller';
import { PrismaService } from '../prisma.service';
import { UploadModule } from '../upload/upload.module';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [UploadModule, EmailModule],
  controllers: [CareerController],
  providers: [CareerService, PrismaService],
  exports: [CareerService],
})
export class CareerModule {}
