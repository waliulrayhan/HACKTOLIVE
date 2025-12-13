import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { InstructorController } from './instructor.controller';
import { InstructorService } from './instructor.service';

@Module({
  controllers: [InstructorController],
  providers: [PrismaService, InstructorService],
  exports: [InstructorService],
})
export class InstructorModule {}
