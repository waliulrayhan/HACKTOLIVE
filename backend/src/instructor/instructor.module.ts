import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { InstructorController } from './instructor.controller';
import { InstructorService } from './instructor.service';
import { CertificateGeneratorService } from '../academy/certificates/certificate-generator.service';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [EmailModule],
  controllers: [InstructorController],
  providers: [PrismaService, InstructorService, CertificateGeneratorService],
  exports: [InstructorService],
})
export class InstructorModule {}
