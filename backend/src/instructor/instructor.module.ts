import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { InstructorController } from './instructor.controller';
import { InstructorService } from './instructor.service';
import { CertificateGeneratorService } from '../academy/certificates/certificate-generator.service';

@Module({
  controllers: [InstructorController],
  providers: [PrismaService, InstructorService, CertificateGeneratorService],
  exports: [InstructorService],
})
export class InstructorModule {}
